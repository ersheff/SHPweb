let socket;

document.addEventListener('DOMContentLoaded', (event) => {
  
  console.log("Ready!");

  socket = io("/hub");
  
  socket.on("serverMessage", (incoming) => {
    console.log(incoming.message);
  });

  socket.on("control", (incoming) => {
    let val = incoming.values[0];
    document.getElementById("fromMax1").value = val;
    loopSpeed(val);
  });

});


function toMax(data) {

  let outgoing = {
    header: "fromWeb",
    values: data,
    mode: "push",
    target: "all"
  };

  socket.emit("control", outgoing);

}


/*

// messages
$(function () {
  // called when DOM is ready

  const socket = io("/hub", {
    query: {
      // username:
    },
  });

  setInterval(() => {
    const start = Date.now();
    const pingObject = { start };
    socket.volatile.emit("chPing", pingObject);
  }, 3000);

  socket.on("chPingBack", (data) => {
    const tempPing = Date.now() - data.start;
    if (tempPing !== ping) {
      $("#ping").text("Ping: "+ tempPing + " ms");
      ping = tempPing;
    }
  });

  socket.on("serverMessage", (data) => {
    console.log("--------- received serverMessage: " + data.message);
    // console.log($("#" + data.message));
    let varname = "serverMessage";
      // let messageList = document.getElementById("incoming-messages");
      // // let varname = "in-mess" + messageCount.toString();
      messageDisplay("serverMessage", "#incoming-messages", "Server: " + data.message);
      TimeOuts[varname] = startMessageFade(varname); 
  });

  socket.on("event", (data) => {
    console.log("received event: " + data.header);
    console.log($("#" + data.header));
    if ($("#" + data.header).length === 0) {
      // let messageList = document.getElementById("incoming-messages");
      // // let varname = "in-mess" + messageCount.toString();
      let varname = data.header;
      messageDisplay(varname, "#incoming-messages", varname);
      TimeOuts[varname] = startMessageFade(varname);
      let ofs = 0;
    } else {
      clearTimeout(TimeOuts[data.header]);
      console.log("clearing timing for event");
      TimeOuts[data.header] = startMessageFade(data.header);
      return false;
    }
  });

  socket.on("control", (data) => {
    console.log("received control: " + data.header);
    console.log($("#" + data.header));
    let varname = data.header;
    if ($("#" + data.header).length === 0) {
      let messageList = document.getElementById("incoming-messages");

      messageDisplay(
        varname,
        messageList,
        data.header + " - " + data.values
      );
      TimeOuts[varname] = startMessageFade(varname);
      return false;
    } else {
      // $("#" + data.header).text(data.header + " - " + data.values);
      appendMessageDisplay(varname, data.header + " - " + data.values);
      clearTimeout(TimeOuts[data.header]);
      TimeOuts[data.header] = startMessageFade(data.header);
      return false;
    }
  });

  socket.on("allControls", (data) => {
    // eliminate duplicate users
    console.log("controls list received: " + data.controls);
    var listNode = document.getElementById("allControlsList");
    console.log("UsersList Length?: " + Object.keys(data.controls).length);
    while (listNode.lastElementChild) {
      var listNode = document.getElementById("allControlsList");
      listNode.removeChild(listNode.lastElementChild);
      listNode = document.getElementById("allControlsList");
    }
    // create list of users
    for (var i = 0; i < Object.keys(data.controls).length; i++) {
      $(listNode).append(
        $("<div>")
          .attr({ class: "listItem" })
          .append(
            $("<div>")
              .attr({ class: "listItemName" })
              .text(data.controls[i].header)
          )
      );
    }
    return false;
  });

  socket.on("allEvents", (data) => {
    // eliminate duplicate users
    console.log("events list received " + data.events);
    var eventsListNode = document.getElementById("allEventsList");
    console.log("UsersList Length?: " + Object.keys(data.events).length);
    while (eventsListNode.lastElementChild) {
      var eventsListNode = document.getElementById("allEventsList");
      eventsListNode.removeChild(eventsListNode.lastElementChild);
      eventsListNode = document.getElementById("allEventsList");
    }
    // create list of users
    for (var i = 0; i < Object.keys(data.events).length; i++) {
      $(eventsListNode).append(
        $("<div>")
          .attr({ class: "listItem" })
          .append(
            $("<div>")
              .attr({ class: "listItemName" })
              .text(data.events[i].header)
          )
      );
    }
    return false;
  });

  socket.on("myUsername", (data) => {
    if (data.username !== null) {
      console.log(`received username from server: ${data.username}`);
      let usernameElement = document.getElementById("webUsername");
      usernameElement.innerHTML = data.username;
      console.log($("#webUsername").val());
      return false;
    }
    return false;
  });

  socket.on("observedControls", (data) => {
    console.log("observedControls received: " + data.controls);
    // eliminate duplicate users
    var listNode = document.getElementById("observedControlsList");
    console.log(
      "observedControls Length?: " + Object.keys(data.controls).length
    );
    while (listNode.lastElementChild) {
      listNode.removeChild(listNode.lastElementChild);
      listNode = document.getElementById("observedControlsList");
    }
    // create list of users
    for (var i = 0; i < Object.keys(data.controls).length; i++) {
      const header = data.controls[i].header;
      $("<div>")
        .attr({ class: "listItem" })
        .prependTo(listNode)
        .append(
          $("<div>")
            .attr({ class: "listItemName" })
            .append($("<div>").text(header))
        )
        .append(
          $("<div>")
            .attr({ class: "listItemButton" })
            .append($("<button>").text("Leave"))
            .on("click", function () {
              // prevents page reloading
              let obj = {
                header: header,
              };
              socket.emit("unobserveControl", obj);
              return false;
            })
        );
    }
    return false;
  });

  socket.on("observedEvents", (data) => {
    console.log("observedEvents received: " + data.events);
    console.dir(data);
    // eliminate duplicate users
    var listNode = document.getElementById("observedEventsList");
    console.log("observedEvents Length?: " + Object.keys(data.events).length);
    while (listNode.lastElementChild) {
      listNode.removeChild(listNode.lastElementChild);
      listNode = document.getElementById("observedEventsList");
    }
    // create list of users
    for (var i = 0; i < Object.keys(data.events).length; i++) {
      const header = data.events[i].header;
      $("<div>")
        .attr({ class: "listItem" })
        .prependTo(listNode)
        .append(
          $("<div>")
            .attr({ class: "listItemName" })
            .append($("<div>").text(header))
        )
        .append(
          $("<div>")
            .attr({ class: "listItemButton" })
            .append($("<button>").text("Leave"))
            .on("click", function () {
              // prevents page reloading
              let obj = {
                header: header,
              };
              socket.emit("unobserveEvent", obj);
              return false;
            })
        );
    }
    return false;
  });

  socket.on("availableRoomsList", (data) => {
    console.log("available rooms received: " + data.rooms);
    // eliminate duplicate users
    var listNode = document.getElementById("availableRoomsList");
    while (listNode.lastElementChild) {
      listNode.removeChild(listNode.lastElementChild);
      listNode = document.getElementById("availableRoomsList");
    }
    // create list of users
    for (var i = 0; i < Object.keys(data.rooms).length; i++) {
      const room = data.rooms[i];
      $("<div>")
        .attr({ class: "listItem" })
        .prependTo(listNode)
        .append(
          $("<div>")
            .attr({ class: "listItemName" })
            .append($("<div>").text(room))
        )
        .append(
          $("<div>")
            .attr({ class: "listItemButton" })
            .append($("<button>").text("Join"))
            .on("click", function () {
              // prevents page reloading
              let obj = {
                room: room,
              };
              socket.emit("joinRoom", obj);
              return false;
            })
        );
    }
    return false;
  });

  socket.on("availableControls", (data) => {
    console.log("available controls received: " + data.controls);
    // eliminate duplicate users
    var listNode = document.getElementById("availableControlsList");
    console.log(
      "availableControls Length?: " + Object.keys(data.controls).length
    );
    while (listNode.lastElementChild) {
      listNode.removeChild(listNode.lastElementChild);
      listNode = document.getElementById("availableControlsList");
    }
    // create list of users
    for (var i = 0; i < Object.keys(data.controls).length; i++) {
      const header = data.controls[i].header;
      $("<div>")
        .attr({ class: "listItem" })
        .prependTo(listNode)
        .append(
          $("<div>")
            .attr({ class: "listItemName" })
            .append($("<div>").text(header))
        )
        .append(
          $("<div>")
            .attr({ class: "listItemButton" })
            .append($("<button>").text("Observe"))
            .on("click", function () {
              // prevents page reloading
              let obj = {
                header: header,
              };
              socket.emit("observeControl", obj);
              return false;
            })
        );
    }
  });

  socket.on("availableEvents", (data) => {
    console.log("Available events received: " + data.events);
    console.dir(data.events);
    // eliminate previous event items
    var listNode = document.getElementById("availableEventsList");
    console.log("available events Length?: " + data.events.length);
    while (listNode.lastElementChild) {
      listNode.removeChild(listNode.lastElementChild);
      listNode = document.getElementById("availableEventsList");
    }
    // create list of users
    for (var i = 0; i < Object.keys(data.events).length; i++) {
      // create list items
      const header = data.events[i].header;
      $("<div>")
        .attr({ class: "listItem" })
        .prependTo(listNode)
        .append(
          $("<div>")
            .attr({ class: "listItemName" })
            .append($("<div>").text(header))
        )
        .append(
          $("<div>")
            .attr({ class: "listItemButton" })
            .append($("<button>").text("Observe"))
            .on("click", function () {
              // prevents page reloading
              let obj = {
                header: header,
              };
              socket.emit("observeEvent", obj);
              return false;
            })
        );
    }
    return false;
  });

  socket.on("allUsers", function (users) {
    // eliminate duplicate users
    var listNode = document.getElementById("usersList");
    console.log("UsersList Length?: " + Object.keys(users.users).length);
    while (listNode.lastElementChild) {
      listNode.removeChild(listNode.lastElementChild);
      listNode = document.getElementById("usersList");
    }
    // create list of users
    for (var i = 0; i < Object.keys(users.users).length; i++) {
      const header = users.users[i];
      $("<div>")
        .attr({ class: "listItem" })
        .prependTo(listNode)
        .append(
          $("<div>")
            .attr({ class: "listItemName" })
            .append($("<div>").text(header))
        );
    }
    return false;
  });

  socket.on("allRooms", function (data) {
    console.log("all rooms list: " + Object.keys(data.rooms).length);

    // eliminate duplicate users
    var listNode = document.getElementById("allRoomsList");
    console.log("UsersList Length?: " + Object.keys(data.rooms).length);
    while (listNode.lastElementChild) {
      listNode.removeChild(listNode.lastElementChild);
      listNode = document.getElementById("allRoomsList");
    }
    console.log("allRooms data " + data.rooms);
    console.table(data);
    // create list of users
    for (var i = 0; i < Object.keys(data.rooms).length; i++) {
      const header = data.rooms[i];
      $("<div>")
        .attr({ class: "listItem" })
        .prependTo(listNode)
        .append(
          $("<div>")
            .attr({ class: "listItemName" })
            .append($("<div>").text(header))
        )
    }
    return false;
  });

  socket.on("myRoomsList", function (data) {
    console.dir("myRooms list:" + data);
    console.log("myrooms list: " + Object.keys(data.rooms).length);

    // eliminate duplicate users
    var listNode = document.getElementById("myRoomsList");
    console.log("myRooms list Length?: " + Object.keys(data.rooms).length);
    while (listNode.lastElementChild) {
      listNode.removeChild(listNode.lastElementChild);
      listNode = document.getElementById("myRoomsList");
    }
    console.log("myRooms data " + data.rooms);
    console.table(data);
    // create list of users
    for (var i = 0; i < Object.keys(data.rooms).length; i++) {
      const room = data.rooms[i];
      $("<div>")
        .attr({ class: "listItem" })
        .prependTo(listNode)
        .append(
          $("<div>")
            .attr({ class: "listItemName" })
            .append($("<div>").text(room))
        )
        .append(
          $("<div>")
            .attr({ class: "listItemButton" })
            .append($("<button>").text("Leave"))
            .on("click", function () {
              // prevents page reloading
              let obj = {
                room: room,
              };
              socket.emit("leaveRoom", obj);
              return false;
            })
        );
    }
    return false;
  });

  socket.on("otherUsers", function (users) {
    console.log("new other users list: " + Object.keys(users.users).length);

    // eliminate duplicate users
    var listNode = document.getElementById("otherUserList");
    console.log("UsersList Length?: " + Object.keys(users.users).length);
    while (listNode.lastElementChild) {
      listNode.removeChild(listNode.lastElementChild);
      listNode = document.getElementById("otherUserList");
    }
    console.log("otherUsers data " + users);
    // create list of users
    for (var i = 0; i < Object.keys(users.users).length; i++) {
      const header = users.users[i];
      $("<div>")
        .attr({ class: "listItem" })
        .prependTo(listNode)
        .append(
          $("<div>")
            .attr({ class: "listItemName" })
            .append($("<div>").text(header))
        );
    }
    return false;
  });

  socket.on("chat", function (data) {
    console.log("chat message received");
    // eliminate duplicate users
    var chatListNode = document.getElementById("messages");
    // console.log("chat Length: " + Object.keys(users).length);
    while (chatListNode.lastElementChild) {
      chatListNode.removeChild(chatListNode.lastElementChild);
      chatListNode = document.getElementById("messages");
    }

    // form chat message 1. user 2. message
    // $("#messages").append($("<li>").text("User: " + data.id));
    // $("#messages").append($("<li>").text(data.chat));

    chatDisplay("#messages", data.id, data.chat);
    console.log("updating messages");
    return false;
  });

  // interface functions
  $("#event-button1").click(function () {
    let eventObj = {
      header: $("#event-button1").val(),
      mode: "publish",
      target: "all",
    };
    socket.emit("event", eventObj);
    console.log($("#event-button1").val() + " triggered");
    return false; // false does not reload the page
  });

  $("#event-button2").click(function () {
    let eventObj = {
      header: $("#event-button2").val(),
      mode: "publish",
      target: "123",
    };
    socket.emit("event", eventObj);
    console.log($("#event-button2").val() + " triggered");
    return false; // false does not reload the page
  });

  $("#event-button3").click(function () {
    let eventObj = {
      header: $("#event-button3").val(),
      mode: "push",
      target: "all",
    };
    socket.emit("event", eventObj);
    console.log($("#event-button3").val() + " triggered");
    return false; // false does not reload the page
  });

  $("#event-button4").click(function () {
    let eventObj = {
      header: $("#event-button4").val(),
      mode: "push",
      target: "123",
    };
    socket.emit("event", eventObj);
    console.log($("#event-button4").val() + " triggered");
    return false; // false does not reload the page
  });

  //

  $("#event-button1-text").change("input", function () {
    console.log("text change");
    var val = $("#event-button1-text").val();
    console.log(val);
    val = val.replace(/\s+/g, "");
    $("#event-button1").html(`event ${val}`);
    $("#event-button1").val(val);
    console.log($("#event-button1").val());
    $("#event-button1-text")
      .attr("placeholder", "Change Header")
      .val("")
      .focus()
      .blur();
      return false;
  });

  $("#event-button2-text").change("input", function () {
    console.log("text change");
    var val = $("#event-button2-text").val();
    console.log(val);
    val = val.replace(/\s+/g, "");
    $("#event-button2").html(`event ${val}`);
    $("#event-button2").val(val);
    console.log($("#event-button2").val());
    $("#event-button2-text")
      .attr("placeholder", "Change Header")
      .val("")
      .focus()
      .blur();
      return false;
  });

  $("#event-button3-text").change("input", function () {
    console.log("text change");
    var val = $("#event-button3-text").val();
    console.log(val);
    val = val.replace(/\s+/g, "");
    $("#event-button3").html(`event ${val}`);
    $("#event-button3").val(val);
    console.log($("#event-button3").val());
    $("#event-button3-text")
      .attr("placeholder", "Change Header")
      .val("")
      .focus()
      .blur();
      return false;
  });

  $("#event-button4-text").change("input", function () {
    console.log("text change");
    var val = $("#event-button4-text").val();
    console.log(val);
    val = val.replace(/\s+/g, "");
    $("#event-button4").html(`event ${val}`);
    $("#event-button4").val(val);
    console.log($("#event-button4").val());
    $("#event-button4-text")
      .attr("placeholder", "Change Header")
      .val("")
      .focus()
      .blur();
      return false;
  });

  $("#control-webSlider1").on("input", function () {
    var val = Number($("#control-webSlider1").val());
    $("#slider1-label").text(`control webSlider1 ${val}`);
    socket.emit("control", {
      header: "webSlider1",
      values: val,
      mode: "publish",
      target: "all",
    });
    console.log("control", {
      header: "webSlider1",
      values: val,
      mode: "publish",
      target: "all",
    });
    return false; // false does not reload the page
  });

  $("#control-webSlider2").on("input", function () {
    var val = Number($("#control-webSlider2").val());
    $("#slider2-label").text(`control webSlider2 ${val}`);
    socket.emit("control", {
      header: "webSlider2",
      values: val,
      mode: "publish",
      target: "123",
    });
    console.log("control", {
      header: "webSlider2",
      values: val,
      mode: "publish",
      target: "123",
    });
    return false; // false does not reload the page
  });

  $("#control-webSlider3").on("input", function () {
    var val = Number($("#control-webSlider3").val());
    $("#slider3-label").text(`control webSlider3 ${val}`);
    socket.emit("control", {
      header: "webSlider3",
      values: val,
      mode: "push",
      target: "all",
    });
    console.log("control", {
      header: "webSlider3",
      values: val,
      mode: "push",
      target: "all",
    });
    return false; // false does not reload the page
  });

  $("#control-webSlider4").on("input", function () {
    var val = Number($("#control-webSlider4").val());
    $("#slider4-label").text(`control webSlider4 ${val}`);
    socket.emit("control", {
      header: "webSlider4",
      values: val,
      mode: "push",
      target: "123",
    });
    console.log("control", {
      header: "webSlider4",
      values: val,
      mode: "push",
      target: "123",
    });
    return false; // false does not reload the page
  });

  // change Username
  $("#username-text").change("input", function () {
    console.log("username change");
    var val = $("#username-text").val();
    console.log(val);
    val = val.replace(/\s+/g, "");
    document.getElementById("webUsername").innerHTML = val;
    localUsername = val;

    let usernameObject = {
      username: val,
    };

    socket.emit("addUsername", usernameObject);

    $("#webUsername").val(val);
    console.log("changing username" + $("#webUsername").val());
    $("#username-text")
      .attr("placeholder", "Change Header")
      .val("")
      .focus()
      .blur();
    return false;
  });

  // join room form
  $("#join-room-form").submit(function (e) {
    e.preventDefault(); // prevents page reloading
    let roomObject = {
      room: $("#j").val(),
    };
    socket.emit("joinRoom", roomObject);
    $("#j").val("");
    return false;
  });

  // chat form
  $("#chat-form").submit(function (e) {
    e.preventDefault(); // prevents page reloading
    let chatObject = {
      chat: $("#m").val(),
      target: $("#target-text").val(),
    };
    socket.emit("chat", chatObject);
    $("#m").val("");
    $("#target-text").val("");
    return false;
  });

  // observe control
  $("#observe-control-form").submit(function (e) {
    e.preventDefault(); // prevents page reloading
    let obj = {
      header: $("#oc").val(),
    };
    socket.emit("observeControl", obj);
    $("#oc").val("");
    return false;
  });

  // unobserve control
  $("#unobserve-control-form").submit(function (e) {
    e.preventDefault(); // prevents page reloading
    let obj = {
      header: $("#uc").val(),
    };
    socket.emit("unobserveControl", obj);
    $("#uc").val("");
    return false;
  });

  // observe event
  $("#observe-event-form").submit(function (e) {
    e.preventDefault(); // prevents page reloading
    let obj = {
      header: $("#oe").val(),
    };
    socket.emit("observeEvent", obj);
    $("#oe").val("");
    return false;
  });

  // unobserve control
  $("#unobserve-event-form").submit(function (e) {
    e.preventDefault(); // prevents page reloading
    let obj = {
      header: $("#ue").val(),
    };
    socket.emit("unobserveEvent", obj);
    $("#ue").val("");
    return false;
  });

  $("#oact").click(function () {
    let eventObj = {
      observe: true,
    };
    socket.emit("observeAllControl", eventObj);
    console.log("observeallcontrol true triggered");
    return false; // false does not reload the page
  });

  $("#oacf").click(function () {
    let eventObj = {
      observe: false,
    };
    socket.emit("observeAllControl", eventObj);
    console.log("observeallcontrol false triggered");
    return false; // false does not reload the page
  });

  // observe all events
  $("#oaet").click(function () {
    let eventObj = {
      observe: true,
    };
    socket.emit("observeAllEvents", eventObj);
    console.log("observeAllEvents true triggered");
    return false; // false does not reload the page
  });

  $("#oaef").click(function () {
    let eventObj = {
      observe: false,
    };
    socket.emit("observeAllEvents", eventObj);
    console.log("observeAllEvents false triggered");
    return false; // false does not reload the page
  });

  //

  function startMessageFade(listItemId) {
    // $("#"+listItemId).stop().fadeIn(10).delay( 1800 ).fadeOut( 400 );
    let toVar = setTimeout(messageFade, 3000, listItemId);
    return toVar;
  }

  const messageFade = (listItemId) => {
    console.log("removing message soon..." + listItemId);
    const listItem = $("#" + listItemId);
    console.log("found item by id - " + listItem);
    listItem.fadeOut(300, ()=> listItem.remove());
    // listItem.fadeOut(300).delay(300).remove();
    return false;
  };

  const messageDisplay = (id, prependTo, text) => {
    $("<div>")
      .attr({ id: id, class: "listItem" })
      .prependTo($(prependTo))
      .append($("<div>").attr({ id: "text", class: "listItemName" }).text(text));
      const listItem = $("#" + id);
      listItem.hide().fadeIn(1000);
      return false;
  };

  const appendMessageDisplay = (id, text) => {
    console.log('appending message');
    console.log($("#"+id).find('#text'));
    $("#"+id).find("#text").text(text);
    // $("#"+id).show(2000).delay(1800).fadeOut( 400 );
    return false;
  };

  const chatDisplay = (prependTo, id, text) => {
    $("<div>")
      .attr({ id: id, class: "chatContainer" })
      .prependTo($(prependTo))
      .append($("<div>").attr({ id: "chatid", class: "chatid" }).text(id))
      .append($("<div>").attr({ id: "text", class: "chattext" }).text(text));
      const listItem = $("#" + id);
      listItem.hide().fadeIn(1000);
      return false;
  }

});
*/

var localUsername = "";

// messages
$(function() { // called when DOM is ready

  // establishes a socket.io connection
  var socket = io();

  ///--------------------------------------------------------------

  // const options = {
  //   udpServer: {
  //     port: 3333
  //   }
  // }
  //
  // const osc = new OSC({ plugin: new OSC.BridgePlugin(options) });
  // osc.open();
  // osc.send(new OSC.Message('/test'), { receiver: 'udp' }) ;
  // const message = new OSC.Message('/test/path', 521.25, 'teststring', 665);
  // osc.send(message);

  // /------------/

  socket.on('users', function(users) {
    if (localUsername == "") {
      document.getElementById('webUsername').innerHTML = socket.id;
    }

    console.log("new users list: " + Object.keys(users).length);

    // eliminate duplicate users
    var usersListNode = document.getElementById("usersList");
    console.log("UsersList Length: " + Object.keys(users).length);
    while (usersListNode.lastElementChild) {
      usersListNode.removeChild(usersListNode.lastElementChild);
      usersListNode = document.getElementById("usersList");
    }

    // create list of users
    for (var i = 0; i < Object.keys(users).length; i++) {
      if (users[i].username != "") {
        $('#usersList').append($('<li>').text(users[i].username));
      } else {
        $('#usersList').append($('<li>').text(users[i].id));
      }
      console.log("iterating... " + i);
      // $('#usersList').append($('<li>').text(msg));
    }
    return false;
  });

  socket.on('event', function(event) {
    if (event == "graininess") {
      // console.log("grainy!");
      $("#indicator1").trigger("click");
    };
  });

  $("#indicator1")
    .on("click", function(){
    $("#indicator1").addClass('animate');
  });
    $("#indicator1").one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function(){
    $("#indicator1").removeClass('animate');
  });

  socket.on('chat', function(data) {
    console.log("chat message received");
    // eliminate duplicate users
    var chatListNode = document.getElementById("messages");
    // console.log("chat Length: " + Object.keys(users).length);
    while (chatListNode.lastElementChild) {
      chatListNode.removeChild(chatListNode.lastElementChild);
      chatListNode = document.getElementById("messages");
    }

    // form chat message 1. user 2. message
    $('#messages').append($('<li>').text("User: " + data.id));
    $('#messages').append($('<li>').text(data.chat));
    console.log("updating messages");
    // $('#usersList').append($('<li>').text(msg));
    return false;
  });

  // interface functions
  $('#event-button1').click(function() {
    socket.emit('event', $('#event-button1').val());
    console.log($('#event-button1').val() + " triggered");
    return false; // false does not reload the page
  });

  $('#event-button2').click(function() {
    socket.emit('event', $('#event-button2').val());
    console.log($('#event-button2').val() + " triggered");
    return false; // false does not reload the page
  });

  $('#event-button3').click(function() {
    socket.emit('event', $('#event-button3').val());
    console.log($('#event-button3').val() + " triggered");
    return false; // false does not reload the page
  });

  $('#event-button4').click(function() {
    socket.emit('event', $('#event-button4').val());
    console.log($('#event-button4').val() + " triggered");
    return false; // false does not reload the page
  });

  //

  $('#event-button1-text').change('input', function() {
    console.log("text change");
    var val = $('#event-button1-text').val();
    console.log(val);
    val = val.replace(/\s+/g, '');
    $('#event-button1').html(`event ${val}`);
    $('#event-button1').val(val);
    console.log($('#event-button1').val());
    $('#event-button1-text').attr("placeholder", "Change Header").val("").focus().blur();
  })

  $('#event-button2-text').change('input', function() {
    console.log("text change");
    var val = $('#event-button2-text').val();
    console.log(val);
    val = val.replace(/\s+/g, '');
    $('#event-button2').html(`event ${val}`);
    $('#event-button2').val(val);
    console.log($('#event-button2').val());
    $('#event-button2-text').attr("placeholder", "Change Header").val("").focus().blur();
  })

  $('#event-button3-text').change('input', function() {
    console.log("text change");
    var val = $('#event-button3-text').val();
    console.log(val);
    val = val.replace(/\s+/g, '');
    $('#event-button3').html(`event ${val}`);
    $('#event-button3').val(val);
    console.log($('#event-button3').val());
    $('#event-button3-text').attr("placeholder", "Change Header").val("").focus().blur();
  })

  $('#event-button4-text').change('input', function() {
    console.log("text change");
    var val = $('#event-button4-text').val();
    console.log(val);
    val = val.replace(/\s+/g, '');
    $('#event-button4').html(`event ${val}`);
    $('#event-button4').val(val);
    console.log($('#event-button4').val());
    $('#event-button4-text').attr("placeholder", "Change Header").val("").focus().blur();
  })

  //

  $('#control-webSlider1').on('input', function() {
    var val = Number($('#control-webSlider1').val());
    $('#slider1-label').text(`control webSlider1 ${val}`);
    socket.emit('control', {
      header: 'webSlider1',
      values: [val]
    });
    console.log('control', {
      header: 'webSlider1',
      values: [val]
    });
    return false; // false does not reload the page
  });

  $('#control-webSlider2').on('input', function() {
    var val = Number($('#control-webSlider2').val());
    $('#slider2-label').text(`control webSlider2 ${val}`);
    socket.emit('control', {
      header: 'webSlider2',
      values: [val]
    });
    console.log('control', {
      header: 'webSlider2',
      values: [val]
    });
    return false; // false does not reload the page
  });

  $('#control-webSlider3').on('input', function() {
    var val = Number($('#control-webSlider3').val());
    $('#slider3-label').text(`control webSlider3 ${val}`);
    socket.emit('control', {
      header: 'webSlider3',
      values: [val]
    });
    console.log('control', {
      header: 'webSlider3',
      values: [val]
    });
    return false; // false does not reload the page
  });

  $('#control-webSlider4').on('input', function() {
    var val = Number($('#control-webSlider4').val());
    $('#slider4-label').text(`control webSlider4 ${val}`);
    socket.emit('control', {
      header: 'webSlider4',
      values: [val]
    });
    console.log('control', {
      header: 'webSlider4',
      values: [val]
    });
    return false; // false does not reload the page
  });

  // change Username
  $('#username-text').change('input', function() {
    console.log("username change");
    var val = $('#username-text').val();
    console.log(val);
    val = val.replace(/\s+/g, '');
    // $('#webUsername').html(`event ${val}`);
    // $('#webUsername').text(`Terst`);
    document.getElementById('webUsername').innerHTML = val;
    localUsername = val;
    socket.emit('addUsername', val);
    $('#webUsername').val(val);
    console.log($('#webUsername').val());
    $('#username-text').attr("placeholder", "Change Header").val("").focus().blur();
  })

  // chat form

  $('form').submit(function(e) {
    e.preventDefault(); // prevents page reloading
    socket.emit('chat', $('#m').val());
    $('#m').val('');
    return false;
  });

  //

  $('#collectible-button').click(function() {
    socket.emit('spawnCollectible');
    console.log("spawning collectible");
    return false; // false does not reload the page
  });

  $('#dec-tempo').click(function() {
    socket.emit('decreaseTempo', socket.id);
    console.log("decreasing Tempo");
    return false; // false does not reload the page
  });

  $('#inc-tempo').click(function() {
    socket.emit('increaseTempo', socket.id);
    console.log("increasing Tempo");
    return false; // false does not reload the page
  });
});

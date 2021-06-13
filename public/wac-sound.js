const vol = new Tone.Volume(-127).toDestination();
const player = new Tone.Player("http://localhost:3000/vibes.mp3").connect(vol);
//const osc = new Tone.Oscillator( { frequency: 220, type: "triangle" } ).connect(vol).start();

player.autostart = true;
player.loop = true;

function loopVol(data) {
    let scaleVol = data-127;
    vol.volume.value = scaleVol;
}

function loopSpeed(data){
    let scaleSpeed = data*.0157;
    player.playbackRate = scaleSpeed;
}


/*
$(function () {
    $('#volSlider').on('input', function() {
        volSetting = $('#volSlider').val();
        volume.volume.value = volSetting;
        return false;
    });
});*/
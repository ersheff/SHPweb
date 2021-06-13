let osc1 = new Tone.Oscillator( { frequency: 100 } ).toDestination().start();

function changeFreq(freq) {
    osc1.frequency.value = freq;
    console.log("Frequency: " + freq);
}


/*
$(function () {
    $('#volSlider').on('input', function() {
        volSetting = $('#volSlider').val();
        volume.volume.value = volSetting;
        return false;
    });
});*/
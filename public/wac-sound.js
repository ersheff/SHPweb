const theD = 73.42;
const theFreq = 100;

const vol = new Tone.Volume(-18).toDestination();
const fb = new Tone.FeedbackDelay(.2, 0.6).connect(vol);
const filter = new Tone.Filter(theFreq, "lowpass").connect(fb);
const drone1 = new Tone.Oscillator( { frequency: theD, type: "sawtooth" } ).connect(filter).start();
const drone2 = new Tone.Oscillator( { frequency: theD, type: "sawtooth" } ).connect(filter).start();
const drone3 = new Tone.Oscillator( { frequency: theD, type: "sawtooth" } ).connect(filter).start();
const drone4 = new Tone.Oscillator( { frequency: theD, type: "sawtooth" } ).connect(filter).start();

function changeDrone(data) {
    let filterFreq = (Math.abs(data)*3) + 30;
    let freqScale = data*.025;
    filter.frequency.value = filterFreq;
    drone2.frequency.value = theD+freqScale;
    drone3.frequency.value = theD+(freqScale*1.5);
    drone4.frequency.value = theD+(freqScale*2);
}
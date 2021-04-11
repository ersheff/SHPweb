let cutoff = 700;
let freq1 = 36.71;
let freq2 = 73.42;
let freq3 = 146.84;
let freq4 = 293.68;
let dt1 = .0109;

let lfo1 = new Tone.LFO( {min: dt1*.95, max: dt1*1.05, frequency: .01 } ).start();

let lfo2 = new Tone.LFO( {min: freq3*0.99, max: freq3*1.01, frequency: .011 } ).start();

let lfo3 = new Tone.LFO( {min: cutoff*0.3, max: cutoff*2.0 } ).start();

let lfo4 = new Tone.LFO( {min: 0.01, max: 0.05, frequency: 0.01 } ).start();

let volume = new Tone.Volume( { volume: -24 } ).toDestination();

let osc1 = new Tone.Oscillator( { frequency: freq2 } ).connect(volume).start();
let osc2 = new Tone.Oscillator( { frequency: freq3 } ).connect(volume).start();
let osc3 = new Tone.Oscillator( { frequency: freq4 } ).connect(volume).start();
let osc4 = new Tone.Oscillator().connect(volume).start();

let bwow1 = new Tone.FeedbackDelay( { delayTime: dt1, feedback: 0.99 } );
let bwow2 = new Tone.FeedbackDelay( { feedback: 0.99 } );

let lowpass = new Tone.Filter();

lfo1.connect(bwow2.delayTime);
lfo2.connect(osc4.frequency);
lfo3.connect(lowpass.frequency);
lfo4.connect(lfo3.frequency);

lowpass.connect(bwow1);
lowpass.connect(bwow2);

bwow1.connect(volume);
bwow2.connect(volume);

let pnoise = new Tone.Noise( { type: 'white' } ).connect(lowpass).start(); // create and start pink noise generator
let osc = new Tone.Oscillator(); // create a new Oscillator 'object'

osc.frequency.value = 220.0;  // set this way because it is a signal
osc.toMaster(); // connect it to the main audio output
osc.start();  // START ME UP!

const synth = new Tone.Synth().toDestination();

document.getElementById("play-button").addEventListener("click", function () {
    if (Tone.Transport.state !== 'started') {
        Tone.start();
    }
    const now = Tone.now()
    synth.triggerAttackRelease("C4", "8n", now)
    synth.triggerAttackRelease("E4", "8n", now + 0.5)
    synth.triggerAttackRelease("G4", "8n", now + 1)
});
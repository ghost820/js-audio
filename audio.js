let audioCtx;
let mediaStreamSource;
let analyser;
navigator.mediaDevices.getUserMedia({ audio: true }).then(userMedia => {
    audioCtx = new AudioContext();
    mediaStreamSource = audioCtx.createMediaStreamSource(userMedia);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    mediaStreamSource.connect(analyser);
}).catch(err => {
    alert('Failed to access microphone: ' + err);
});

function getTimeData() {
    try {
        const result = new Uint8Array(analyser.fftSize);
        // no signal = 128
        analyser.getByteTimeDomainData(result);
        return result;
    }
    catch (err) {
        return new Uint8Array(2048).fill(128);
    }
}

export default { getTimeData };
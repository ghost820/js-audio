import audio from './audio.js';

const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
const ctx = canvas.getContext('2d');

function plot(data, normFactor = 128) {
    ctx.lineWidth = 10;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#ff7c00');
    gradient.addColorStop(1, '#ffcc00');
    ctx.strokeStyle = gradient;

    ctx.beginPath();
    let x = 0;
    for (let i = 0; i < data.length; i++) {
        const y = ((data[i] / normFactor) * canvas.height) / 2;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }

        x += canvas.width / data.length;
    }
    ctx.stroke();
}

function bar(data, normFactor = 255) {
    ctx.fillStyle = 'red';

    let x = 0;
    for (let i = 0; i < data.length; i++) {
        const gapSize = 2;
        const sizeOfAllGaps = (data.length - 1) * gapSize;
        const barWidth = (canvas.width - sizeOfAllGaps) / data.length;
        const barHeight = canvas.height * (data[i] / normFactor) / 2;

        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

        x += barWidth + gapSize;
    }
}

function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    plot(audio.getTimeData());
    bar(audio.getFreqData());

    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
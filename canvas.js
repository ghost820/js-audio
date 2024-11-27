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
    ctx.lineWidth = 3;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#00ff00');
    gradient.addColorStop(1, '#004400');
    ctx.strokeStyle = gradient;
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 10;

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
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#009900');
    gradient.addColorStop(1, '#004400');
    ctx.fillStyle = gradient;
    ctx.shadowColor = '#009900';
    ctx.shadowBlur = 15;

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

const particles = [];
for (let i = 0; i < 100; i++) {
    particles.push({
        x: canvas.width * Math.random(),
        y: canvas.height * Math.random(),
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5,
        color: `rgba(0, 255, 0, ${Math.random()})`
    });
}

function frame() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        particle.y -= particle.speed;
        if (particle.y < 0) {
            particle.y = canvas.height;
        }
    });

    plot(audio.getTimeData());
    bar(audio.getFreqData());

    requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
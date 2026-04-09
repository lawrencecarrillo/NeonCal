const cal = document.getElementById('calendar');
const daySelect = document.getElementById('daySelect');

function init() {
    // April 2026 starts on Wednesday (3 spacers)
    const spacers = 3;
    const totalDays = 30;
    cal.innerHTML = "";
    daySelect.innerHTML = "";

    for (let i = 0; i < spacers; i++) {
        const div = document.createElement('div');
        div.className = 'day-tile';
        div.style.border = "none";
        cal.appendChild(div);
    }

    for (let i = 1; i <= totalDays; i++) {
        const day = document.createElement('div');
        day.className = 'day-tile';
        day.id = `day-${i}`;
        day.innerHTML = `<span style="font-size:12px opacity:0.6">${i}</span>`;
        cal.appendChild(day);

        let opt = document.createElement('option');
        opt.value = i;
        opt.innerText = `April ${i}`;
        daySelect.appendChild(opt);
    }
}

function setTheme(t) {
    document.body.className = t === 'neon' ? 'theme-neon' : `theme-${t}`;
}

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value;
    const startDay = parseInt(daySelect.value);
    const interval = parseInt(document.getElementById('recurrenceSelect').value);

    if (!text) return;

    // AI SMART-SENSING LOGIC
    let type = 'task'; // Default
    const lowerText = text.toLowerCase();
    if (lowerText.includes('$') || lowerText.includes('pay') || lowerText.includes('rent')) type = 'bill';
    if (lowerText.includes('meet') || lowerText.includes('appt') || lowerText.includes('with')) type = 'event';

    function inject(d) {
        const box = document.getElementById(`day-${d}`);
        if (!box) return;
        const pill = document.createElement('div');
        pill.className = `task-pill type-${type}`;
        pill.innerHTML = `<span>${text}</span> <div onclick="this.parentElement.classList.toggle('completed'); confetti({particleCount:30})">⚡</div>`;
        box.appendChild(pill);
    }

    inject(startDay);
    if (interval > 0) {
        let next = startDay + interval;
        while (next <= 30) {
            inject(next);
            next += interval;
        }
    }

    input.value = "";
    confetti({ particleCount: 100, colors: ['#ff00ff', '#00ffff'] });
}

init();
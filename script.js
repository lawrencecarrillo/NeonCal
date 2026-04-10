const cal = document.getElementById('calendar');
const daySelect = document.getElementById('daySelect');

// 1. Build 2026 April Calendar (Starts on Wed)
function initCalendar() {
    const startDayOffset = 3; // Wed
    const daysInMonth = 30;
    cal.innerHTML = "";
    daySelect.innerHTML = "";

    for (let i = 0; i < startDayOffset; i++) {
        const spacer = document.createElement('div');
        spacer.className = 'day-tile';
        spacer.style.border = "none";
        cal.appendChild(spacer);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'day-tile';
        day.id = `day-${i}`;
        day.innerHTML = `<span style="opacity: 0.5; font-size: 10px;">${i}</span>`;
        cal.appendChild(day);

        const opt = document.createElement('option');
        opt.value = i;
        opt.innerText = `April ${i}`;
        daySelect.appendChild(opt);
    }
}

// 2. Theme Toggle
function setTheme(t) {
    document.body.className = (t === 'neon') ? 'theme-neon' : `theme-${t}`;
}

// 3. AI Task Addition
function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value;
    const startDay = parseInt(daySelect.value);
    const interval = parseInt(document.getElementById('recurrenceSelect').value);

    if (!text) return;

    // AI INTENT PARSING
    let type = 'task'; 
    const lower = text.toLowerCase();
    if (lower.includes('$') || lower.includes('pay') || lower.includes('bill')) type = 'bill';
    if (lower.includes('meet') || lower.includes('with') || lower.includes('appt')) type = 'event';

    function createPill(d) {
        const box = document.getElementById(`day-${d}`);
        if (!box) return;

        const pill = document.createElement('div');
        pill.className = `task-pill type-${type}`;
        pill.innerHTML = `
            <span>${text}</span>
            <div class="task-actions">
                <button class="task-btn" onclick="this.parentElement.parentElement.classList.toggle('completed'); confetti({particleCount:40})">⚡</button>
                <button class="task-btn" onclick="this.parentElement.parentElement.remove()">🗑️</button>
            </div>
        `;
        box.appendChild(pill);
    }

    // Initial Place
    createPill(startDay);

    // Recurring Loop
    if (interval > 0) {
        let next = startDay + interval;
        while (next <= 30) {
            createPill(next);
            next += interval;
        }
    }

    input.value = "";
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
}

initCalendar();
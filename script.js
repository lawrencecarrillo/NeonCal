const cal = document.getElementById('calendar');
const daySelect = document.getElementById('daySelect');

// The list of categories for manual cycling
const types = ['task', 'bill', 'event', 'doctor', 'holiday', 'self'];

function init() {
    const startDayOffset = 3; // April 2026 starts on Wednesday
    cal.innerHTML = "";
    daySelect.innerHTML = "";

    // 1. Create Spacers for Sunday-Saturday alignment
    for (let i = 0; i < startDayOffset; i++) {
        const spacer = document.createElement('div');
        spacer.className = 'day-tile'; spacer.style.border = "none";
        cal.appendChild(spacer);
    }

    // 2. Create April Boxes
    for (let i = 1; i <= 30; i++) {
        const day = document.createElement('div');
        day.className = 'day-tile'; day.id = `day-${i}`;
        day.innerHTML = `<span style="opacity:0.5; font-size:10px">${i}</span>`;
        cal.appendChild(day);

        let opt = document.createElement('option');
        opt.value = i; opt.innerText = `April ${i}`;
        daySelect.appendChild(opt);
    }
}

function setTheme(t) {
    document.body.className = `theme-${t}`;
}

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value;
    const startDay = parseInt(daySelect.value);
    const interval = parseInt(document.getElementById('recurrenceSelect').value);

    if (!text) return;

    // --- AI SMART SENSING ---
    let type = 'task';
    const lower = text.toLowerCase();
    if (lower.includes('$') || lower.includes('pay') || lower.includes('rent')) type = 'bill';
    else if (lower.includes('dr') || lower.includes('doctor') || lower.includes('dentist')) type = 'doctor';
    else if (lower.includes('party') || lower.includes('holiday') || lower.includes('birthday')) type = 'holiday';
    else if (lower.includes('gym') || lower.includes('yoga') || lower.includes('meditate')) type = 'self';
    else if (lower.includes('meet') || lower.includes('zoom') || lower.includes('call')) type = 'event';

    function inject(d) {
        const box = document.getElementById(`day-${d}`);
        if (!box) return;

        const pill = document.createElement('div');
        pill.className = `task-pill type-${type}`;
        pill.dataset.typeIndex = types.indexOf(type);
        
        // MANUAL OVERRIDE: Click the pill to change color
        pill.onclick = function(e) {
            let currentIndex = parseInt(this.dataset.typeIndex);
            let nextIndex = (currentIndex + 1) % types.length;
            this.className = `task-pill type-${types[nextIndex]}`;
            this.dataset.typeIndex = nextIndex;
        };

        pill.innerHTML = `
            <span>${text}</span>
            <div style="display:flex; gap:5px;">
                <button onclick="event.stopPropagation(); this.parentElement.parentElement.classList.toggle('completed'); confetti({particleCount:30})" style="cursor:pointer; border:none; border-radius:3px;">⚡</button>
                <button onclick="event.stopPropagation(); this.parentElement.parentElement.remove()" style="cursor:pointer; border:none; border-radius:3px;">🗑️</button>
            </div>
        `;
        box.appendChild(pill);
    }

    inject(startDay);

    // Recurring Logic
    if (interval > 0) {
        let next = startDay + interval;
        while (next <= 30) {
            inject(next);
            next += interval;
        }
    }

    input.value = "";
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 } });
}

init();
const cal = document.getElementById('calendar');
const daySelect = document.getElementById('daySelect');

function init() {
    const startDayOffset = 3; // April 2026 starts Wed
    cal.innerHTML = ""; daySelect.innerHTML = "";

    for (let i = 0; i < startDayOffset; i++) {
        const spacer = document.createElement('div');
        spacer.className = 'day-tile'; spacer.style.border = "none";
        cal.appendChild(spacer);
    }

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

function setTheme(t) { document.body.className = t === 'neon' ? '' : `theme-${t}`; }

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value;
    const startDay = parseInt(daySelect.value);
    const interval = parseInt(document.getElementById('recurrenceSelect').value);

    if (!text) return;

    // --- ADVANCED AI SMART-SENSING ---
    let type = 'task'; 
    const lower = text.toLowerCase();

    // AI Categorization Rules:
    if (lower.includes('$') || lower.includes('pay') || lower.includes('rent') || lower.includes('bill')) {
        type = 'bill';
    } else if (lower.includes('dr') || lower.includes('doctor') || lower.includes('dentist') || lower.includes('meds')) {
        type = 'doctor';
    } else if (lower.includes('holiday') || lower.includes('party') || lower.includes('birthday') || lower.includes('vacation')) {
        type = 'holiday';
    } else if (lower.includes('gym') || lower.includes('spa') || lower.includes('yoga') || lower.includes('meditate')) {
        type = 'self';
    } else if (lower.includes('meet') || lower.includes('with') || lower.includes('call') || lower.includes('zoom')) {
        type = 'event';
    }

    function inject(d) {
        const box = document.getElementById(`day-${d}`);
        if (!box) return;
        const pill = document.createElement('div');
        pill.className = `task-pill type-${type}`;
        pill.innerHTML = `
            <span>${text}</span>
            <div style="display:flex; gap:5px;">
                <button onclick="this.parentElement.parentElement.classList.toggle('completed'); confetti({particleCount:40})" style="cursor:pointer; border:none; border-radius:3px;">⚡</button>
                <button onclick="this.parentElement.parentElement.remove()" style="cursor:pointer; border:none; border-radius:3px;">🗑️</button>
            </div>
        `;
        box.appendChild(pill);
    }

    inject(startDay);
    if (interval > 0) {
        let next = startDay + interval;
        while (next <= 30) { inject(next); next += interval; }
    }

    input.value = "";
    confetti({ particleCount: 80, spread: 60 });
}

init();
const cal = document.getElementById('calendar');
const daySelect = document.getElementById('daySelect');

function init() {
    // April 2026 starts on Wednesday (3 spacers needed: Sun, Mon, Tue)
    const spacers = 3;
    const totalDays = 30;

    // Create spacers
    for (let i = 0; i < spacers; i++) {
        const div = document.createElement('div');
        div.style.border = "none";
        cal.appendChild(div);
    }

    // Create day boxes
    for (let i = 1; i <= totalDays; i++) {
        const day = document.createElement('div');
        day.className = 'day-tile';
        day.id = `day-${i}`;
        day.innerHTML = `<span style="color:var(--neon-cyan)">${i}</span>`;
        cal.appendChild(day);

        // Fill dropdown
        const opt = document.createElement('option');
        opt.value = i;
        opt.innerText = `April ${i}`;
        daySelect.appendChild(opt);
    }
}

function addTask() {
    const text = document.getElementById('taskInput').value;
    const day = document.getElementById('daySelect').value;
    const type = document.getElementById('typeSelect').value;

    if (!text) return;

    const target = document.getElementById(`day-${day}`);
    const pill = document.createElement('div');
    pill.className = `task-pill type-${type}`;
    pill.innerHTML = `
        <span class="task-text">${text}</span>
        <button class="complete-btn" onclick="completeTask(this)">⚡</button>
    `;
    
    target.appendChild(pill);
    document.getElementById('taskInput').value = "";
}

function completeTask(btn) {
    const pill = btn.parentElement;
    const done = pill.classList.toggle('completed');
    if (done) {
        btn.innerText = "✔️";
        confetti({ particleCount: 100, spread: 70, colors: ['#ff00ff', '#00ffff'] });
    } else {
        btn.innerText = "⚡";
    }
}

function toggleCalc() {
    document.getElementById('calc-sidebar').classList.toggle('open');
}

// Start the app
init();
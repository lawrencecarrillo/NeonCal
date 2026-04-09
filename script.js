// Build Calendar for April 2026 (Starts on Wed)
const cal = document.getElementById('calendar');
for (let i = 1; i <= 30; i++) {
    const day = document.createElement('div');
    day.className = 'day-tile';
    day.id = `day-${i}`;
    day.innerHTML = `<span style="color:var(--neon-cyan)">${i}</span>`;
    
    // Day Completion Celebration
    day.ondblclick = function() {
        this.classList.toggle('done');
        if(this.classList.contains('done')) {
            confetti({ particleCount: 200, spread: 100, colors: ['#ff00ff', '#39ff14'] });
        }
    };
    cal.appendChild(day);
}

function addTask() {
    const input = document.getElementById('taskInput');
    const dayNum = document.getElementById('daySelect').value;
    const type = document.getElementById('typeSelect').value;
    
    if (!input.value) return;

    const target = document.getElementById(`day-${dayNum}`);
    const pill = document.createElement('div');
    pill.className = `task-pill type-${type}`;
    pill.innerText = input.value;

    pill.onclick = function(e) {
        e.stopPropagation();
        this.classList.toggle('completed');
        if(this.classList.contains('completed')) {
            // "Celebrate You" burst
            confetti({ particleCount: 80, scalar: 2, shapes: ['star'] });
        }
    };

    target.appendChild(pill);
    input.value = "";
}

function toggleCalc() {
    document.getElementById('calc-sidebar').classList.toggle('open');
}

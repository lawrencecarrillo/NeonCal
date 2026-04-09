const cal = document.getElementById('calendar');
const daySelect = document.getElementById('daySelect');

// 1. Setup the 2026 Grid
function initCalendar() {
    cal.innerHTML = ""; // Clear existing
    daySelect.innerHTML = ""; // Clear dropdown

    // APRIL 2026: Starts on Wednesday. 
    // Sunday=0, Monday=1, Tuesday=2, WEDNESDAY=3.
    const startingDay = 3; 
    const daysInMonth = 30;

    // ADD SPACER BOXES so April 1st is on Wednesday
    for (let s = 0; s < startingDay; s++) {
        const spacer = document.createElement('div');
        spacer.className = 'day-tile spacer'; // style this to have no border in CSS
        spacer.style.border = "none";
        spacer.style.background = "transparent";
        cal.appendChild(spacer);
    }

    // GENERATE ACTUAL DAYS
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'day-tile';
        day.id = `day-${i}`;
        day.innerHTML = `<span style="color:var(--neon-cyan); font-weight:900;">${i}</span>`;
        
        // Double-tap to strike out the whole day
        day.ondblclick = function() {
            this.classList.toggle('done');
            if(this.classList.contains('done')) {
                confetti({ particleCount: 150, spread: 70, colors: ['#ff00ff', '#39ff14'] });
            }
        };
        cal.appendChild(day);

        // Populate Dropdown
        const opt = document.createElement('option');
        opt.value = i;
        opt.innerText = `April ${i}`;
        daySelect.appendChild(opt);
    }
}

// 2. Add Task to selected box
function addTask() {
    const input = document.getElementById('taskInput');
    const dayNum = daySelect.value;
    const type = document.getElementById('typeSelect').value;
    
    if (!input.value) return;

    const targetDay = document.getElementById(`day-${dayNum}`);
    
    const taskWrapper = document.createElement('div');
    taskWrapper.className = `task-pill type-${type}`;
    
    // Laser Strike Button included
    taskWrapper.innerHTML = `
        <span class="task-text">${input.value}</span>
        <button class="complete-btn" onclick="completeTask(this)">⚡</button>
    `;

    targetDay.appendChild(taskWrapper);
    input.value = "";
}

// 3. Laser Strike Logic
function completeTask(btn) {
    const wrapper = btn.parentElement;
    const isDone = wrapper.classList.toggle('completed');
    
    if (isDone) {
        btn.innerText = '✔️';
        confetti({
            particleCount: 100,
            spread: 60,
            colors: ['#39ff14', '#ffff00', '#ffffff']
        });
    } else {
        btn.innerText = '⚡';
    }
}

function toggleCalc() {
    document.getElementById('calc-sidebar').classList.toggle('open');
}

// RUN ON LOAD
initCalendar();
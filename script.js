// 1. Build the Calendar for April 2026
const cal = document.getElementById('calendar');
const daySelect = document.getElementById('daySelect');

// April 2026 starts on a Wednesday (Day 3)
// We'll generate 30 days
for (let i = 1; i <= 30; i++) {
    // Create the Day Box
    const day = document.createElement('div');
    day.className = 'day-tile';
    day.id = `day-${i}`;
    day.innerHTML = `<span style="color:var(--neon-cyan); font-weight:bold;">${i}</span>`;
    
    // Double-click the box itself to slash the whole day
    day.ondblclick = function() {
        this.classList.toggle('done');
        if(this.classList.contains('done')) {
            confetti({ particleCount: 150, spread: 70, colors: ['#ff00ff', '#39ff14'] });
        }
    };
    cal.appendChild(day);

    // Populate the Dropdown Selector
    const opt = document.createElement('option');
    opt.value = i;
    opt.innerText = `April ${i}`;
    daySelect.appendChild(opt);
}

// 2. The "Add to Life" Function
function addTask() {
    const input = document.getElementById('taskInput');
    const dayNum = document.getElementById('daySelect').value;
    const type = document.getElementById('typeSelect').value;
    
    if (!input.value) return;

    const targetDay = document.getElementById(`day-${dayNum}`);
    
    // Create the Task Container
    const taskWrapper = document.createElement('div');
    taskWrapper.className = `task-pill type-${type}`;
    
    // Create the Task Text and the Laser Button
    taskWrapper.innerHTML = `
        <span class="task-text">${input.value}</span>
        <button class="complete-btn" onclick="completeTask(this)">⚡</button>
    `;

    targetDay.appendChild(taskWrapper);
    
    // Clear input for the next one
    input.value = "";
}

// 3. The Laser Strike Logic
function completeTask(btn) {
    const wrapper = btn.parentElement;
    const isDone = wrapper.classList.toggle('completed');
    
    if (isDone) {
        // Change the lightning bolt to a checkmark
        btn.innerText = '✔️';
        // Celebrate!
        confetti({
            particleCount: 100,
            spread: 60,
            colors: ['#39ff14', '#ffff00', '#ffffff'],
            shapes: ['circle']
        });
    } else {
        btn.innerText = '⚡';
    }
}

// 4. Calculator Sidebar Toggle
function toggleCalc() {
    document.getElementById('calc-sidebar').classList.toggle('open');
}
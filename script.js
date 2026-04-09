const cal = document.getElementById('calendar');
const taskInput = document.getElementById('taskInput');
const daySelect = document.getElementById('daySelect');

// 1. Generate 2026 Calendar (Starting with January)
// Jan 1, 2026 is a Thursday (Day 4 of the week)
function buildCalendar() {
    cal.innerHTML = "";
    for (let i = 1; i <= 31; i++) {
        const day = document.createElement('div');
        day.className = 'day-tile';
        day.id = `day-${i}`;
        day.innerHTML = `<span style="font-size: 14px; color: #888;">${i}</span>`;
        
        // Double tap/click to slash the day done
        day.ondblclick = () => day.classList.toggle('done');
        cal.appendChild(day);

        // Add to our dropdown selector
        const opt = document.createElement('option');
        opt.value = i;
        opt.innerText = `Jan ${i}`;
        daySelect.appendChild(opt);
    }
}

// 2. Add Task INSIDE the box
function addTask() {
    const text = taskInput.value;
    const dayId = daySelect.value;
    if (!text) return;

    const targetDay = document.getElementById(`day-${dayId}`);
    const taskDiv = document.createElement('div');
    taskDiv.className = 'inner-task';
    
    if (text.includes('$')) taskDiv.classList.add('bill');
    taskDiv.innerText = text;

    taskDiv.onclick = function(e) {
        e.stopPropagation(); // Prevents day toggle
        const finishing = this.classList.toggle('completed');
        if (finishing) {
            confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
        }
    };

    targetDay.appendChild(taskDiv);
    taskInput.value = "";
}

buildCalendar();

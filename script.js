const cal = document.getElementById('calendar');
const daySelect = document.getElementById('daySelect');
const mainHeader = document.getElementById('mainHeader');

// Setup
let currentMonth = 3; // April
let currentYear = 2026;
const types = ['task', 'bill', 'event', 'doctor', 'holiday', 'self'];
let savedTasks = JSON.parse(localStorage.getItem('neonLifeData')) || [];

function initCalendar() {
    cal.innerHTML = "";
    daySelect.innerHTML = "";
    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    mainHeader.innerText = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Spacers
    for (let i = 0; i < firstDay; i++) {
        const spacer = document.createElement('div');
        spacer.className = 'day-tile'; spacer.style.border = "none";
        cal.appendChild(spacer);
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'day-tile';
        day.id = `day-${currentYear}-${currentMonth}-${i}`;
        day.innerHTML = `<span style="opacity:0.5; font-size:10px">${i}</span>`;
        cal.appendChild(day);

        let opt = document.createElement('option');
        opt.value = i; opt.innerText = `${monthNames[currentMonth].substring(0,3)} ${i}`;
        daySelect.appendChild(opt);
    }
    renderSavedTasks();
}

function renderSavedTasks() {
    savedTasks.forEach(task => {
        if (task.month === currentMonth && task.year === currentYear) {
            const box = document.getElementById(`day-${task.year}-${task.month}-${task.day}`);
            if (!box) return;

            const pill = document.createElement('div');
            pill.className = `task-pill type-${task.type} ${task.completed ? 'completed' : ''}`;
            
            // MANUAL OVERRIDE LOGIC
            pill.onclick = function() {
                let currentIndex = types.indexOf(task.type);
                task.type = types[(currentIndex + 1) % types.length];
                saveAndRefresh();
            };

            pill.innerHTML = `
                <span>${task.text}</span>
                <div style="display:flex; gap:5px;">
                    <button onclick="event.stopPropagation(); toggleComplete(${task.id})" style="border:none; cursor:pointer;">⚡</button>
                    <button onclick="event.stopPropagation(); deleteTask(${task.id})" style="border:none; cursor:pointer;">🗑️</button>
                </div>
            `;
            box.appendChild(pill);
        }
    });
}

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value;
    const startDay = parseInt(daySelect.value);
    const interval = parseInt(document.getElementById('recurrenceSelect').value);
    if (!text) return;

    // AI SENSING
    let type = 'task';
    const lower = text.toLowerCase();
    if (lower.includes('$') || lower.includes('pay')) type = 'bill';
    else if (lower.includes('dr') || lower.includes('doctor')) type = 'doctor';
    else if (lower.includes('party') || lower.includes('holiday')) type = 'holiday';
    else if (lower.includes('gym') || lower.includes('yoga')) type = 'self';
    else if (lower.includes('meet') || lower.includes('with')) type = 'event';

    const newTask = { id: Date.now(), text, day: startDay, month: currentMonth, year: currentYear, type, completed: false };
    savedTasks.push(newTask);

    if (interval > 0) {
        let next = new Date(currentYear, currentMonth, startDay + interval);
        for(let i=0; i<12; i++) {
            savedTasks.push({ id: Date.now() + next.getTime(), text, day: next.getDate(), month: next.getMonth(), year: next.getFullYear(), type, completed: false });
            next.setDate(next.getDate() + interval);
        }
    }

    input.value = "";
    saveAndRefresh();
    confetti({ particleCount: 100 });
}

function toggleComplete(id) {
    savedTasks = savedTasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    saveAndRefresh();
}

function deleteTask(id) {
    savedTasks = savedTasks.filter(t => t.id !== id);
    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem('neonLifeData', JSON.stringify(savedTasks));
    initCalendar();
}

function changeMonth(dir) {
    currentMonth += dir;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    initCalendar();
}

function setTheme(t) { document.body.className = `theme-${t}`; }

initCalendar();
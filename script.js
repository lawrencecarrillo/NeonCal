const cal = document.getElementById('calendar');
const daySelect = document.getElementById('daySelect');
const mainHeader = document.getElementById('mainHeader');

// Data Management
let currentMonth = 3; // April (0-indexed)
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

    // 1. Spacers
    for (let i = 0; i < firstDay; i++) {
        const spacer = document.createElement('div');
        spacer.className = 'day-tile'; spacer.style.border = "none";
        cal.appendChild(spacer);
    }

    // 2. Days
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
        // Only show tasks for the current visible month/year
        if (task.month === currentMonth && task.year === currentYear) {
            injectTaskToUI(task);
        }
    });
}

function addTask() {
    const text = document.getElementById('taskInput').value;
    const startDay = parseInt(daySelect.value);
    const interval = parseInt(document.getElementById('recurrenceSelect').value);
    if (!text) return;

    let type = 'task';
    const lower = text.toLowerCase();
    if (lower.includes('$') || lower.includes('pay')) type = 'bill';
    else if (lower.includes('dr') || lower.includes('doctor')) type = 'doctor';
    else if (lower.includes('party') || lower.includes('holiday')) type = 'holiday';
    else if (lower.includes('gym') || lower.includes('yoga')) type = 'self';
    else if (lower.includes('meet') || lower.includes('with')) type = 'event';

    const newTask = {
        id: Date.now(),
        text: text,
        day: startDay,
        month: currentMonth,
        year: currentYear,
        type: type,
        completed: false
    };

    savedTasks.push(newTask);
    
    // Handle Recurrence for the whole year (next 12 months)
    if (interval > 0) {
        let nextDate = new Date(currentYear, currentMonth, startDay + interval);
        for(let i=0; i<12; i++) { // Auto-fill for a year
            if (nextDate.getFullYear() > 2027) break; 
            savedTasks.push({
                id: Date.now() + nextDate.getTime(),
                text: text,
                day: nextDate.getDate(),
                month: nextDate.getMonth(),
                year: nextDate.getFullYear(),
                type: type,
                completed: false
            });
            nextDate.setDate(nextDate.getDate() + interval);
        }
    }

    saveAndRefresh();
    document.getElementById('taskInput').value = "";
    confetti({ particleCount: 100 });
}

function injectTaskToUI(task) {
    const box = document.getElementById(`day-${task.year}-${task.month}-${task.day}`);
    if (!box) return;

    const pill = document.createElement('div');
    pill.className = `task-pill type-${task.type} ${task.completed ? 'completed' : ''}`;
    pill.innerHTML = `
        <span>${task.text}</span>
        <div style="display:flex; gap:5px;">
            <button onclick="toggleComplete(${task.id})" style="cursor:pointer; border:none;">⚡</button>
            <button onclick="deleteTask(${task.id})" style="cursor:pointer; border:none;">🗑️</button>
        </div>
    `;
    box.appendChild(pill);
}

function toggleComplete(id) {
    savedTasks = savedTasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    if(savedTasks.find(t => t.id === id).completed) confetti({particleCount:40});
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
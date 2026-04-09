// --- INITIALIZATION ---
const cal = document.getElementById('calendar');
const daySelect = document.getElementById('daySelect');

function init() {
    // April 2026 starts on Wednesday
    // Spacers: Sun(0), Mon(1), Tue(2) -> Wednesday is 3rd index
    const spacers = 3;
    const totalDays = 30;

    cal.innerHTML = ""; // Clear grid
    daySelect.innerHTML = ""; // Clear dropdown

    // 1. Create Spacer Tiles for proper alignment
    for (let i = 0; i < spacers; i++) {
        const spacer = document.createElement('div');
        spacer.className = 'day-tile';
        spacer.style.border = "none";
        spacer.style.background = "transparent";
        cal.appendChild(spacer);
    }

    // 2. Create April Days
    for (let i = 1; i <= totalDays; i++) {
        const day = document.createElement('div');
        day.className = 'day-tile';
        day.id = `day-${i}`;
        day.innerHTML = `<span class="day-number">${i}</span>`;
        
        // Double-tap to strike through the whole day
        day.ondblclick = function() {
            this.classList.toggle('done');
            if(this.classList.contains('done')) {
                confetti({ 
                    particleCount: 150, 
                    spread: 70, 
                    colors: ['#ff00ff', '#39ff14', '#00ffff'] 
                });
            }
        };
        cal.appendChild(day);

        // Fill the Dropdown Selector
        const opt = document.createElement('option');
        opt.value = i;
        opt.innerText = `April ${i}`;
        daySelect.appendChild(opt);
    }
}

// --- THEME SWITCHING LOGIC ---
function setTheme(themeName) {
    // Remove any existing themes
    document.body.classList.remove('theme-primary', 'theme-bank', 'theme-neon');
    
    // Add the chosen theme class
    if (themeName !== 'neon') {
        document.body.classList.add(`theme-${themeName}`);
    }
    
    console.log("Theme switched to: " + themeName);
}

// --- TASK LOGIC ---
function addTask() {
    const taskText = document.getElementById('taskInput').value;
    const startDay = parseInt(document.getElementById('daySelect').value);
    const type = document.getElementById('typeSelect').value;
    const interval = parseInt(document.getElementById('recurrenceSelect').value);

    if (!taskText) return;

    // Helper function to inject the task into a box
    function injectTask(dayNumber) {
        const targetBox = document.getElementById(`day-${dayNumber}`);
        if (!targetBox) return;

        const pill = document.createElement('div');
        pill.className = `task-pill type-${type}`;
        pill.innerHTML = `
            <span class="task-text">${taskText}</span>
            <button class="complete-btn" onclick="completeTask(this)">⚡</button>
        `;
        targetBox.appendChild(pill);
    }

    // 1. Place the initial task
    injectTask(startDay);

    // 2. Handle Recurrence (Loop through the month)
    if (interval > 0) {
        let nextOccurance = startDay + interval;
        while (nextOccurance <= 30) {
            injectTask(nextOccurance);
            nextOccurance += interval;
        }
    }

    // Success Sparkle
    confetti({ 
        particleCount: 100, 
        spread: 70, 
        origin: { y: 0.9 } 
    });

    // Reset Input
    document.getElementById('taskInput').value = "";
}

// --- COMPLETE TASK (LASER STRIKE) ---
function completeTask(btn) {
    const pill = btn.parentElement;
    const isDone = pill.classList.toggle('completed');
    
    if (isDone) {
        btn.innerText = "✔️";
        // Mini celebration for finishing a task
        confetti({
            particleCount: 40,
            scalar: 1.2,
            shapes: ['star'],
            colors: ['#ffeb3b', '#ffffff']
        });
    } else {
        btn.innerText = "⚡";
    }
}

// --- SIDEBAR CALCULATOR ---
function toggleCalc() {
    const sidebar = document.getElementById('calc-sidebar');
    sidebar.classList.toggle('open');
}

// Initialize the app on load
init();
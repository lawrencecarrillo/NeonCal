function setTheme(theme) {
    document.body.className = ''; // Reset
    if (theme === 'primary') document.body.classList.add('theme-primary');
    if (theme === 'bank') document.body.classList.add('theme-bank');
}

function addTask() {
    const text = document.getElementById('taskInput').value;
    const startDay = parseInt(document.getElementById('daySelect').value);
    const type = document.getElementById('typeSelect').value;
    const interval = document.getElementById('recurrenceSelect').value;

    if (!text) return;

    function placeTask(day) {
        const target = document.getElementById(`day-${day}`);
        if (!target) return;

        const pill = document.createElement('div');
        pill.className = `task-pill type-${type}`;
        pill.innerHTML = `
            <span class="task-text">${text}</span>
            <button class="complete-btn" onclick="completeTask(this)">⚡</button>
        `;
        target.appendChild(pill);
    }

    // Always place the first task
    placeTask(startDay);

    // If a recurrence is chosen, loop through and place them
    if (interval !== "none") {
        let nextDay = startDay + parseInt(interval);
        while (nextDay <= 30) {
            placeTask(nextDay);
            nextDay += parseInt(interval);
        }
    }

    document.getElementById('taskInput').value = "";
    confetti({ particleCount: 100, colors: ['#ff00ff', '#00ffff'] });
}
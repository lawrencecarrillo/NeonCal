// 1. Build the Calendar Grid (31 Days)
const cal = document.getElementById('calendar');
for (let i = 1; i <= 31; i++) {
    const day = document.createElement('div');
    day.className = 'day-tile';
    day.innerText = i;
    // Click to slash through the day
    day.onclick = () => day.classList.toggle('done');
    cal.appendChild(day);
}

// 2. Function to Add New Tasks or Bills
function addTask() {
    const input = document.getElementById('taskInput');
    if (!input.value) return;

    const list = document.getElementById('taskList');
    const item = document.createElement('div');
    item.className = 'task-item';
    
    // Logic: If it has a '$', it's a bill (triggers gold glow in CSS)
    if (input.value.includes('$')) {
        item.classList.add('bill');
    }

    item.innerHTML = `<span class="text">${input.value}</span>`;
    
    // Click to complete task and trigger glitter
    item.onclick = function() {
        const isFinishing = this.classList.toggle('completed');
        if (isFinishing) {
            confetti({
                particleCount: 150,
                spread: 70,
                colors: ['#ff00ff', '#00ffff', '#ffffff', '#ffeb3b'], // Neon colors
                origin: { y: 0.8 }
            });
        }
    };

    list.prepend(item); // Newest tasks at the top
    input.value = ""; // Clear input for next task
}

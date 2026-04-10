// ── STATE ─────────────────────────────────────────────
let currentMonth = new Date().getMonth();
let currentYear  = new Date().getFullYear();
let tasks = JSON.parse(localStorage.getItem('neoncal-tasks') || '[]');

const MONTHS = [
  'JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
  'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'
];

const TYPES = ['task','bill','event','doctor','holiday','self','birthday','sub'];

// ── CALENDAR ──────────────────────────────────────────
function buildCalendar() {
  const cal      = document.getElementById('calendar');
  const daySelect = document.getElementById('daySelect');
  const label    = document.getElementById('monthLabel');

  cal.innerHTML      = '';
  daySelect.innerHTML = '';
  label.textContent  = MONTHS[currentMonth] + ' ' + currentYear;

  const firstDay    = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today       = new Date();

  // Spacer cells for alignment
  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement('div');
    blank.className = 'day-cell empty';
    cal.appendChild(blank);
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.className = 'day-cell';
    cell.id = cellId(currentYear, currentMonth, d);

    const isToday = (
      d === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear  === today.getFullYear()
    );
    if (isToday) cell.classList.add('today');

    const num = document.createElement('span');
    num.className   = 'day-num';
    num.textContent = d;
    cell.appendChild(num);

    // Double-click to slash the whole day
    cell.addEventListener('dblclick', () => {
      cell.classList.toggle('done');
      if (cell.classList.contains('done')) {
        fireworks();
      }
    });

    cal.appendChild(cell);

    // Populate day dropdown
    const opt = document.createElement('option');
    opt.value     = d;
    opt.textContent = MONTHS[currentMonth].slice(0, 3) + ' ' + d;
    daySelect.appendChild(opt);
  }

  renderTasks();
}

function cellId(y, m, d) {
  return 'cell-' + y + '-' + m + '-' + d;
}

// ── RENDER SAVED TASKS ────────────────────────────────
function renderTasks() {
  tasks.forEach(t => {
    if (t.month === currentMonth && t.year === currentYear) {
      injectPill(t);
    }
  });
}

function injectPill(task) {
  const box = document.getElementById(cellId(task.year, task.month, task.day));
  if (!box) return;

  const pill = document.createElement('div');
  pill.className = 'task-pill type-' + task.type + (task.done ? ' done-task' : '');
  pill.dataset.id = task.id;

  // Click body = cycle color
  pill.addEventListener('click', function(e) {
    if (e.target.classList.contains('pill-btn')) return;
    const idx  = TYPES.indexOf(task.type);
    task.type  = TYPES[(idx + 1) % TYPES.length];
    save();
    pill.className = 'task-pill type-' + task.type + (task.done ? ' done-task' : '');
  });

  pill.innerHTML =
    '<span class="pill-text">' + task.text + '</span>' +
    '<div class="pill-actions">' +
      '<button class="pill-btn" title="Complete" onclick="completeTask(' + task.id + ', this)">&#9889;</button>' +
      '<button class="pill-btn" title="Delete"   onclick="deleteTask('  + task.id + ')">&#10005;</button>' +
    '</div>';

  box.appendChild(pill);
}

// ── ADD TASK ──────────────────────────────────────────
function addTask() {
  const input    = document.getElementById('taskInput');
  const text     = input.value.trim();
  const day      = parseInt(document.getElementById('daySelect').value);
  const interval = parseInt(document.getElementById('recurSelect').value);

  if (!text) return;

  // AI Smart-Sensing
  const lower = text.toLowerCase();
  let type = 'task';

  if      (lower.includes('birthday') || lower.includes('bday'))                       type = 'birthday';
  else if (lower.includes('holiday') || lower.includes('vacation') || lower.includes('party'))  type = 'holiday';
  else if (lower.includes('dr ') || lower.includes('doctor') || lower.includes('dentist') || lower.includes('appt') || lower.includes('checkup')) type = 'doctor';
  else if (lower.includes('gym') || lower.includes('yoga') || lower.includes('spa') || lower.includes('meditat') || lower.includes('self')) type = 'self';
  else if (lower.includes('meet') || lower.includes('zoom') || lower.includes('call') || lower.includes('with '))  type = 'event';
  else if (lower.includes('netflix') || lower.includes('spotify') || lower.includes('hulu') || lower.includes('sub') || lower.includes('subscription')) type = 'sub';
  else if (lower.includes('$') || lower.includes('pay') || lower.includes('rent') || lower.includes('bill') || lower.includes('insurance')) type = 'bill';

  // Place task (and recurrences)
  const base = new Date(currentYear, currentMonth, day);
  let date   = new Date(base);

  for (let i = 0; i < (interval > 0 ? 13 : 1); i++) {
    if (i > 0) date.setDate(date.getDate() + interval);
    if (date.getFullYear() > currentYear + 1) break;

    tasks.push({
      id:    Date.now() + i,
      text:  text,
      type:  type,
      day:   date.getDate(),
      month: date.getMonth(),
      year:  date.getFullYear(),
      done:  false
    });
  }

  save();
  buildCalendar();
  input.value = '';
  pop();
}

// ── COMPLETE / DELETE ─────────────────────────────────
function completeTask(id, btn) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  save();
  buildCalendar();
  if (task.done) celebrate();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  buildCalendar();
}

// ── NAVIGATION ────────────────────────────────────────
function changeMonth(dir) {
  currentMonth += dir;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  if (currentMonth < 0)  { currentMonth = 11; currentYear--; }
  buildCalendar();
}

// ── THEME ─────────────────────────────────────────────
function setTheme(t) {
  document.body.className = 'theme-' + t;
}

// ── CALCULATOR ────────────────────────────────────────
let calcStr = '';

function toggleCalc() {
  document.getElementById('calcSidebar').classList.toggle('open');
}

function calcInput(val) {
  calcStr += val;
  document.getElementById('calcDisplay').textContent = calcStr;
}

function calcEquals() {
  try {
    const result = Function('"use strict"; return (' + calcStr + ')')();
    calcStr = String(parseFloat(result.toFixed(10)));
    document.getElementById('calcDisplay').textContent = calcStr;
  } catch(e) {
    document.getElementById('calcDisplay').textContent = 'ERROR';
    calcStr = '';
  }
}

function calcClear() {
  calcStr = '';
  document.getElementById('calcDisplay').textContent = '0';
}

// ── SAVE ──────────────────────────────────────────────
function save() {
  localStorage.setItem('neoncal-tasks', JSON.stringify(tasks));
}

// ── CONFETTI ──────────────────────────────────────────
function celebrate() {
  confetti({
    particleCount: 120,
    spread: 70,
    colors: ['#ff00ff','#00ffff','#39ff14','#ffff00','#ff6600'],
    origin: { y: 0.6 }
  });
}

function fireworks() {
  confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
}

function pop() {
  confetti({ particleCount: 60, spread: 50, origin: { y: 0.9 } });
}

// ── INIT ──────────────────────────────────────────────
buildCalendar();
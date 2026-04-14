const input = document.getElementById("taskInput");
const dateInput = document.getElementById("date");
const timeInput = document.getElementById("time");
const priority = document.getElementById("priority");
const list = document.getElementById("taskList");
const empty = document.getElementById("empty");
const search = document.getElementById("search");
const toggle = document.getElementById("themeToggle");

let currentFilter = "all";

toggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark"));
};

window.onload = () => {
  loadTheme();
  renderTasks();
};

function loadTheme() {
  if (localStorage.getItem("theme") === "true") {
    document.body.classList.add("dark");
  }
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  if (!input.value.trim()) return;

  const tasks = getTasks();

  tasks.push({
    text: input.value,
    date: dateInput.value,
    time: timeInput.value,
    priority: priority.value,
    completed: false
  });

  saveTasks(tasks);
  renderTasks();

  input.value = "";
  dateInput.value = "";
  timeInput.value = "";
}

function renderTasks() {
  list.innerHTML = "";
  let tasks = getTasks();

  const term = search.value.toLowerCase();

  tasks = tasks.filter(t => t.text.toLowerCase().includes(term));

  if (currentFilter === "pending") {
    tasks = tasks.filter(t => !t.completed);
  }

  if (currentFilter === "completed") {
    tasks = tasks.filter(t => t.completed);
  }

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    if (task.completed) li.classList.add("completed");
    li.classList.add(task.priority);

    if (isOverdue(task)) {
      li.classList.add("overdue");
    }

    const info = document.createElement("div");

    const title = document.createElement("span");
    title.textContent = task.text;

    const date = document.createElement("small");
    date.textContent = `${task.date || ""} ${task.time || ""}`;

    info.appendChild(title);
    info.appendChild(date);

    li.onclick = () => toggleTask(index);

    const btn = document.createElement("button");
    btn.textContent = "✖";

    btn.onclick = (e) => {
      e.stopPropagation();
      deleteTask(index);
    };

    li.appendChild(info);
    li.appendChild(btn);
    list.appendChild(li);
  });

  empty.style.display = tasks.length === 0 ? "block" : "none";
}

function toggleTask(index) {
  const tasks = getTasks();
  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  renderTasks();
}

function deleteTask(index) {
  const tasks = getTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
  renderTasks();
}

function filterTasks(type) {
  currentFilter = type;
  renderTasks();
}

search.oninput = renderTasks;

function isOverdue(task) {
  if (!task.date) return false;

  const now = new Date();
  const taskDate = new Date(task.date + "T" + (task.time || "00:00"));

  return taskDate < now && !task.completed;
}
const input = document.getElementById("taskInput");
const priority = document.getElementById("priority");
const list = document.getElementById("taskList");
const empty = document.getElementById("empty");
const toggle = document.getElementById("themeToggle");

toggle.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark"));
};

window.onload = () => {
  loadTheme();
  loadInitialTask();
  updateEmpty();
};

function loadTheme() {
  const dark = localStorage.getItem("theme") === "true";
  if (dark) document.body.classList.add("dark");
}

function loadInitialTask() {
  createTask({
    text: "Finalizar projeto 🚀",
    priority: "alta",
    completed: false
  });
}

function addTask() {
  if (input.value.trim() === "") return;

  createTask({
    text: input.value,
    priority: priority.value,
    completed: false
  });

  input.value = "";
  updateEmpty();
}

function createTask(task) {
  const li = document.createElement("li");
  li.classList.add(task.priority);

  const span = document.createElement("span");
  span.textContent = task.text;

  li.onclick = () => {
    li.classList.toggle("completed");
  };

  const btn = document.createElement("button");
  btn.textContent = "✖";

  btn.onclick = (e) => {
    e.stopPropagation();
    li.remove();
    updateEmpty();
  };

  li.appendChild(span);
  li.appendChild(btn);
  list.appendChild(li);
}

function updateEmpty() {
  empty.style.display = list.children.length === 0 ? "block" : "none";
}
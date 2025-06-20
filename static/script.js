const API_URL = "https://fastapi-todo-ntrn.onrender.com/";

// Load tasks from backend
async function loadTasks() {
  const res = await fetch("/tasks/");
  const tasks = await res.json();
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach(task => {
    const li = createTaskElement(task);
    list.appendChild(li);
  });
}

// Add new task
async function addTask() {
  const input = document.getElementById('taskInput');
  const taskText = input.value.trim();

  if (taskText === "") {
    alert("Please enter a task.");
    return;
  }

  const response = await fetch("/tasks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title: taskText })
  });

  const newTask = await response.json();
  const li = createTaskElement(newTask);
  document.getElementById('taskList').appendChild(li);
  input.value = "";
}

// Create a task item
function createTaskElement(task) {
  const li = document.createElement('li');
  li.textContent = task.title;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '❌';
  deleteBtn.onclick = async () => {
    await fetch(`${API_URL}${task.id}`, { method: "DELETE" });
    li.remove();
  };

  // Double-click to edit
  li.ondblclick = () => {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = task.title;
    input.style.width = "80%";

    li.textContent = "";
    li.appendChild(input);
    li.appendChild(deleteBtn);
    input.focus();

    input.addEventListener("keypress", async function (e) {
      if (e.key === "Enter") {
        const newTitle = input.value.trim();
        if (newTitle !== "") {
          const res = await fetch(`${API_URL}${task.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle })
          });
          const updatedTask = await res.json();
          li.textContent = updatedTask.title;
          li.appendChild(deleteBtn);
        }
      }
    });
  };

  li.appendChild(deleteBtn);
  return li;
}

// Support Enter key
document.getElementById('taskInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Initial load
loadTasks();

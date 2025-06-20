const API_URL = "/tasks/";

// Load tasks from backend
async function loadTasks() {
  const res = await fetch(API_URL);
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

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title: taskText })
  });

  if (response.ok) {
    const newTask = await response.json();
    const li = createTaskElement(newTask);
    document.getElementById('taskList').appendChild(li);
    input.value = "";
  } else {
    alert("Failed to add task.");
  }
}

// Create a task item
function createTaskElement(task) {
  const li = document.createElement('li');
  li.textContent = task.title;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '❌';

  deleteBtn.onclick = async () => {
    const response = await fetch(`${API_URL}${task.id}`, {
      method: "DELETE"
    });

    if (response.ok) {
      li.remove();
    } else {
      alert("Failed to delete task.");
    }
  };

  // Double-click to edit task
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
        if (newTitle === "") {
          alert("Task title cannot be empty.");
          return;
        }

        const res = await fetch(`${API_URL}${task.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: newTitle })
        });

        if (res.ok) {
          const updatedTask = await res.json();
          li.textContent = updatedTask.title;
          li.appendChild(deleteBtn);
        } else {
          alert("Failed to update task.");
        }
      }
    });

    // Optional: Press Escape to cancel editing
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        li.textContent = task.title;
        li.appendChild(deleteBtn);
      }
    });
  };

  li.appendChild(deleteBtn);
  return li;
}

// Support Enter key in input field
document.getElementById('taskInput').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    addTask();
  }
});

// Initial load
loadTasks();

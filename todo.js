document.addEventListener("DOMContentLoaded", function () {
    const taskTitle = document.getElementById("taskTitle");
    const taskDescription = document.getElementById("taskDescription");
    const taskDeadline = document.getElementById("taskDeadline");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskList = document.getElementById("taskList");
    const logoutBtn = document.getElementById("logoutBtn");
    const searchTask = document.getElementById("searchTask");
    const filterStatus = document.getElementById("filterStatus");

    const body = document.querySelector("body");
    body.style.backdropFilter = "blur(5px)";

    // Récupérer les utilisateurs connectés depuis localStorage
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        window.location.href = "index.html"; 
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", { year: "numeric", month: "2-digit", day: "2-digit" });
    }

    // Charger et afficher les tâches de l'utilisateur
    function loadTasks() {
        taskList.innerHTML = "";
        const tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser.id}`)) || [];
        const searchValue = searchTask.value.toLowerCase();
        const selectedStatus = filterStatus.value;

        tasks.forEach((task, index) => {
            if (
                (selectedStatus === "all" || task.status === selectedStatus) &&
                (task.title.toLowerCase().includes(searchValue) || task.description.toLowerCase().includes(searchValue))
            ) {
            const li = document.createElement("li");
            li.classList.add("task-item");
            li.innerHTML = `
                
            <div class="note">
                <div class="note__text">
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p>Deadline: ${formatDate(task.deadline)}</p>
                    <span class="task-status ${task.status === "Completed" ? "completed" : "pending"}">
                    ${task.status === "Completed" ? "Completed" : "In Progress"}
                    </span>
                </div>
                <div class="task-actions">
                ${task.status === "In Progress" ? `<button class="complete-btn" data-index="${index}">✅</button>` : ""}
                ${task.status === "In Progress" ? `<button class="delete-btn" data-index="${index}">🗑️</button>` : ""}
                </div>
            </div>   
            `;

            taskList.appendChild(li);
            }
        });
    }

    // Ajoute une nouvelle tache (Status = "In Progress" par défaut)
    addTaskBtn.addEventListener("click", function () {
        const title = taskTitle.value.trim();
        const description = taskDescription.value.trim();
        const deadline = taskDeadline.value;
        const taskStatus = document.getElementById("taskStatus").value;

        if (title === "" || description === "" || deadline === "") {
            alert("Please fill in all fields and choose a valid date!");
            return;
        }

        const newTask = { title, description, deadline,status: taskStatus, userId: currentUser.id };
        const tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser.id}`)) || [];
        tasks.push(newTask);
        localStorage.setItem(`tasks_${currentUser.id}`, JSON.stringify(tasks));

        loadTasks(); 

        taskTitle.value = "";
        taskDescription.value = "";
        taskDeadline.value = "";
    });

    // Gestion du statut des taches de l'utilisateur (Complete/Delete)
    taskList.addEventListener("click", function (event) {
        let tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser.id}`)) || [];

        if (event.target.classList.contains("delete-btn")) {
            const index = event.target.dataset.index;
            tasks.splice(index, 1); 
            localStorage.setItem(`tasks_${currentUser.id}`, JSON.stringify(tasks));
            loadTasks(); 
        }

        if (event.target.classList.contains("complete-btn")) {
            const index = event.target.dataset.index;
            tasks[index].status = "Completed";
            localStorage.setItem(`tasks_${currentUser.id}`, JSON.stringify(tasks));
            loadTasks(); 
        }
    });

    // Recherche de tâches
    document.getElementById("searchTask").addEventListener("input", function () {
        let searchValue = this.value.toLowerCase();
        let tasks = document.querySelectorAll(".task-item");

        tasks.forEach(task => {
            let title = task.querySelector(".task-title").textContent.toLowerCase();
            let description = task.querySelector(".task-desc").textContent.toLowerCase();

            if (title.includes(searchValue) || description.includes(searchValue)) {
                task.style.display = "flex";
            } else {
                task.style.display = "none";
            }
        });
    });

    // Appliquer un filtre sur la recherche de tâches
    searchTask.addEventListener("input", loadTasks);
    filterStatus.addEventListener("change", loadTasks);

    // Logout
    logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("currentUser");
        window.location.href = "index.html";
    });

    loadTasks(); // Charger les tâches de l'utilisateur
});
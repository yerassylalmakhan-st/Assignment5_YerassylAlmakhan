// Array of 10+ objects with unique id and 4 properties of different types
let tasks = [
    { id: 1, title: "Design Landing Page", status: "todo", tag: "design", priority: 1 },
    { id: 2, title: "Setup PostgreSQL DB", status: "todo", tag: "backend", priority: 2 },
    { id: 3, title: "Write API Documentation", status: "todo", tag: "docs", priority: 3 },
    { id: 4, title: "Fix Authentication Bug", status: "todo", tag: "bug", priority: 1 },
    { id: 5, title: "Configure Docker CI/CD", status: "inprogress", tag: "devops", priority: 1 },
    { id: 6, title: "Navbar CSS Styling", status: "inprogress", tag: "design", priority: 2 },
    { id: 7, title: "Implement JWT Login", status: "done", tag: "backend", priority: 1 },
    { id: 8, title: "Initialize Git Repository", status: "done", tag: "setup", priority: 3 },
    { id: 9, title: "Create Figma Wireframes", status: "done", tag: "design", priority: 2 },
    { id: 10, title: "Write Unit Test Suite", status: "todo", tag: "testing", priority: 2 }
];

let currentFilter = "";

function render() {
    const todoCol = document.getElementById("col-todo");
    const inProgCol = document.getElementById("col-inprogress");
    const doneCol = document.getElementById("col-done");
    const noResultMsg = document.getElementById("no-result-msg");

    // Clear containers
    todoCol.innerHTML = "";
    inProgCol.innerHTML = "";
    doneCol.innerHTML = "";

    let visibleCount = 0;

    // Process array of data with for...of loop
    for (let task of tasks) {
        if (currentFilter && !task.tag.toLowerCase().includes(currentFilter)) {
            continue;
        }
        visibleCount++;

        // Create elements securely without innerHTML for data
        const card = document.createElement("div");
        card.className = "card mb-3 shadow-sm p-3 bg-white border-0";

        const headerDiv = document.createElement("div");
        headerDiv.className = "d-flex justify-content-between align-items-center mb-2";

        const titleSpan = document.createElement("span");
        titleSpan.className = "fw-semibold text-dark";
        titleSpan.textContent = task.title;

        const badge = document.createElement("span");
        badge.className = "badge bg-secondary";
        badge.textContent = task.tag;

        headerDiv.appendChild(titleSpan);
        headerDiv.appendChild(badge);
        card.appendChild(headerDiv);

        const prioritySmall = document.createElement("small");
        prioritySmall.className = "text-muted d-block mb-2";
        prioritySmall.textContent = `Priority Level: ${task.priority}`;
        card.appendChild(prioritySmall);

        // Action buttons container
        const btnContainer = document.createElement("div");
        btnContainer.className = "d-flex gap-2";

        if (task.status !== "todo") {
            const leftBtn = document.createElement("button");
            leftBtn.className = "btn btn-outline-secondary btn-sm flex-fill action-btn";
            leftBtn.textContent = "⬅️ Move Left";
            leftBtn.dataset.id = task.id;
            leftBtn.dataset.action = "left";
            btnContainer.appendChild(leftBtn);
        }

        if (task.status !== "done") {
            const rightBtn = document.createElement("button");
            rightBtn.className = "btn btn-outline-primary btn-sm flex-fill action-btn";
            rightBtn.textContent = "Move Right ➡️";
            rightBtn.dataset.id = task.id;
            rightBtn.dataset.action = "right";
            btnContainer.appendChild(rightBtn);
        }

        card.appendChild(btnContainer);

        // Append to correct column
        if (task.status === "todo") todoCol.appendChild(card);
        else if (task.status === "inprogress") inProgCol.appendChild(card);
        else if (task.status === "done") doneCol.appendChild(card);
    }

    if (visibleCount === 0) {
        noResultMsg.classList.remove("d-none");
    } else {
        noResultMsg.classList.add("d-none");
    }
}

// Event Delegation on Kanban board container
document.getElementById("kanban-board").addEventListener("click", (e) => {
    if (!e.target.classList.contains("action-btn")) return;

    const id = Number(e.target.dataset.id);
    const action = e.target.dataset.action;
    const task = tasks.find(t => t.id === id);

    // Rule calculation with loop/filter: Count cards in In Progress
    let inProgressCount = tasks.filter(t => t.status === "inprogress").length;

    if (action === "right") {
        if (task.status === "todo") {
            if (inProgressCount >= 3) {
                alert("Rule Restriction: The 'In Progress' column cannot hold more than 3 cards!");
                return;
            }
            task.status = "inprogress";
        } else if (task.status === "inprogress") {
            task.status = "done";
        }
    } else if (action === "left") {
        if (task.status === "done") {
            task.status = "inprogress";
        } else if (task.status === "inprogress") {
            task.status = "todo";
        }
    }

    render();
});

// Filter input listener
document.getElementById("filter-input").addEventListener("input", (e) => {
    currentFilter = e.target.value.toLowerCase().trim();
    render();
});

render();

import {
    showEditModal,
    showDeleteModal
} from "../components/action-modals.js";

const storageKey = "smartBudgetSavings";

const savingsForm = document.getElementById("savingsForm");
const goalList = document.getElementById("goalList");

const totalSavingsElement = document.getElementById("totalSavings");
const activeGoalsElement = document.getElementById("activeGoals");
const remainingTargetElement = document.getElementById("remainingTarget");

const goalName = document.getElementById("goalName");
const targetAmount = document.getElementById("targetAmount");
const currentSavings = document.getElementById("currentSavings");
const goalDeadline = document.getElementById("goalDeadline");

let goals = JSON.parse(localStorage.getItem(storageKey)) || [];

function saveGoals() {
    localStorage.setItem(storageKey, JSON.stringify(goals));
}

function formatCurrency(amount) {
    return "Rs. " + Number(amount).toLocaleString("en-PK", {
        maximumFractionDigits: 2
    });
}

function updateSummary() {
    const totalSavings = goals.reduce((total, goal) => {
        return total + Number(goal.current);
    }, 0);

    const activeGoals = goals.filter(goal => {
        return Number(goal.current) < Number(goal.target);
    }).length;

    const remainingTarget = goals.reduce((total, goal) => {
        return total + Math.max(
            Number(goal.target) - Number(goal.current),
            0
        );
    }, 0);

    totalSavingsElement.textContent = formatCurrency(totalSavings);
    activeGoalsElement.textContent = activeGoals;
    remainingTargetElement.textContent = formatCurrency(remainingTarget);
}

function displayGoals() {
    goalList.innerHTML = "";

    if (goals.length === 0) {
        goalList.innerHTML = `
            <p class="empty-state">
                No savings goals yet. Create your first goal above.
            </p>
        `;

        updateSummary();
        return;
    }

    goals.forEach((goal) => {
        const target = Number(goal.target);
        const saved = Number(goal.current);

        const percentage = target > 0
            ? Math.min((saved / target) * 100, 100)
            : 0;

        const remaining = Math.max(target - saved, 0);
        const completed = saved >= target;

        const goalItem = document.createElement("div");
        goalItem.className = "goal-item";

        goalItem.innerHTML = `
            <div class="goal-info">
                <div>
                    <h4>${escapeHTML(goal.name)}</h4>
                    <p>Target: ${formatCurrency(target)}</p>
                    <p>Deadline: ${escapeHTML(goal.deadline)}</p>
                </div>
                <strong>${percentage.toFixed(1)}%</strong>
            </div>

            <div class="progress-track">
                <div class="progress-fill"
                     style="width: ${percentage}%;"></div>
            </div>

            <div class="goal-amount">
                <span>Saved: ${formatCurrency(saved)}</span>
                <span>Remaining: ${formatCurrency(remaining)}</span>
            </div>

            ${completed ? `
                <p class="goal-completed">Goal Completed!</p>
            ` : ""}

            <div class="goal-actions">
                <button type="button" class="primary-btn add-savings-btn">
                    + Add Savings
                </button>

                <button type="button" class="edit-category-btn">
                    ✎ Edit
                </button>

                <button type="button" class="delete-category-btn">
                    ♲ Delete
                </button>
            </div>
        `;

        const [addButton, editButton, deleteButton] =
            goalItem.querySelectorAll("button");

        addButton.addEventListener("click", () => addSavings(goal.id));

        editButton.addEventListener("click", () => editGoal(goal.id));

        deleteButton.addEventListener("click", () => deleteGoal(goal.id));

        goalList.appendChild(goalItem);
    });

    updateSummary();
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

savingsForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = goalName.value.trim();
    const target = Number(targetAmount.value);
    const current = Number(currentSavings.value);
    const deadline = goalDeadline.value;

    if (
        !name ||
        !Number.isFinite(target) ||
        !Number.isFinite(current) ||
        target <= 0 ||
        current < 0 ||
        current > target ||
        !deadline
    ) {
        alert("Please enter valid goal details. Current savings cannot exceed the target amount.");
        return;
    }

    goals.push({
        id: Date.now(),
        name,
        target,
        current,
        deadline
    });

    saveGoals();
    displayGoals();
    savingsForm.reset();

    currentSavings.value = 0;
});

async function addSavings(id) {
    const goal = goals.find(item => item.id === id);

    if (!goal) return;

    const result = await showEditModal({
        title: "Add Savings",
        fields: [
            {
                name: "amount",
                label: "Amount to Add (PKR)",
                type: "number",
                value: "",
                min: 0.01
            }
        ]
    });

    if (!result) return;

    const amount = Number(result.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid savings amount.");
        return;
    }

    goal.current = Number(goal.current) + amount;

    saveGoals();
    displayGoals();
}

async function editGoal(id) {
    const goal = goals.find(item => item.id === id);

    if (!goal) return;

    const result = await showEditModal({
        title: "Edit Savings Goal",
        fields: [
            {
                name: "name",
                label: "Goal Name",
                type: "text",
                value: goal.name
            },
            {
                name: "target",
                label: "Target Amount (PKR)",
                type: "number",
                value: String(goal.target)
            },
            {
                name: "current",
                label: "Current Savings (PKR)",
                type: "number",
                value: String(goal.current)
            },
            {
                name: "deadline",
                label: "Target Date",
                type: "date",
                value: goal.deadline
            }
        ]
    });

    if (!result) return;

    const target = Number(result.target);
    const current = Number(result.current);

    if (
        !result.name.trim() ||
        !Number.isFinite(target) ||
        !Number.isFinite(current) ||
        target <= 0 ||
        current < 0 ||
        !result.deadline
    ) {
        alert("Please enter valid goal details.");
        return;
    }

    goal.name = result.name.trim();
    goal.target = target;
    goal.current = current;
    goal.deadline = result.deadline;

    saveGoals();
    displayGoals();
}

async function deleteGoal(id) {
    const goal = goals.find(item => item.id === id);

    if (!goal) return;

    const confirmed = await showDeleteModal(
        `Are you sure you want to delete "${goal.name}"?`
    );

    if (!confirmed) return;

    goals = goals.filter(item => item.id !== id);

    saveGoals();
    displayGoals();
}

displayGoals();

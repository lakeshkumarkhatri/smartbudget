
import {
    showEditModal,
    showDeleteModal
} from "../components/action-modals.js";

// ==========================================
// SMARTBUDGET - BUDGET PLANNER
// ==========================================

const monthlyBudget = 100000;

const budgetForm = document.getElementById("budgetForm");
const categoryNameInput = document.getElementById("categoryName");
const categoryAmountInput = document.getElementById("categoryAmount");

const totalAllocatedElement = document.getElementById("totalAllocated");
const remainingBudgetElement = document.getElementById("remainingBudget");

const categoryList = document.getElementById("categoryList");

// ==========================================
// LOCAL STORAGE
// ==========================================

let categories = JSON.parse(
    localStorage.getItem("budgetCategories")
) || [];

let totalAllocated = 0;

function saveCategories() {
    localStorage.setItem(
        "budgetCategories",
        JSON.stringify(categories)
    );
}

// ==========================================
// DISPLAY CATEGORIES
// ==========================================

function displayCategories() {

    categoryList.innerHTML = "";

    categories.forEach(function (category) {

        const categoryItem = document.createElement("div");
        categoryItem.classList.add("category-item");

        const details = document.createElement("div");

        const heading = document.createElement("h4");
        heading.textContent = category.name;

        const description = document.createElement("p");
        description.textContent = "Monthly allocation";

        details.append(heading, description);

        const actions = document.createElement("div");
        actions.classList.add("category-actions");

        const amount = document.createElement("strong");
        amount.textContent =
            `Rs. ${Number(category.amount).toLocaleString("en-PK")}`;

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.classList.add("edit-category-btn");
        editButton.textContent = "✎ Edit";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList.add("delete-category-btn");
        deleteButton.textContent = "♲ Delete";

        actions.append(amount, editButton, deleteButton);
        categoryItem.append(details, actions);
        categoryList.appendChild(categoryItem);

        // EDIT CATEGORY
        editButton.addEventListener("click", async function () {

            const result = await showEditModal({
                title: "Edit Budget Category",
                fields: [
                    {
                        name: "name",
                        label: "Category Name",
                        value: category.name,
                        type: "text"
                    },
                    {
                        name: "amount",
                        label: "Planned Amount (Rs.)",
                        value: category.amount,
                        type: "number"
                    }
                ]
            });

            if (!result) return;

            const newName = result.name.trim();
            const newAmount = Number(result.amount);

            if (
                newName === "" ||
                !Number.isFinite(newAmount) ||
                newAmount <= 0
            ) {
                alert("Please enter a valid category name and amount.");
                return;
            }

            const updatedTotal =
                totalAllocated - Number(category.amount) + newAmount;

            if (updatedTotal > monthlyBudget) {
                alert("Not enough remaining budget.");
                return;
            }

            category.name = newName;
            category.amount = newAmount;

            saveCategories();
            displayCategories();
            updateBudgetSummary();

        });

        // DELETE CATEGORY
        deleteButton.addEventListener("click", async function () {

            const confirmed = await showDeleteModal(
                `Are you sure you want to delete "${category.name}"?`
            );

            if (!confirmed) return;

            categories.splice(categories.indexOf(category), 1);

            saveCategories();
            displayCategories();
            updateBudgetSummary();

        });

    });

}

// ==========================================
// UPDATE BUDGET SUMMARY
// ==========================================

function updateBudgetSummary() {

    totalAllocated = categories.reduce(
        (total, category) => total + Number(category.amount),
        0
    );

    const remainingBudget = monthlyBudget - totalAllocated;

    totalAllocatedElement.textContent =
        `Rs. ${totalAllocated.toLocaleString("en-PK")}`;

    remainingBudgetElement.textContent =
        `Rs. ${remainingBudget.toLocaleString("en-PK")}`;

}

// ==========================================
// ADD CATEGORY
// ==========================================

budgetForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const categoryName = categoryNameInput.value.trim();
    const categoryAmount = Number(categoryAmountInput.value);

    if (
        categoryName === "" ||
        !Number.isFinite(categoryAmount) ||
        categoryAmount <= 0
    ) {
        alert("Please enter a valid category name and amount.");
        return;
    }

    if (categoryAmount > monthlyBudget - totalAllocated) {
        alert("Not enough remaining budget for this category.");
        return;
    }

    categories.push({
        name: categoryName,
        amount: categoryAmount
    });

    saveCategories();
    displayCategories();
    updateBudgetSummary();

    budgetForm.reset();

});

// ==========================================
// INITIAL PAGE LOAD
// ==========================================

displayCategories();
updateBudgetSummary();

console.log("SmartBudget Budget Planner connected!");

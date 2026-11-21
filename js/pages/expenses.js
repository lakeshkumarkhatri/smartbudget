
import {
    showEditModal,
    showDeleteModal
} from "../components/action-modals.js";

// ==========================================
// SMARTBUDGET - EXPENSE MANAGER
// ==========================================

// HTML elements
const expenseForm = document.getElementById("expenseForm");
const expenseTitleInput = document.getElementById("expenseTitle");
const expenseAmountInput = document.getElementById("expenseAmount");
const expenseCategoryInput = document.getElementById("expenseCategory");
const expenseDateInput = document.getElementById("expenseDate");

const expenseSearch = document.getElementById("expenseSearch");
const categoryFilter = document.getElementById("categoryFilter");
const expenseTableBody = document.getElementById("expenseTableBody");

const totalExpensesElement = document.getElementById("totalExpenses");
const monthlyExpensesElement = document.getElementById("monthlyExpenses");
const transactionCountElement = document.getElementById("transactionCount");

// ==========================================
// LOCAL STORAGE
// ==========================================

let expenses = JSON.parse(
    localStorage.getItem("smartBudgetExpenses")
) || [];

function saveExpenses() {
    localStorage.setItem(
        "smartBudgetExpenses",
        JSON.stringify(expenses)
    );
}

// ==========================================
// DISPLAY EXPENSES
// ==========================================

function displayExpenses() {

    expenseTableBody.innerHTML = "";

    const searchText = expenseSearch.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    const filteredExpenses = expenses.filter(function(expense) {

        const matchesSearch =
            expense.title.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "" ||
            expense.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    if (filteredExpenses.length === 0) {

        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.textContent = "No expenses found.";

        row.appendChild(cell);
        expenseTableBody.appendChild(row);

        return;
    }

    filteredExpenses.forEach(function(expense) {

        const row = document.createElement("tr");

        const titleCell = document.createElement("td");
        titleCell.textContent = expense.title;

        const categoryCell = document.createElement("td");
        categoryCell.textContent = expense.category;

        const dateCell = document.createElement("td");
        dateCell.textContent = formatDate(expense.date);

        const amountCell = document.createElement("td");
        amountCell.textContent =
            `Rs. ${Number(expense.amount).toLocaleString("en-PK")}`;

        const actionsCell = document.createElement("td");
        actionsCell.classList.add("expense-actions");

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.classList.add("edit-category-btn");
        editButton.textContent = "✎ Edit";

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.classList.add("delete-category-btn");
        deleteButton.textContent = "♲ Delete";

        actionsCell.append(editButton, deleteButton);

        row.append(
            titleCell,
            categoryCell,
            dateCell,
            amountCell,
            actionsCell
        );

        expenseTableBody.appendChild(row);

        // ==================================
        // EDIT EXPENSE
        // ==================================

        editButton.addEventListener("click", async function() {

            const result = await showEditModal({
                title: "Edit Expense",
                fields: [
                    {
                        name: "title",
                        label: "Expense Title",
                        value: expense.title,
                        type: "text"
                    },
                    {
                        name: "amount",
                        label: "Amount (Rs.)",
                        value: expense.amount,
                        type: "number"
                    },
                    {
                        name: "category",
                        label: "Category",
                        value: expense.category,
                        type: "select",
                        options: [
                            "Food",
                            "Transport",
                            "Shopping",
                            "Bills",
                            "Education",
                            "Other"
                        ]
                    },
                    {
                        name: "date",
                        label: "Date",
                        value: expense.date,
                        type: "date"
                    }
                ]
            });

            if (!result) return;

            const newTitle = result.title.trim();
            const newAmount = Number(result.amount);
            const newDate = result.date;

            if (
                newTitle === "" ||
                !Number.isFinite(newAmount) ||
                newAmount <= 0 ||
                !newDate
            ) {
                alert("Please enter valid expense details.");
                return;
            }

            expense.title = newTitle;
            expense.amount = newAmount;
            expense.category = result.category;
            expense.date = newDate;

            saveExpenses();
            displayExpenses();
            updateExpenseSummary();

        });

        // ==================================
        // DELETE EXPENSE
        // ==================================

        deleteButton.addEventListener("click", async function() {

            const confirmed = await showDeleteModal(
                `Are you sure you want to delete "${expense.title}"?`
            );

            if (!confirmed) return;

            expenses.splice(expenses.indexOf(expense), 1);

            saveExpenses();
            displayExpenses();
            updateExpenseSummary();

        });

    });

}

// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    const date = new Date(dateString + "T00:00:00");

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

}

// ==========================================
// UPDATE EXPENSE SUMMARY
// ==========================================

function updateExpenseSummary() {

    const totalExpenses = expenses.reduce(
        (total, expense) => total + Number(expense.amount),
        0
    );

    const currentDate = new Date();

    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyExpenses = expenses
        .filter(function(expense) {

            const expenseDate = new Date(
                expense.date + "T00:00:00"
            );

            return (
                expenseDate.getMonth() === currentMonth &&
                expenseDate.getFullYear() === currentYear
            );

        })
        .reduce(
            (total, expense) => total + Number(expense.amount),
            0
        );

    totalExpensesElement.textContent =
        `Rs. ${totalExpenses.toLocaleString("en-PK")}`;

    monthlyExpensesElement.textContent =
        `Rs. ${monthlyExpenses.toLocaleString("en-PK")}`;

    transactionCountElement.textContent = expenses.length;

}

// ==========================================
// ADD EXPENSE
// ==========================================

expenseForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const title = expenseTitleInput.value.trim();
    const amount = Number(expenseAmountInput.value);
    const category = expenseCategoryInput.value;
    const date = expenseDateInput.value;

    if (
        title === "" ||
        !Number.isFinite(amount) ||
        amount <= 0 ||
        category === "" ||
        date === ""
    ) {
        alert("Please fill in all fields with valid information.");
        return;
    }

    const newExpense = {
        id: Date.now().toString(),
        title,
        amount,
        category,
        date
    };

    expenses.push(newExpense);

    saveExpenses();
    displayExpenses();
    updateExpenseSummary();

    expenseForm.reset();

});

// ==========================================
// SEARCH AND FILTER
// ==========================================

expenseSearch.addEventListener("input", displayExpenses);
categoryFilter.addEventListener("change", displayExpenses);

// ==========================================
// INITIAL PAGE LOAD
// ==========================================

displayExpenses();
updateExpenseSummary();

console.log("SmartBudget Expense Manager connected!");

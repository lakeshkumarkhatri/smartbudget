
const budgetKey = "budgetCategories";
const expensesKey = "smartBudgetExpenses";

const simulatorForm = document.getElementById("simulatorForm");
const purchaseName = document.getElementById("purchaseName");
const purchaseCategory = document.getElementById("purchaseCategory");
const purchaseAmount = document.getElementById("purchaseAmount");

const simulatorBudget = document.getElementById("simulatorBudget");
const simulatorExpenses = document.getElementById("simulatorExpenses");
const simulatorBalance = document.getElementById("simulatorBalance");

const balanceBefore = document.getElementById("balanceBefore");
const simulatedAmount = document.getElementById("simulatedAmount");
const balanceAfter = document.getElementById("balanceAfter");
const simulationMessage = document.getElementById("simulationMessage");

const applyButton = document.getElementById("applySimulation");
const resetButton = document.getElementById("resetSimulation");

let currentSimulation = null;

function getBudget() {
    const categories = JSON.parse(localStorage.getItem(budgetKey)) || [];

    return categories.reduce((total, category) => {
        return total + Number(category.amount || 0);
    }, 0);
}

function getExpenses() {
    return JSON.parse(localStorage.getItem(expensesKey)) || [];
}

function getTotalExpenses() {
    const expenses = getExpenses();

    return expenses.reduce((total, expense) => {
        return total + Number(expense.amount || 0);
    }, 0);
}

function formatCurrency(amount) {
    return "Rs. " + Number(amount).toLocaleString("en-PK", {
        maximumFractionDigits: 2
    });
}

function updateSummary() {
    const budget = getBudget();
    const expenses = getTotalExpenses();
    const balance = budget - expenses;

    simulatorBudget.textContent = formatCurrency(budget);
    simulatorExpenses.textContent = formatCurrency(expenses);
    simulatorBalance.textContent = formatCurrency(balance);

    return { budget, expenses, balance };
}

function resetResults() {
    const { balance } = updateSummary();

    balanceBefore.textContent = formatCurrency(balance);
    simulatedAmount.textContent = formatCurrency(0);
    balanceAfter.textContent = formatCurrency(balance);

    simulationMessage.textContent =
        "This is a hypothetical result. Your actual expenses will not change unless you explicitly apply the simulation.";

    currentSimulation = null;
    applyButton.disabled = true;
}

simulatorForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = purchaseName.value.trim();
    const category = purchaseCategory.value;
    const amount = Number(purchaseAmount.value);

    if (!name || !category || !Number.isFinite(amount) || amount <= 0) {
        alert("Please enter a valid purchase name, category, and amount.");
        return;
    }

    const { balance } = updateSummary();
    const newBalance = balance - amount;

    currentSimulation = {
        title: name,
        category: category,
        amount: amount,
        date: new Date().toISOString().split("T")[0]
    };

    balanceBefore.textContent = formatCurrency(balance);
    simulatedAmount.textContent = formatCurrency(amount);
    balanceAfter.textContent = formatCurrency(newBalance);

    if (newBalance < 0) {
        simulationMessage.textContent =
            "Warning: This purchase exceeds your available balance by " +
            formatCurrency(Math.abs(newBalance)) + ".";
    } else {
        simulationMessage.textContent =
            "After this purchase, you would have " +
            formatCurrency(newBalance) + " remaining.";
    }

    applyButton.disabled = false;
});

applyButton.addEventListener("click", () => {
    if (!currentSimulation) {
        alert("Please simulate a purchase first.");
        return;
    }

    const expenses = getExpenses();

    expenses.push({
        id: Date.now(),
        ...currentSimulation
    });

    localStorage.setItem(expensesKey, JSON.stringify(expenses));

    alert("Purchase successfully added to your expenses.");

    simulatorForm.reset();
    resetResults();
});

resetButton.addEventListener("click", () => {
    simulatorForm.reset();
    resetResults();
});

resetResults();

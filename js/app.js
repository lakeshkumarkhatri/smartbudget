
const budgetKey = "budgetCategories";
const expensesKey = "smartBudgetExpenses";
const savingsKey = "smartBudgetSavings";

const dashboardBudget = document.getElementById("dashboardBudget");
const dashboardExpenses = document.getElementById("dashboardExpenses");
const dashboardBalance = document.getElementById("dashboardBalance");
const dashboardSavings = document.getElementById("dashboardSavings");

function getStoredData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        console.error(`Unable to read ${key} from Local Storage:`, error);
        return [];
    }
}

function formatCurrency(amount) {
    return "Rs. " + Number(amount).toLocaleString("en-PK", {
        maximumFractionDigits: 2
    });
}

function calculateDashboard() {
    const categories = getStoredData(budgetKey);
    const expenses = getStoredData(expensesKey);
    const savingsGoals = getStoredData(savingsKey);

    const totalBudget = categories.reduce((total, category) => {
        return total + Number(category.amount || 0);
    }, 0);

    const totalExpenses = expenses.reduce((total, expense) => {
        return total + Number(expense.amount || 0);
    }, 0);

    const remainingBalance = totalBudget - totalExpenses;

    const totalSavings = savingsGoals.reduce((total, goal) => {
        return total + Number(goal.current || 0);
    }, 0);

    dashboardBudget.textContent = formatCurrency(totalBudget);
    dashboardExpenses.textContent = formatCurrency(totalExpenses);
    dashboardBalance.textContent = formatCurrency(remainingBalance);
    dashboardSavings.textContent = formatCurrency(totalSavings);
}

calculateDashboard();

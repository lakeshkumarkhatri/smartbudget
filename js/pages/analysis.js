
const storageKey = "smartBudgetExpenses";

const totalSpendingElement = document.getElementById("totalSpending");
const highestCategoryElement = document.getElementById("highestCategory");
const categoriesUsedElement = document.getElementById("categoriesUsed");

const chartTotalElement = document.getElementById("chartTotal");
const donutChart = document.getElementById("donutChart");
const categoryDetails = document.getElementById("categoryDetails");
const insightList = document.getElementById("insightList");

const categoryColors = {
    Food: "#3b82f6",
    Transport: "#f59e0b",
    Shopping: "#8b5cf6",
    Bills: "#ef4444",
    Education: "#10b981",
    Other: "#64748b"
};

function getExpenses() {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
}

function formatCurrency(amount) {
    return "Rs. " + Number(amount).toLocaleString("en-PK", {
        maximumFractionDigits: 2
    });
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

function calculateAnalysis() {
    const expenses = getExpenses();

    const totalSpending = expenses.reduce((total, expense) => {
        return total + Number(expense.amount || 0);
    }, 0);

    const categoryTotals = {};

    expenses.forEach(expense => {
        const category = expense.category || "Other";
        const amount = Number(expense.amount) || 0;

        categoryTotals[category] =
            (categoryTotals[category] || 0) + amount;
    });

    const categories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1]);

    const highestCategory = categories.length
        ? categories[0][0]
        : "None";

    return {
        totalSpending,
        categories,
        highestCategory
    };
}

function updateSummary(analysis) {
    totalSpendingElement.textContent =
        formatCurrency(analysis.totalSpending);

    highestCategoryElement.textContent =
        analysis.highestCategory;

    categoriesUsedElement.textContent =
        analysis.categories.length;

    chartTotalElement.textContent =
        formatCurrency(analysis.totalSpending);
}

function updateDonutChart(analysis) {
    if (analysis.totalSpending === 0) {
        donutChart.style.background =
            "#e2e8f0";

        return;
    }

    let currentPercentage = 0;

    const gradientParts = analysis.categories.map(([category, amount]) => {
        const percentage =
            (amount / analysis.totalSpending) * 100;

        const start = currentPercentage;
        const end = currentPercentage + percentage;

        currentPercentage = end;

        const color = categoryColors[category] || "#64748b";

        return `${color} ${start}% ${end}%`;
    });

    donutChart.style.background =
        `conic-gradient(${gradientParts.join(", ")})`;
}

function updateCategoryDetails(analysis) {
    categoryDetails.innerHTML = "";

    if (analysis.categories.length === 0) {
        categoryDetails.innerHTML =
            "<p>No expense records available yet.</p>";
        return;
    }

    analysis.categories.forEach(([category, amount]) => {
        const color = categoryColors[category] || "#64748b";

        const item = document.createElement("div");
        item.className = "analysis-category";

        item.innerHTML = `
            <div class="category-label">
                <span class="category-dot"
                    style="background-color: ${color};"></span>
                <span>${escapeHTML(category)}</span>
            </div>

            <strong>${formatCurrency(amount)}</strong>
        `;

        categoryDetails.appendChild(item);
    });
}

function updateInsights(analysis) {
    insightList.innerHTML = "";

    if (analysis.categories.length === 0) {
        insightList.innerHTML = `
            <div class="insight-item">
                <h4>No Spending Data</h4>
                <p>Add expenses to see your spending insights.</p>
            </div>
        `;
        return;
    }

    const highest = analysis.categories[0];
    const lowest = analysis.categories[
        analysis.categories.length - 1
    ];

    const highestPercentage =
        (highest[1] / analysis.totalSpending) * 100;

    const insights = [
        {
            title: "Highest Spending",
            message: `${highest[0]} is your highest spending category at ${formatCurrency(highest[1])}.`
        },
        {
            title: "Lowest Spending",
            message: `${lowest[0]} has the lowest spending at ${formatCurrency(lowest[1])}.`
        },
        {
            title: "Spending Pattern",
            message: `${highest[0]} accounts for ${highestPercentage.toFixed(1)}% of your total spending.`
        }
    ];

    insights.forEach(insight => {
        const item = document.createElement("div");
        item.className = "insight-item";

        item.innerHTML = `
            <h4>${escapeHTML(insight.title)}</h4>
            <p>${escapeHTML(insight.message)}</p>
        `;

        insightList.appendChild(item);
    });
}

function displayAnalysis() {
    const analysis = calculateAnalysis();

    updateSummary(analysis);
    updateDonutChart(analysis);
    updateCategoryDetails(analysis);
    updateInsights(analysis);
}

displayAnalysis();

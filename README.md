# SmartBudget

**Student-First Financial Planning and Decision Support Web Application**

SmartBudget is a frontend-only web application designed to help university students plan budgets, manage expenses, track savings goals, and make informed spending decisions.

Unlike a basic expense tracker, SmartBudget focuses on financial planning and decision-making. Its What-If Spending Simulator allows users to evaluate hypothetical purchases and understand their impact on the remaining budget and savings goals before committing to a purchase.

## Project Objectives

- Create and manage a personal budget.
- Record, edit, delete, search, and filter expenses.
- Monitor spending and remaining budget through a dashboard.
- Simulate hypothetical purchases before making spending decisions.
- Set savings goals and calculate the required savings pace.
- Analyze spending patterns by category.
- Save financial data locally in the browser.

## Planned Modules

1. **Budget Planner** — Set available funds, budget periods, category limits, and savings targets.
2. **Expense Manager** — Manage expenses and organize transactions by category and date.
3. **Financial Dashboard** — View total spending, remaining funds, savings progress, and budget status.
4. **What-If Spending Simulator** — Evaluate hypothetical purchases without changing actual financial data until the user chooses to apply a decision.
5. **Savings Goal Planner** — Set financial targets and calculate weekly or monthly savings requirements.
6. **Spending Analysis** — Analyze category-wise spending and identify spending patterns.
7. **Local Data Storage** — Persist data in the browser using `localStorage` and JSON.

## Technology Stack

- **HTML5** — Semantic structure and forms
- **CSS3** — Responsive layouts, Flexbox, Grid, and styling
- **Vanilla JavaScript (ES6+)** — Application logic and interactivity
- **DOM API and Events** — Dynamic interface updates
- **localStorage and JSON** — Browser-local data persistence

The core application will not require a backend, database, authentication system, or frontend framework.

## Project Structure

```text
smartbudget/
├── assets/
├── css/
├── docs/
├── js/
├── pages/
├── .gitignore
├── index.html
└── README.md
```

## Getting Started

1. Clone or download this repository.
2. Open the project folder in VS Code.
3. Open `index.html` in a browser or use the VS Code Live Server extension when the project is ready.

## Data and Privacy

SmartBudget will store its application data in the browser's `localStorage`. Data will remain available in the same browser on the same device unless the site data is cleared. It will not automatically synchronize across devices.

## Development Team

- **Lakesh Kumar** — [LinkedIn](https://www.linkedin.com/in/lakesh-kumar/)
- **Deepa Kumari** — [LinkedIn](https://www.linkedin.com/in/deepa-kumari-6b8a06376/)

## Project Status

**Status:** Initial setup and planning

This project is being developed as a Web Engineering course project for BS Software Engineering, Fall 2026, at Sukkur IBA University.

## Future Enhancements

Optional enhancements may include recurring expenses, historical spending trends, scenario comparisons, additional currency support, and public API integration.
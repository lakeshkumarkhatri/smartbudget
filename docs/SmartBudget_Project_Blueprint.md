# SmartBudget --- Project Blueprint

**Version:** 1.0\
**Project type:** Web Engineering course project\
**Team:** Lakesh Kumar and Deepa Kumari\
**Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+), browser
`localStorage`, JSON\
**Architecture:** Shared sidebar navigation + separate HTML pages

------------------------------------------------------------------------

## 1. Purpose of This Blueprint

This is the implementation guide for SmartBudget. Build the project in
the order described here. Treat this file as the main reference for page
responsibilities, data structures, business rules, development tasks,
and testing.

### Architecture decision

The selected architecture is **separate HTML pages with a shared sidebar
dashboard layout**. This differs from the original proposal's
single-page-interface wording, so update the proposal later if your
instructor expects the proposal and implementation architecture to match
exactly.

### Core workflow

**Plan → Track → Simulate → Analyze → Adjust → Save**

1.  Set up a budget and category limits.
2.  Record expenses and savings deposits.
3.  See the dashboard update from saved data.
4.  test a hypothetical purchase in the simulator.
5.  Review spending and savings progress.
6.  Export a backup when needed.

------------------------------------------------------------------------

## 2. Project Scope

### 2.1 Required MVP

Complete these features before adding optional extras:

1.  Dashboard with current budget and spending summary.
2.  Budget planner with income, budget period, categories, limits, and
    savings target.
3.  Expense manager with add, edit, delete, search, filter, and sort.
4.  What-If Spending Simulator with a multi-item basket and explicit
    Apply action.
5.  Savings goal planner with deposits and progress.
6.  Spending analysis with category breakdown and an SVG donut chart.
7.  Local persistence using `localStorage`.
8.  JSON export/import and demo data.
9.  Responsive layout, form validation, empty states, and
    confirmation/error messages.

### 2.2 Not included in the MVP

Do not build these unless all MVP requirements work:

-   Backend, database server, account system, or authentication.
-   Frameworks such as React, Vue, or Bootstrap.
-   AI-powered advice or financial predictions.
-   Bank integrations, real payments, or live financial account data.
-   Multi-user/cloud synchronization.
-   Complex recurring-expense automation.
-   Currency exchange-rate API.

### 2.3 Financial-data disclaimer

SmartBudget is a student project for personal budgeting practice. It
does not connect to banks or provide professional financial advice. Data
is stored in the current browser only unless the user exports it.

------------------------------------------------------------------------

## 3. Technology and Implementation Rules

-   **HTML5:** semantic structure, forms, labels, buttons, tables/lists,
    and accessible navigation.
-   **CSS3:** custom properties, Flexbox, Grid, responsive breakpoints,
    focus states, and dark/light themes.
-   **Vanilla JavaScript:** ES modules, DOM updates, event listeners,
    validation, calculations, and rendering.
-   **`localStorage`:** persistence on the same browser and origin.
-   **JSON:** import/export backup format.
-   **SVG:** draw the spending-analysis donut chart without a chart
    library.
-   **Git/GitHub:** version control and collaboration.

### Rules to keep the code understandable

1.  Keep calculations in utility/service functions rather than repeating
    formulas on pages.
2.  Store monetary values as numbers, not formatted strings such as
    `"Rs. 1,500"`.
3.  Format amounts only when displaying them.
4.  Give every saved record a stable unique ID.
5.  Use event delegation for repeated expense rows/cards when it makes
    the code simpler.
6.  Do not put all application logic in one giant JavaScript file.
7.  Do not save calculated totals as independent data if they can be
    derived from budgets, expenses, and savings records.
8.  Validate imported JSON before replacing existing data.
9.  Never let a hypothetical simulator calculation change actual records
    until the user clicks **Apply This Decision** and confirms.
10. Use one currency setting for the MVP. Default display currency:
    **PKR (Rs.)**; do not convert currencies.

------------------------------------------------------------------------

## 4. Site Map and Navigation

### 4.1 Shared sidebar

The desktop sidebar appears on every page and contains:

-   SmartBudget logo/name
-   Dashboard
-   Budget Planner
-   Expenses
-   What-If Simulator
-   Savings Goals
-   Spending Analysis
-   Settings & Data
-   Current active-page indicator
-   Theme toggle, if implemented in the shared header/sidebar

On narrow screens, the sidebar becomes a menu drawer or collapsible
navigation. Every page must remain usable on a mobile viewport.

### 4.2 Separate HTML pages

  ------------------------------------------------------------------------
  Page                    File                     Main responsibility
  ----------------------- ------------------------ -----------------------
  Dashboard               `index.html`             Summary of the current
                                                   financial position

  Budget Planner          `pages/budget.html`      Create/edit budget and
                                                   category allocations

  Expenses                `pages/expenses.html`    Manage actual expense
                                                   records

  What-If Simulator       `pages/simulator.html`   Test hypothetical
                                                   purchases safely

  Savings Goals           `pages/savings.html`     Manage a savings target
                                                   and deposits

  Spending Analysis       `pages/analysis.html`    Explain spending
                                                   patterns

  Settings & Data         `pages/settings.html`    Theme, demo data,
                                                   import/export, reset
  ------------------------------------------------------------------------

All pages use the same shared CSS and JavaScript modules. Navigation
must use relative paths that work when opened through a local
development server.

------------------------------------------------------------------------

## 5. Page Blueprint

## 5.1 Dashboard --- `index.html`

### Purpose

Answer at a glance: How much money was planned, how much has been spent,
how much remains, and am I on track?

### Layout, from top to bottom

1.  Shared sidebar and top header.
2.  Page heading: "Dashboard" and current budget-period label.
3.  Summary cards:
    -   Planned budget
    -   Total spent
    -   Remaining budget
    -   Savings goal progress
4.  Budget progress bar with status.
5.  Spending by category preview.
6.  Recent expenses list (latest five).
7.  Daily spending allowance.
8.  Quick actions: Add Expense, Edit Budget, Test a Purchase.
9.  Helpful empty state when the user has not created a budget.

### Interactions

-   **Add Expense** opens the expense form on the Expenses page.
-   **Edit Budget** opens Budget Planner.
-   **Test a Purchase** opens What-If Simulator.
-   Clicking a category or "View analysis" opens Spending Analysis.
-   Recent expenses link to the Expenses page.
-   Dashboard figures update whenever the page loads and after data
    changes on the current page.

### Calculations

-   `totalSpent = sum(expenses in the active budget period)`
-   `remainingBudget = plannedBudget - totalSpent`
-   `budgetUsagePercent = totalSpent / plannedBudget * 100` when planned
    budget is greater than zero.
-   `dailyAllowance = max(remainingBudget, 0) / remainingDays` when
    remaining days are greater than zero.
-   `savingsProgress = currentSavings / savingsTarget * 100` when
    savings target is greater than zero.

If no valid budget exists, show a setup prompt instead of misleading
zero-filled cards.

------------------------------------------------------------------------

## 5.2 Budget Planner --- `pages/budget.html`

### Purpose

Create or edit the active budget, define the period, and allocate
amounts to categories.

### Sections

1.  Budget period:
    -   Start date
    -   End date
    -   Planned available income/budget amount
2.  Savings target for the period.
3.  Category allocation editor:
    -   Category name
    -   Planned limit
    -   Add category
    -   Edit category
    -   Remove category
4.  Allocation summary:
    -   Total category allocation
    -   Unallocated amount
    -   Over-allocation warning
5.  Save Budget button.

### Suggested default categories

-   Food
-   Transport
-   Education
-   Bills
-   Shopping
-   Health
-   Entertainment
-   Other

Users may add their own categories. Categories already used by expenses
must not be deleted without a clear decision. Simplest MVP rule: prevent
deletion while a category is referenced and tell the user to reassign
those expenses first.

### Interactions

-   Saving a valid budget updates `localStorage`.
-   The dashboard and analysis page read the saved budget.
-   Editing a budget updates its existing record rather than creating
    duplicate active budgets.
-   A confirmation is required before replacing a budget period that
    would affect existing calculations.

### Validation and rules

-   Budget amount must be a finite number greater than zero.
-   Start date must be on or before end date.
-   Savings target must be zero or greater and cannot exceed the planned
    budget.
-   Category limits must be zero or greater.
-   Sum of category limits should not exceed the planned budget. If it
    does, show a warning and block saving until corrected for the MVP.
-   A category name cannot be blank or duplicate another category name
    after trimming and case-insensitive comparison.
-   Do not silently delete actual expenses when a category is removed.

### Important definition

For the MVP, **planned budget** means the total amount available to
manage during the chosen period. Category allocations divide that amount
into spending limits; they are not extra money on top of the planned
budget.

------------------------------------------------------------------------

## 5.3 Expense Manager --- `pages/expenses.html`

### Purpose

Record and manage actual spending.

### Expense fields

-   Title/description
-   Amount
-   Category
-   Date
-   Optional note (may be deferred if time is short)
-   ID (generated internally)
-   Created/updated timestamp (optional but useful)

### Page layout

1.  Page heading and Add Expense button.
2.  Search field.
3.  Filters: category and date range.
4.  Sort selector: newest, oldest, amount high-to-low, amount
    low-to-high, title A--Z.
5.  Expense form (inline panel or modal).
6.  Expense list/table.
7.  Visible result count and empty state.

### Interactions

-   Add: validate and save an expense.
-   Edit: populate the form with the selected record and update that
    record.
-   Delete: show a confirmation, then remove the record.
-   Search: match title and note without case sensitivity.
-   Filter: combine selected filters.
-   Sort: reorder visible results without changing stored data.
-   Cancel form: close/reset the form without saving.
-   After add/edit/delete, refresh relevant totals on the current page.
    Other pages calculate fresh totals when opened.

### Validation

-   Title cannot be blank.
-   Amount must be a finite number greater than zero.
-   Category must match an existing category.
-   Date is required and must be a valid date.
-   Do not accept malformed values such as `NaN`, infinity, negative
    amounts, or empty strings.
-   When the active budget is configured, warn if the expense date falls
    outside the budget period. The MVP may block out-of-period expenses
    to keep reports consistent; choose one behavior and use it
    everywhere. **Recommended MVP rule: block saving expenses outside
    the active budget period and explain why.**

### Filtering rule

The search/filter/sort operations affect only the displayed list. They
must not delete or modify saved records.

------------------------------------------------------------------------

## 5.4 What-If Spending Simulator --- `pages/simulator.html`

### Purpose

Let users test a purchase before deciding whether to make it. This is
SmartBudget's key differentiator.

### Page sections

1.  Short explanation: simulations do not change actual records.
2.  Purchase basket:
    -   Item name
    -   Estimated cost
    -   Category
    -   Add item / remove item
3.  Scenario summary:
    -   Current remaining budget
    -   Total proposed basket cost
    -   Remaining budget after proposed purchase
    -   Category limit remaining before and after
    -   Savings goal impact
4.  Verdict panel.
5.  Buttons: Clear Scenario and Apply This Decision.

### Verdict rules, evaluated in this order

1.  **Unaffordable:** proposed total exceeds remaining overall budget.
2.  **Savings Impact:** purchase fits the overall remaining budget but
    would push planned savings below the target/reserved amount under
    the app's chosen savings calculation.
3.  **Category Warning:** purchase fits overall remaining budget but
    causes one or more category limits to be exceeded.
4.  **Safe Purchase:** purchase fits overall remaining budget, preserves
    the savings target, and stays within category limits.

If more than one warning applies, show the most severe verdict plus all
relevant warnings. Never imply that a purchase is objectively good; the
verdict only reflects the user's configured numbers.

### Simulation calculation

-   `basketTotal = sum(valid basket item costs)`
-   `remainingAfter = currentRemainingBudget - basketTotal`
-   `categoryRemainingAfter = categoryLimit - actualCategorySpend - proposedCategorySpend`
-   `savingsProtectedAmount = max(0, savingsTarget - currentSavings)` if
    the target is interpreted as an additional amount still needed in
    the period.

The implementation team must choose one consistent definition of savings
before coding. **Recommended simple MVP:** treat the savings target as
money reserved from the planned budget. The amount available for
spending is `plannedBudget - savingsTarget`; spending that would reduce
the unspent amount below the reserved savings amount triggers Savings
Impact. Document this rule in the UI/help text. Do not mix this
definition with the "additional savings still needed" definition above;
pick the reserved-budget interpretation for the first version and
calculate consistently.

### Apply action

-   Apply This Decision opens a confirmation that states the basket
    total and that actual expenses will be created.
-   If confirmed, add each basket item as an actual expense dated today
    (or ask for a date if necessary), save them, then clear the
    scenario.
-   If cancelled, make no changes.
-   A scenario that is only being tested must never be persisted as
    actual spending.
-   Validate the entire basket before applying; do not partially apply
    it if one item is invalid.

------------------------------------------------------------------------

## 5.5 Savings Goals --- `pages/savings.html`

### Purpose

Track progress toward a savings target.

### MVP fields

-   Goal name
-   Target amount
-   Current saved amount (derived from deposit records, not manually
    duplicated)
-   Target date
-   Deposit amount and date
-   ID

### Page sections

1.  Goal summary card.
2.  Progress bar and percentage.
3.  Remaining amount to target.
4.  Required savings pace per week/month, based on the remaining amount
    and time to target date.
5.  Deposit form.
6.  Deposit history.
7.  Edit goal and delete goal controls.

### Interactions

-   Create or edit the goal.
-   Add a deposit.
-   Show updated progress after a deposit.
-   Delete goal only after confirmation.
-   If the goal date has passed and target is incomplete, show "Target
    date passed" rather than a negative or misleading pace.

### Calculations

-   `currentSavings = sum(deposits for the active goal)`
-   `remainingToGoal = max(targetAmount - currentSavings, 0)`
-   `progressPercent = targetAmount > 0 ? min(currentSavings / targetAmount * 100, 100) : 0`
-   Required weekly/monthly savings = remaining amount divided by the
    number of weeks/months remaining. Define date rounding consistently;
    do not divide by zero.

### Validation

-   Goal name is required.
-   Target amount must be greater than zero.
-   Deposit amount must be greater than zero.
-   Target date must be a valid date.
-   A deposit cannot be negative.

------------------------------------------------------------------------

## 5.6 Spending Analysis --- `pages/analysis.html`

### Purpose

Turn expense records into understandable summaries.

### Sections

1.  Date-period selector (active budget period as default).
2.  Total spending and transaction count.
3.  Category breakdown:
    -   Category name
    -   Amount spent
    -   Percentage of total spending
    -   Category limit and remaining amount
4.  SVG donut chart with text legend.
5.  Average transaction amount.
6.  Largest expense.
7.  Daily spending rate.
8.  Short status messages based on the numbers.

### Calculations

-   `totalSpent = sum(in-scope expense amounts)`
-   `categorySpend = sum(expenses grouped by category)`
-   `categoryPercent = totalSpent > 0 ? categorySpend / totalSpent * 100 : 0`
-   `averageExpense = expenseCount > 0 ? totalSpent / expenseCount : 0`
-   `largestExpense = maximum expense amount, or none when list is empty`
-   `dailyRate = totalSpent / elapsedDays`, when elapsed days are
    greater than zero.

### Chart rules

-   Use a pure SVG donut chart.
-   Always show a text legend so the chart is understandable without
    relying on color alone.
-   If no expenses exist, show an empty state instead of a broken chart.
-   Use category labels and amounts in the legend.
-   Chart and summary values must be based on the same date filter.

### Analysis must not

-   Modify expense records.
-   Treat filtered display data as the only saved data.
-   claim predictions or professional financial advice.

------------------------------------------------------------------------

## 5.7 Settings & Data --- `pages/settings.html`

### Purpose

Manage preferences and protect user data.

### Sections

1.  Theme: light/dark (optional if schedule permits).
2.  Currency display: PKR only for MVP, with no conversion.
3.  Export data to JSON.
4.  Import data from JSON.
5.  Load demo data.
6.  Clear all app data.
7.  Storage/privacy explanation.

### Interactions and safety

-   Export creates a JSON file containing the app's data and schema
    version.
-   Import reads and validates the file before replacing current data.
-   Before import, clearly state whether current data will be replaced
    or merged. **MVP rule: replace only after confirmation; never merge
    silently.**
-   Invalid import must not overwrite current data.
-   Demo data should be clearly labelled and load only after
    confirmation if it will replace existing data.
-   Clear All Data requires a confirmation step and removes only
    SmartBudget's known storage keys.
-   Explain that browser storage may be lost if the user clears site
    data or changes browser/device.

------------------------------------------------------------------------

## 6. Shared Layout and Responsive Behavior

### Desktop

-   Fixed or sticky sidebar on the left.
-   Main content area to the right.
-   Page heading at the top of the main area.
-   Cards and forms use CSS Grid/Flexbox.
-   Tables may scroll horizontally if necessary, but prefer a card/list
    layout on small screens.

### Mobile

-   Sidebar collapses to a drawer or compact menu.
-   Main content uses one column.
-   Buttons and form controls are easy to tap.
-   No essential action depends on hover.
-   Modals/forms fit the viewport and can be closed by keyboard where
    practical.

### Accessibility basics

-   Every input has a visible label.
-   Use semantic buttons and links.
-   Visible keyboard focus.
-   Do not communicate warning status through color alone.
-   Provide useful error messages near invalid fields.
-   Give icon-only controls accessible labels.
-   Ensure text contrast is readable.

------------------------------------------------------------------------

## 7. Data Model

Use one versioned JSON object as the canonical stored state. Suggested
key: `smartbudget:data:v1`.

``` json
{
  "schemaVersion": 1,
  "settings": {
    "currency": "PKR",
    "theme": "light"
  },
  "budget": {
    "id": "budget_...",
    "startDate": "2026-10-01",
    "endDate": "2026-10-31",
    "plannedAmount": 50000,
    "savingsTarget": 8000,
    "categories": [
      { "id": "cat_food", "name": "Food", "limit": 12000 },
      { "id": "cat_transport", "name": "Transport", "limit": 5000 }
    ]
  },
  "expenses": [
    {
      "id": "expense_...",
      "title": "Lunch",
      "amount": 650,
      "categoryId": "cat_food",
      "date": "2026-10-28",
      "note": "",
      "createdAt": "2026-10-28T12:00:00.000Z",
      "updatedAt": "2026-10-28T12:00:00.000Z"
    }
  ],
  "savingsGoals": [
    {
      "id": "goal_...",
      "name": "Emergency savings",
      "targetAmount": 20000,
      "targetDate": "2027-02-01",
      "deposits": [
        { "id": "deposit_...", "amount": 1000, "date": "2026-10-28" }
      ]
    }
  ]
}
```

This is an illustrative schema. IDs and dates in actual records must be
generated from real user actions, not copied from this example.

### Data rules

-   Use category IDs in expenses rather than category names. If a
    category is renamed, existing expenses still reference it.
-   The budget object may be `null` before setup.
-   Store dates as `YYYY-MM-DD` strings.
-   Store amounts as numbers.
-   Store savings deposits as separate records so history can be shown.
-   Keep simulator basket in page memory only until Apply is confirmed;
    it is not an actual expense.
-   Consider a schema version so future imports can be validated.
-   Handle malformed or missing localStorage data gracefully by showing
    an error and offering safe recovery. Do not silently wipe data.

### Storage service responsibilities

The storage module should provide functions such as: - `loadState()` -
`saveState(state)` - `resetState()` - `exportState()` -
`validateImportedState(data)`

### Data service responsibilities

Use small, testable functions for: -
`getTotalSpent(expenses, startDate, endDate)` -
`getSpentByCategory(expenses, categoryId, startDate, endDate)` -
`getRemainingBudget(budget, expenses)` - `getBudgetStatus(...)` -
`getSavingsProgress(goal)` - `getAnalysisSummary(...)`

Avoid duplicate formulas across pages. A calculation used in more than
one place belongs in one shared function.

------------------------------------------------------------------------

## 8. Business Rules --- Single Source of Truth

Use these rules consistently across all pages.

1.  An expense is an actual transaction; a simulator item is
    hypothetical until applied.
2.  Amounts are stored as numeric values and must be finite.
3.  Expenses require a valid category and date.
4.  The MVP allows one active budget at a time.
5.  Expenses counted in budget totals must belong to the active budget
    period.
6.  Category allocation total cannot exceed the planned budget.
7.  Savings target is a reserved portion of the planned budget for MVP
    calculations.
8.  `spendableBudget = max(plannedAmount - savingsTarget, 0)`.
9.  `remainingSpendableBudget = spendableBudget - totalSpent`.
10. `remainingOverallBudget = plannedAmount - totalSpent`.
11. Simulator category checks compare actual category spending plus
    proposed category spending against that category's limit.
12. A negative remaining value is allowed as a calculated warning value,
    but never as a valid expense amount.
13. Empty lists show empty states, not errors or broken charts.
14. Delete, reset, import, and Apply This Decision actions require clear
    confirmation where data may change.
15. If the budget or savings goal is absent, pages must explain what
    setup is required.
16. Every page reads the same persisted state; do not maintain separate
    independent copies of the budget.
17. Currency formatting is display-only and does not change stored
    amounts.
18. Import data is validated before it replaces saved data.

### Budget status thresholds

Recommended MVP labels: - **On track:** spending is below 80% of the
spendable budget. - **Watch:** spending is 80% to 100% of the spendable
budget. - **Over budget:** spending is greater than the spendable
budget.

When spendable budget is zero, avoid dividing by zero; show an
explanatory message.

------------------------------------------------------------------------

## 9. Recommended Folder and File Structure

``` text
smartbudget/
├── index.html
├── README.md
├── .gitignore
├── css/
│   ├── reset.css
│   ├── variables.css
│   ├── layout.css
│   ├── components.css
│   ├── pages.css
│   └── responsive.css
├── js/
│   ├── app.js
│   ├── components/
│   │   ├── sidebar.js
│   │   ├── header.js
│   │   └── notifications.js
│   ├── services/
│   │   ├── storage.js
│   │   ├── budget-service.js
│   │   ├── expense-service.js
│   │   ├── savings-service.js
│   │   └── analysis-service.js
│   ├── utils/
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   ├── dates.js
│   │   └── ids.js
│   └── pages/
│       ├── dashboard.js
│       ├── budget.js
│       ├── expenses.js
│       ├── simulator.js
│       ├── savings.js
│       ├── analysis.js
│       └── settings.js
├── pages/
│   ├── budget.html
│   ├── expenses.html
│   ├── simulator.html
│   ├── savings.html
│   ├── analysis.html
│   └── settings.html
├── assets/
│   ├── icons/
│   └── images/
└── docs/
    ├── Project_Proposal.docx
    ├── SmartBudget_Project_Blueprint.md
    ├── test-plan.md
    └── meeting-notes.md
```

### File responsibilities

-   `app.js`: shared startup, load state, render shared layout,
    initialize the current page module.
-   `components/sidebar.js`: render sidebar links and active navigation
    state.
-   `components/header.js`: shared page header and optional theme
    control.
-   `components/notifications.js`: consistent success, warning, and
    error messages.
-   `services/storage.js`: localStorage load/save, import validation,
    export, reset.
-   `services/*-service.js`: reusable data operations and calculations.
-   `utils/*`: formatting, validation, date calculations, unique IDs.
-   `js/pages/*.js`: DOM behavior for one page only.
-   `css/variables.css`: colors, spacing, typography, theme variables.
-   `css/layout.css`: sidebar and main content structure.
-   `css/components.css`: cards, buttons, inputs, tables, badges,
    progress bars, dialogs.
-   `css/pages.css`: page-specific styling.
-   `css/responsive.css`: tablet and mobile rules.

**Beginner-friendly adjustment:** if the team finds six CSS files or
many modules overwhelming, start with `style.css` and a few JS modules,
then split files only when a file becomes difficult to manage. The
architecture should help you, not slow you down.

------------------------------------------------------------------------

## 10. Page-to-Module Startup Pattern

Each HTML page should: 1. Include the shared stylesheet(s). 2. Include a
root element for shared navigation/header. 3. Include a main content
element unique to that page. 4. Load its page script using
`<script type="module">`. 5. Use relative links that are correct from
both the root and `pages/` directories.

Because the pages are in different folders, verify every relative CSS,
JS, and navigation path. Run the project through VS Code Live Server or
another local HTTP server; ES module imports may not work reliably when
opening files directly with `file://`.

Do not duplicate business calculations in page scripts. A page script
should read state, call service functions, and render results.

------------------------------------------------------------------------

## 11. Development Roadmap

Complete one milestone, test it, and commit it before moving to the
next.

### Milestone 1 --- Repository and layout

-   Confirm folder structure.
-   Create shared CSS variables, layout, sidebar, header, and responsive
    behavior.
-   Create all HTML page shells and working navigation.
-   Test every link.
-   **Done when:** every page opens, the active navigation state works,
    and the layout is usable on desktop and mobile.

### Milestone 2 --- State and storage

-   Define the canonical data schema.
-   Implement `loadState`, `saveState`, default state, and error
    handling.
-   Add stable ID and formatting utilities.
-   Add a small manual test for save/reload persistence.
-   **Done when:** state survives page navigation and reload without
    creating duplicates.

### Milestone 3 --- Budget Planner

-   Build budget form and category allocation editor.
-   Add validation and save behavior.
-   **Done when:** valid budgets persist and invalid budgets show clear
    errors.

### Milestone 4 --- Expense Manager

-   Implement add, edit, delete, search, filter, and sort.
-   Connect expenses to category IDs and budget dates.
-   **Done when:** CRUD operations persist and filters do not alter
    saved records.

### Milestone 5 --- Dashboard

-   Implement shared calculations and summary cards.
-   Show recent expenses, budget status, and daily allowance.
-   **Done when:** dashboard values match manually calculated test
    examples.

### Milestone 6 --- Savings Goals

-   Implement goal form, deposits, history, progress, and required pace.
-   **Done when:** deposits update progress correctly and edge cases are
    handled.

### Milestone 7 --- Simulator

-   Implement hypothetical basket and verdict rules.
-   Implement confirmation and atomic Apply action.
-   **Done when:** testing a scenario changes no actual data; confirmed
    Apply creates all valid expenses; cancel creates none.

### Milestone 8 --- Spending Analysis

-   Implement date filters, category totals, metrics, and SVG donut
    chart.
-   **Done when:** chart totals and text totals agree for empty,
    single-category, and multi-category data.

### Milestone 9 --- Settings and data protection

-   Implement export/import, demo data, reset, and theme if time
    permits.
-   **Done when:** valid import works, invalid import preserves old
    data, and destructive actions require confirmation.

### Milestone 10 --- Integration and submission

-   Test all pages on desktop/mobile.
-   Fix navigation and relative-path issues.
-   Test empty state, validation, and browser reload.
-   Review accessibility, README, screenshots, and final demo sequence.
-   Commit and push the final tested version.

------------------------------------------------------------------------

## 12. Team Collaboration Plan

Assign ownership by feature, but agree on the data schema and CSS
conventions before parallel implementation.

### Suggested split

**Lakesh** - Shared application structure and sidebar/header
integration. - Data model and storage service. - Budget Planner and
Dashboard calculations. - Final integration and release checks.

**Deepa** - Expense Manager interface and CRUD interactions. - Savings
Goals page. - Spending Analysis chart and metrics. - Responsive and
visual QA for these pages.

**Shared** - Simulator logic and verdict rules. -
Settings/import/export. - Test cases, code review, documentation, and
final presentation.

Rebalance this split if one person has more time or a module proves
larger than expected. Do not let both people independently invent
different data structures.

### Git workflow

1.  Keep `main` in a working state.
2.  Before starting, pull the latest changes.
3.  Use a feature branch for substantial work,
    e.g. `feature/expenses-page`.
4.  Commit one meaningful unit at a time.
5.  Push the branch and open a pull request, or coordinate a review
    before merging.
6.  Avoid editing the same file simultaneously.
7.  Test after merging.
8.  Never commit secrets, personal financial data, or temporary files.

Suggested commit messages: - `docs: add SmartBudget project blueprint` -
`feat: create shared sidebar layout` - `feat: add budget planner form` -
`feat: implement expense CRUD` - `fix: validate expense dates` -
`test: add budget calculation cases`

------------------------------------------------------------------------

## 13. Testing Plan

### 13.1 Functional test cases

  -----------------------------------------------------------------------
  ID                      Test                    Expected result
  ----------------------- ----------------------- -----------------------
  T01                     Open app with no saved  Setup/empty state
                          data                    appears; no crash

  T02                     Save a valid budget     Budget persists after
                                                  reload

  T03                     Save budget with amount Validation error;
                          zero                    budget not saved

  T04                     End date earlier than   Validation error
                          start date              

  T05                     Category allocations    Clear warning; save
                          exceed budget           blocked

  T06                     Add valid expense       Expense appears and
                                                  totals update

  T07                     Add expense with        Rejected
                          negative amount         

  T08                     Add expense with no     Rejected
                          category                

  T09                     Edit an expense         Existing record
                                                  updates; no duplicate

  T10                     Cancel expense deletion Record remains

  T11                     Confirm expense         Record is removed and
                          deletion                totals update

  T12                     Search/filter/sort      Only displayed results
                          expenses                change

  T13                     Reload browser          Saved budget and
                                                  expenses remain

  T14                     Test hypothetical       Actual expense data
                          purchase                remains unchanged

  T15                     Cancel simulator Apply  No actual expenses are
                          confirmation            added

  T16                     Confirm valid simulator All basket items are
                          basket                  saved as expenses

  T17                     One invalid simulator   Nothing is partially
                          item                    applied

  T18                     Add savings deposit     Goal progress and
                                                  remaining amount update

  T19                     Analyze no expenses     Empty state; chart does
                                                  not break

  T20                     Analyze multiple        Chart and category
                          categories              totals agree

  T21                     Import invalid JSON     Error shown; current
                                                  data preserved

  T22                     Export then import      Data can be restored
                          valid data              

  T23                     Clear data and cancel   Data remains
                          confirmation            

  T24                     Test at mobile viewport Navigation and forms
                                                  remain usable
  -----------------------------------------------------------------------

### 13.2 Manual calculation tests

Use a simple test dataset: - Planned budget: Rs. 50,000 - Savings target
reserved: Rs. 8,000 - Spendable budget: Rs. 42,000 - Expenses: Food Rs.
6,000; Transport Rs. 2,000; Education Rs. 4,000 - Total spent: Rs.
12,000 - Remaining overall budget: Rs. 38,000 - Remaining spendable
budget: Rs. 30,000

Use these values to compare the app's calculations manually. Keep the
sample data separate from real/demo user data.

### 13.3 Quality checks

-   No console errors on any page.
-   No broken relative paths.
-   No duplicated records after editing.
-   All forms have visible labels and clear validation.
-   No critical action is available only on hover.
-   No scenario is applied without confirmation.
-   Data remains after page navigation and browser reload.
-   Layout works at desktop and narrow mobile widths.

------------------------------------------------------------------------

## 14. Definition of Done

A feature is complete only when: - The interface is implemented. - Valid
and invalid inputs are tested. - Data persists correctly if it should
persist. - Empty and error states exist. - The feature works with shared
data and calculations. - It works at mobile and desktop widths. - The
browser console has no relevant errors. - Changes are committed and
pushed.

The project is ready for demonstration when all MVP modules work
together and the team can demonstrate the complete workflow:

**Create budget → add expenses → inspect dashboard → test a hypothetical
purchase → apply or cancel it → add savings deposit → review analysis →
export data.**

------------------------------------------------------------------------

## 15. Demonstration Script

1.  Open SmartBudget and explain that it stores data locally in the
    browser.
2.  Create a budget with category allocations and a savings target.
3.  Add two or three expenses.
4.  Show the dashboard totals and category spending.
5.  Search and filter the expense list.
6.  Enter a hypothetical purchase in the simulator and show the verdict.
7.  Cancel once to demonstrate that actual data is unchanged.
8.  Run the scenario again and apply it after confirmation.
9.  Open Savings Goals and add a deposit.
10. Open Spending Analysis and explain the chart.
11. Export the data to JSON.
12. Briefly show responsive layout and the GitHub repository.

------------------------------------------------------------------------

## 16. Final Implementation Checklist

Before coding: - \[ yes \] Team agrees on this blueprint and data model. -
\[ yes \] Proposal wording is updated if needed to reflect separate HTML
pages. - \[ yes \] Both team members have access to the private GitHub
repository. - \[ yes \] Shared navigation and file naming are agreed.

During coding: - \[ \] Build in milestone order. - \[ \] Test every
feature before integrating it. - \[ \] Commit and push regularly. - \[
\] Do not build optional features before MVP functionality works.

Before submission: - \[ \] All MVP modules work. - \[ \] Test plan has
been executed. - \[ \] Import/export and simulator safety rules pass. -
\[ \] Responsive layout has been checked. - \[ \] README explains how to
run the project. - \[ \] Repository contains no private data or
secrets. - \[ \] Team can explain the code and calculations during the
demonstration.

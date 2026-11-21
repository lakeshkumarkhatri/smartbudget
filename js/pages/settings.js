
const profileKey = "smartBudgetProfile";
const currencyKey = "smartBudgetCurrency";

const dataKeys = [
    "budgetCategories",
    "smartBudgetExpenses",
    "smartBudgetSavings"
];

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const currency = document.getElementById("currency");

const saveProfileBtn = document.getElementById("saveProfileBtn");
const saveCurrencyBtn = document.getElementById("saveCurrencyBtn");
const exportDataBtn = document.getElementById("exportDataBtn");
const importDataBtn = document.getElementById("importDataBtn");
const importFile = document.getElementById("importFile");
const resetDataBtn = document.getElementById("resetDataBtn");
const currentCurrency = document.getElementById("currentCurrency");

// Load saved profile
function loadProfile() {
    try {
        const profile = JSON.parse(localStorage.getItem(profileKey));

        if (profile) {
            userName.value = profile.name || "SmartBudget User";
            userEmail.value = profile.email || "";
        }
    } catch (error) {
        console.error("Unable to load profile:", error);
    }
}

// Save profile
saveProfileBtn.addEventListener("click", () => {
    const name = userName.value.trim();
    const email = userEmail.value.trim();

    if (!name) {
        alert("Please enter your full name.");
        return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const profile = { name, email };

    localStorage.setItem(profileKey, JSON.stringify(profile));

    alert("Profile saved successfully!");
});

// Currency names
const currencyNames = {
    PKR: "Pakistani Rupee (PKR)",
    USD: "US Dollar (USD)",
    EUR: "Euro (EUR)",
    GBP: "British Pound (GBP)"
};

// Load saved currency
function loadCurrency() {
    const savedCurrency = localStorage.getItem(currencyKey) || "PKR";

    currency.value = savedCurrency;
    updateCurrencyInformation();
}

// Update currency information
function updateCurrencyInformation() {
    currentCurrency.textContent =
        currencyNames[currency.value] || currency.value;
}

// Save currency
saveCurrencyBtn.addEventListener("click", () => {
    localStorage.setItem(currencyKey, currency.value);

    updateCurrencyInformation();

    alert("Currency preference saved successfully!");
});

// Export application data
exportDataBtn.addEventListener("click", () => {
    const backup = {};

    backup[profileKey] = localStorage.getItem(profileKey);
    backup[currencyKey] = localStorage.getItem(currencyKey);

    dataKeys.forEach(key => {
        backup[key] = localStorage.getItem(key);
    });

    const backupFile = new Blob(
        [JSON.stringify(backup, null, 4)],
        { type: "application/json" }
    );

    const downloadURL = URL.createObjectURL(backupFile);
    const link = document.createElement("a");

    link.href = downloadURL;
    link.download = "smartbudget-backup.json";

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(downloadURL);
});

// Open file picker
importDataBtn.addEventListener("click", () => {
    importFile.click();
});

// Validate imported application data
function validateBackup(backup) {
    if (!backup || typeof backup !== "object" || Array.isArray(backup)) {
        return false;
    }

    for (const key of dataKeys) {
        if (backup[key] !== null && backup[key] !== undefined) {
            let value = backup[key];

            if (typeof value === "string") {
                try {
                    value = JSON.parse(value);
                } catch {
                    return false;
                }
            }

            if (!Array.isArray(value)) {
                return false;
            }
        }
    }

    if (backup[profileKey] !== null && backup[profileKey] !== undefined) {
        let profile = backup[profileKey];

        if (typeof profile === "string") {
            try {
                profile = JSON.parse(profile);
            } catch {
                return false;
            }
        }

        if (
            !profile ||
            typeof profile !== "object" ||
            Array.isArray(profile)
        ) {
            return false;
        }
    }

    if (backup[currencyKey] !== null && backup[currencyKey] !== undefined) {
        const savedCurrency = backup[currencyKey];

        if (!["PKR", "USD", "EUR", "GBP"].includes(savedCurrency)) {
            return false;
        }
    }

    return true;
}

// Import backup file
importFile.addEventListener("change", async () => {
    const file = importFile.files[0];

    if (!file) return;

    try {
        const fileText = await file.text();
        const backup = JSON.parse(fileText);

        if (!validateBackup(backup)) {
            alert("Invalid backup file. Please select a valid SmartBudget backup.");
            importFile.value = "";
            return;
        }

        const confirmed = confirm(
            "Importing this backup will replace your current saved data. Continue?"
        );

        if (!confirmed) {
            importFile.value = "";
            return;
        }

        const keys = [...dataKeys, profileKey, currencyKey];

        keys.forEach(key => {
            if (Object.prototype.hasOwnProperty.call(backup, key)) {
                const value = backup[key];

                if (value === null) {
                    localStorage.removeItem(key);
                } else if (value !== undefined) {
                    localStorage.setItem(
                        key,
                        typeof value === "string"
                            ? value
                            : JSON.stringify(value)
                    );
                }
            }
        });

        alert("Data imported successfully!");

        loadProfile();
        loadCurrency();

    } catch (error) {
        console.error("Import failed:", error);
        alert("Unable to import the backup file.");
    }

    importFile.value = "";
});

// Reset application data
resetDataBtn.addEventListener("click", () => {
    const confirmed = confirm(
        "Are you sure you want to reset SmartBudget? This will permanently delete your saved profile, preferences, budgets, expenses, and savings goals."
    );

    if (!confirmed) return;

    [...dataKeys, profileKey, currencyKey].forEach(key => {
        localStorage.removeItem(key);
    });

    alert("SmartBudget data has been reset.");

    loadProfile();
    loadCurrency();
});

// Initialize settings
loadProfile();
loadCurrency();

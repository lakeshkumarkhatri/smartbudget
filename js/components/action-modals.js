
// ==========================================
// SMARTBUDGET - SHARED ACTION MODALS
// ==========================================

function createModal() {
    const overlay = document.createElement("div");
    overlay.className = "sb-modal-overlay";

    const modal = document.createElement("div");
    modal.className = "sb-modal";

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    return { overlay, modal };
}

// ==========================================
// EDIT MODAL
// ==========================================

export function showEditModal({ title, fields }) {
    return new Promise((resolve) => {
        const { overlay, modal } = createModal();

        modal.innerHTML = `
            <div class="sb-modal-header">
                <h2>${title}</h2>
                <button type="button" class="sb-modal-close" aria-label="Close">&times;</button>
            </div>

            <form class="sb-modal-form">
                <div class="sb-modal-fields"></div>

                <div class="sb-modal-actions">
                    <button type="button" class="sb-btn sb-btn-cancel">
                        Cancel
                    </button>
                    <button type="submit" class="sb-btn sb-btn-primary">
                        Save Changes
                    </button>
                </div>
            </form>
        `;

        const fieldsContainer = modal.querySelector(".sb-modal-fields");

        fields.forEach((field) => {
            const group = document.createElement("div");
            group.className = "sb-modal-field";

            const label = document.createElement("label");
            label.textContent = field.label;

            const input = document.createElement(
                field.type === "select" ? "select" : "input"
            );

            input.name = field.name;
            input.required = true;

            if (field.type === "select") {
                field.options.forEach((option) => {
                    const optionElement = document.createElement("option");
                    optionElement.value = option;
                    optionElement.textContent = option;
                    input.appendChild(optionElement);
                });
            } else {
                input.type = field.type || "text";
            }

            input.value = field.value;
            group.append(label, input);
            fieldsContainer.appendChild(group);
        });

        function close(result) {
            overlay.remove();
            resolve(result);
        }

        modal.querySelector(".sb-modal-close")
            .addEventListener("click", () => close(null));

        modal.querySelector(".sb-btn-cancel")
            .addEventListener("click", () => close(null));

        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) close(null);
        });

        modal.querySelector("form").addEventListener("submit", (event) => {
            event.preventDefault();

            const result = {};

            fields.forEach((field) => {
                result[field.name] = modal.querySelector(
                    `[name="${field.name}"]`
                ).value.trim();
            });

            close(result);
        });
    });
}

// ==========================================
// DELETE CONFIRMATION MODAL
// ==========================================

export function showDeleteModal(message) {
    return new Promise((resolve) => {
        const { overlay, modal } = createModal();

        modal.innerHTML = `
            <div class="sb-delete-icon">!</div>

            <h2>Confirm Delete</h2>

            <p class="sb-delete-message"></p>

            <div class="sb-modal-actions">
                <button type="button" class="sb-btn sb-btn-cancel">
                    Cancel
                </button>

                <button type="button" class="sb-btn sb-btn-danger">
                    Delete
                </button>
            </div>
        `;

        modal.querySelector(".sb-delete-message").textContent = message;

        function close(result) {
            overlay.remove();
            resolve(result);
        }

        modal.querySelector(".sb-btn-cancel")
            .addEventListener("click", () => close(false));

        modal.querySelector(".sb-btn-danger")
            .addEventListener("click", () => close(true));

        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) close(false);
        });
    });
}

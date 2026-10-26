const form = document.getElementById("char-form");
form.noValidate = true; // Turn off default browser tooltips while keeping constraint validation API

const takenNames = ["Arthas", "Gandalf", "Sephiroth", "Merlin"];
const nameInput = document.getElementById("char-name");
const classSelect = document.getElementById("char-class");
const strInput = document.getElementById("skill-str");
const agiInput = document.getElementById("skill-agi");
const intInput = document.getElementById("skill-int");
const bioInput = document.getElementById("char-bio");
const pointsCounter = document.getElementById("points-counter");
const errorSummary = document.getElementById("error-summary");
const resultContainer = document.getElementById("result-container");

const skillInputs = [strInput, agiInput, intInput];

function calculatePointsLeft() {
    let sum = skillInputs.reduce((total, input) => total + (Number(input.value) || 0), 0);
    let remaining = 20 - sum;
    pointsCounter.textContent = remaining;
    return remaining;
}

// Validation function checking 4 custom rules not expressible by HTML attributes
function validateField(inputField) {
    let isValid = true;
    let feedbackEl = inputField.nextElementSibling;

    if (inputField === nameInput) {
        if (inputField.value.trim().length < 3 || takenNames.includes(inputField.value.trim())) {
            isValid = false;
        }
    } else if (inputField === intInput || inputField === strInput || inputField === agiInput) {
        let remaining = calculatePointsLeft();
        if (remaining !== 0) {
            isValid = false;
        }
    } else if (inputField === classSelect) {
        if (inputField.value === "Mage" && Number(intInput.value) < 7) {
            isValid = false;
            feedbackEl.textContent = "Mage class requires at least 7 Intelligence!";
        } else {
            feedbackEl.textContent = "Please select a valid class.";
        }
    } else if (inputField === bioInput) {
        if (inputField.value.toLowerCase().includes("cheat")) {
            isValid = false;
        }
    }

    if (!isValid) {
        inputField.classList.add("is-invalid");
        inputField.setAttribute("aria-invalid", "true");
    } else {
        inputField.classList.remove("is-invalid");
        inputField.setAttribute("aria-invalid", "false");
    }

    return isValid;
}

// Attach blur and input event listeners
[nameInput, classSelect, strInput, agiInput, intInput, bioInput].forEach(field => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
        calculatePointsLeft();
        if (field.classList.contains("is-invalid")) {
            validateField(field);
        }
        updateLivePreview();
    });
});

function updateLivePreview() {
    resultContainer.innerHTML = `
        <div class="card bg-dark text-white p-3 shadow-sm">
            <h5 class="text-warning">Live Preview: ${nameInput.value || "Nameless Hero"}</h5>
            <p class="mb-1"><strong>Class:</strong> ${classSelect.value || "None"}</p>
            <p class="mb-1"><strong>Stats:</strong> STR: ${strInput.value} | AGI: ${agiInput.value} | INT: ${intInput.value}</p>
            <small class="text-light opacity-75">Bio: ${bioInput.value || "No backstory provided yet."}</small>
        </div>
    `;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    let fields = [nameInput, classSelect, strInput, agiInput, intInput, bioInput];
    let errorCount = 0;
    let firstInvalidField = null;

    fields.forEach(field => {
        let valid = validateField(field);
        if (!valid) {
            errorCount++;
            if (!firstInvalidField) firstInvalidField = field;
        }
    });

    // Custom check for total skill points sum = 20
    if (calculatePointsLeft() !== 0) {
        errorCount++;
        if (!firstInvalidField) firstInvalidField = strInput;
    }

    if (errorCount > 0) {
        errorSummary.textContent = `Submission failed: ${errorCount} error(s) found in the form. Please correct them below.`;
        errorSummary.classList.remove("d-none");
        errorSummary.focus();
        if (firstInvalidField) firstInvalidField.focus();
        return;
    }

    // Success state
    errorSummary.classList.add("d-none");
    resultContainer.innerHTML = `
        <div class="card border-success shadow p-4 bg-white">
            <h4 class="text-success fw-bold">🎉 Character Successfully Created!</h4>
            <p class="mb-1"><strong>Name:</strong> ${nameInput.value}</p>
            <p class="mb-1"><strong>Class:</strong> ${classSelect.value}</p>
            <p class="mb-1"><strong>Final Attributes:</strong> STR ${strInput.value}, AGI ${agiInput.value}, INT ${intInput.value}</p>
            <p class="text-muted small mt-2">Unique Booking ID: ${Math.random().toString(36).substring(2, 9).toUpperCase()}</p>
        </div>
    `;
    form.reset();
    calculatePointsLeft();
});

updateLivePreview(); 
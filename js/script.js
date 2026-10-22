document.addEventListener("DOMContentLoaded", () => {
  // Highlight the current section in the home-page navigation.
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("body > main section[id]");

  if (sections.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle(
            "active-link",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    }, { rootMargin: "-25% 0px -60% 0px" });

    sections.forEach((section) => observer.observe(section));
  }

  // INCOME TAX GUI DEMO
  // These are illustrative sample slabs, not official tax rules.
  const incomeInput = document.getElementById("annualIncome");
  const taxResult = document.getElementById("taxResult");
  const estimateButton = document.getElementById("estimateTax");
  const detectButton = document.getElementById("detectTax");

  function readIncome() {
    if (!incomeInput || !taxResult) return null;

    const value = Number(incomeInput.value);

    if (
      incomeInput.value.trim() === "" ||
      !Number.isFinite(value) ||
      value < 0
    ) {
      taxResult.textContent =
        "Please enter a valid non-negative annual income.";
      return null;
    }

    return value;
  }

  function sampleTax(income) {
    let tax = 0;

    if (income > 300000) {
      tax += Math.min(income - 300000, 300000) * 0.05;
    }

    if (income > 600000) {
      tax += Math.min(income - 600000, 300000) * 0.10;
    }

    if (income > 900000) {
      tax += Math.min(income - 900000, 600000) * 0.15;
    }

    if (income > 1500000) {
      tax += (income - 1500000) * 0.20;
    }

    return tax;
  }

  function formatMoney(amount) {
    return "₹" + amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2
    });
  }

  if (estimateButton) {
    estimateButton.addEventListener("click", () => {
      const income = readIncome();
      if (income === null) return;

      const tax = sampleTax(income);

      taxResult.textContent =
        "DEMO ESTIMATION RESULT\n" +
        "Annual income: " + formatMoney(income) + "\n" +
        "Illustrative estimated tax: " + formatMoney(tax) + "\n\n" +
        "This uses simplified sample slabs only.";
    });
  }

  if (detectButton) {
    detectButton.addEventListener("click", () => {
      const income = readIncome();
      if (income === null) return;

      const tax = sampleTax(income);

      const message = income > 0
        ? "Income entered successfully. Sample estimate generated for review."
        : "Zero income entered. Please verify the entered value.";

      taxResult.textContent =
        "DETECTION / REVIEW RESULT\n" +
        message + "\n" +
        "Annual income: " + formatMoney(income) + "\n" +
        "Sample tax estimate: " + formatMoney(tax) + "\n\n" +
        "This is not official tax detection or tax advice.";
    });
  }

  // SHARED HELPERS FOR CONSOLE-STYLE DEMOS
  function safeText(value) {
    return String(value ?? "").trim();
  }

  function makeInput(labelText, name, placeholder, type = "text") {
    const label = document.createElement("label");
    label.textContent = labelText;
    label.htmlFor = name;

    const input = document.createElement("input");
    input.id = name;
    input.name = name;
    input.placeholder = placeholder;
    input.type = type;

    if (type === "number") {
      input.min = "0";
      input.step = "any";
    }

    return { label, input };
  }

  // BANK SYSTEM DEMO
  const bankOutput = document.getElementById("bankOutput");
  const bankChoice = document.getElementById("bankChoice");
  const bankInputs = document.getElementById("bankInputs");
  const runBankChoice = document.getElementById("runBankChoice");
  const resetBank = document.getElementById("resetBank");

  let bankAccount = null;
  let bankExited = false;

  function bankMenu() {
    return [
      "Welcome to Python Bank System",
      "1. Add Account",
      "2. Deposit",
      "3. Withdraw",
      "4. Check Balance",
      "5. Calculate Interest",
      "6. Account Details",
      "7. Exit"
    ].join("\n");
  }

  function bankForm() {
    if (!bankInputs || !bankChoice) return;

    bankInputs.replaceChildren();
    const choice = bankChoice.value;
    const fields = [];

    if (choice === "1") {
      fields.push(
        makeInput("Account holder name", "bankName", "Enter name"),
        makeInput("Opening balance (₹)", "bankAmount", "Example: 1000", "number")
      );
    }

    if (choice === "2" || choice === "3") {
      fields.push(
        makeInput("Amount (₹)", "bankAmount", "Enter amount", "number")
      );
    }

    fields.forEach(({ label, input }) => {
      bankInputs.append(label, input);
    });
  }

  if (bankChoice) {
    bankChoice.addEventListener("change", bankForm);
    bankForm();
  }

  if (runBankChoice) {
    runBankChoice.addEventListener("click", () => {
      if (!bankOutput || !bankChoice) return;

      if (bankExited) {
        bankOutput.textContent =
          "The demo has exited. Press Restart Demo to start again.";
        return;
      }

      const choice = bankChoice.value;
      let message = "";

      if (choice === "1") {
        const name = safeText(
          document.getElementById("bankName")?.value
        );
        const amount = Number(
          document.getElementById("bankAmount")?.value
        );

        if (
          !name ||
          !Number.isFinite(amount) ||
          amount < 0 ||
          document.getElementById("bankAmount")?.value.trim() === ""
        ) {
          message = "Enter a name and a valid opening balance.";
        } else if (bankAccount) {
          message =
            "An account already exists. Restart to create a new demo account.";
        } else {
          bankAccount = {
            name: name,
            balance: amount,
            accountNumber: "DEMO1001",
            interestRate: 0.04
          };

          message =
            "Account created successfully!\n" +
            "Account holder: " + name + "\n" +
            "Demo account number: " + bankAccount.accountNumber + "\n" +
            "Opening balance: " + formatMoney(amount);
        }
      }

      else if (choice === "2" || choice === "3") {
        const amountInput = document.getElementById("bankAmount");
        const amount = Number(amountInput?.value);

        if (!bankAccount) {
          message = "No account found. Choose 1 to add an account first.";
        } else if (
          !amountInput ||
          amountInput.value.trim() === "" ||
          !Number.isFinite(amount) ||
          amount <= 0
        ) {
          message = "Enter a valid amount greater than zero.";
        } else if (choice === "2") {
          bankAccount.balance += amount;

          message =
            "Deposit successful: " + formatMoney(amount) + "\n" +
            "Current balance: " + formatMoney(bankAccount.balance);
        } else if (amount > bankAccount.balance) {
          message =
            "Insufficient balance.\nCurrent balance: " +
            formatMoney(bankAccount.balance);
        } else {
          bankAccount.balance -= amount;

          message =
            "Withdrawal successful: " + formatMoney(amount) + "\n" +
            "Current balance: " + formatMoney(bankAccount.balance);
        }
      }

      else if (choice === "4") {
        message = bankAccount
          ? "Account balance: " + formatMoney(bankAccount.balance)
          : "No account found. Choose 1 to add an account first.";
      }

      else if (choice === "5") {
        message = bankAccount
          ? "Illustrative annual interest (4%): " +
            formatMoney(bankAccount.balance * bankAccount.interestRate) +
            "\nBalance plus sample interest: " +
            formatMoney(bankAccount.balance * (1 + bankAccount.interestRate))
          : "No account found. Choose 1 to add an account first.";
      }

      else if (choice === "6") {
        message = bankAccount
          ? "ACCOUNT DETAILS\n" +
            "Holder: " + bankAccount.name + "\n" +
            "Account number: " + bankAccount.accountNumber + "\n" +
            "Balance: " + formatMoney(bankAccount.balance)
          : "No account found. Choose 1 to add an account first.";
      }

      else if (choice === "7") {
        bankExited = true;
        message = "Thank you for using Python Bank System. Demo exited.";
      }

      bankOutput.textContent =
        bankMenu() + "\n\n> Selected choice: " + choice + "\n" + message;
    });
  }

  if (resetBank) {
    resetBank.addEventListener("click", () => {
      bankAccount = null;
      bankExited = false;

      if (bankOutput) {
        bankOutput.textContent =
          bankMenu() + "\n\nDemo restarted. Select an option below.";
      }

      if (bankChoice) bankChoice.value = "1";
      bankForm();
    });
  }

  // HOSPITAL MANAGEMENT DEMO
  const hospitalOutput = document.getElementById("hospitalOutput");
  const hospitalChoice = document.getElementById("hospitalChoice");
  const hospitalInputs = document.getElementById("hospitalInputs");
  const runHospitalChoice = document.getElementById("runHospitalChoice");
  const resetHospital = document.getElementById("resetHospital");

  let patient = null;
  let hospitalExited = false;

  function hospitalMenu() {
    return [
      "Welcome to Hospital Management System",
      "1. Add Patient",
      "2. Show Patient Details",
      "3. Fees Details",
      "4. Exit"
    ].join("\n");
  }

  function hospitalForm() {
    if (!hospitalInputs || !hospitalChoice) return;

    hospitalInputs.replaceChildren();

    if (hospitalChoice.value === "1") {
      const fields = [
        makeInput("Patient name", "patientName", "Enter patient name"),
        makeInput("Patient age", "patientAge", "Enter age", "number"),
        makeInput("Patient problem", "patientProblem", "Enter problem"),
        makeInput("Consultation fee (₹)", "patientFee", "Example: 500", "number")
      ];

      fields.forEach(({ label, input }) => {
        hospitalInputs.append(label, input);
      });
    }
  }

  if (hospitalChoice) {
    hospitalChoice.addEventListener("change", hospitalForm);
    hospitalForm();
  }

  if (runHospitalChoice) {
    runHospitalChoice.addEventListener("click", () => {
      if (!hospitalOutput || !hospitalChoice) return;

      if (hospitalExited) {
        hospitalOutput.textContent =
          "The demo has exited. Press Restart Demo to start again.";
        return;
      }

      const choice = hospitalChoice.value;
      let message = "";

      if (choice === "1") {
        const name = safeText(
          document.getElementById("patientName")?.value
        );
        const ageInput = document.getElementById("patientAge");
        const age = Number(ageInput?.value);
        const problem = safeText(
          document.getElementById("patientProblem")?.value
        );
        const feeInput = document.getElementById("patientFee");
        const fee = Number(feeInput?.value);

        if (
          !name ||
          !ageInput ||
          ageInput.value.trim() === "" ||
          !Number.isFinite(age) ||
          age <= 0 ||
          !problem ||
          !feeInput ||
          feeInput.value.trim() === "" ||
          !Number.isFinite(fee) ||
          fee < 0
        ) {
          message = "Enter a name, valid age, problem and non-negative fee.";
        } else if (patient) {
          message =
            "A patient is already stored. Restart to add a new demo patient.";
        } else {
          patient = { name, age, problem, fee };

          message =
            "Patient added successfully!\n" +
            "Name: " + name + "\n" +
            "Age: " + age + "\n" +
            "Problem: " + problem + "\n" +
            "Consultation fee: " + formatMoney(fee);
        }
      }

      else if (choice === "2") {
        message = patient
          ? "PATIENT DETAILS\n" +
            "Name: " + patient.name + "\n" +
            "Age: " + patient.age + "\n" +
            "Problem: " + patient.problem
          : "No patient found. Choose 1 to add a patient first.";
      }

      else if (choice === "3") {
        message = patient
          ? "FEES DETAILS\n" +
            "Patient: " + patient.name + "\n" +
            "Consultation fee: " + formatMoney(patient.fee)
          : "No fee details found. Choose 1 to add a patient first.";
      }

      else if (choice === "4") {
        hospitalExited = true;
        message = "Thank you for using Hospital Management System. Demo exited.";
      }

      hospitalOutput.textContent =
        hospitalMenu() + "\n\n> Selected choice: " + choice + "\n" + message;
    });
  }

  if (resetHospital) {
    resetHospital.addEventListener("click", () => {
      patient = null;
      hospitalExited = false;

      if (hospitalOutput) {
        hospitalOutput.textContent =
          hospitalMenu() + "\n\nDemo restarted. Select an option below.";
      }

      if (hospitalChoice) hospitalChoice.value = "1";
      hospitalForm();
    });
  }

  // SIMPLE SOLAR SYSTEM WEBSITE DEMO
  const solarPlanets = [
    {
      name: "Mercury",
      description: "Mercury is the smallest planet and the closest planet to the Sun. Its surface is rocky and heavily cratered.",
      distance: "57.9 million km"
    },
    {
      name: "Venus",
      description: "Venus is the second planet from the Sun and the hottest planet because its thick atmosphere traps heat.",
      distance: "108.2 million km"
    },
    {
      name: "Earth",
      description: "Earth is our home planet. It has liquid water on its surface and supports a wide variety of life.",
      distance: "149.6 million km"
    },
    {
      name: "Mars",
      description: "Mars is called the Red Planet because of its reddish surface. It has two small moons.",
      distance: "227.9 million km"
    },
    {
      name: "Jupiter",
      description: "Jupiter is the largest planet in the Solar System. It is a gas giant with enormous storms.",
      distance: "778.6 million km"
    },
    {
      name: "Saturn",
      description: "Saturn is a gas giant known for its prominent ring system made mostly of ice and rocky particles.",
      distance: "1.43 billion km"
    },
    {
      name: "Uranus",
      description: "Uranus is an ice giant with a blue-green colour. It rotates on its side compared with most planets.",
      distance: "2.87 billion km"
    },
    {
      name: "Neptune",
      description: "Neptune is the farthest planet from the Sun and is known for its deep blue appearance and strong winds.",
      distance: "4.50 billion km"
    }
  ];

  const solarButtons = document.querySelectorAll("[data-solar]");
  const solarName = document.getElementById("solarName");
  const solarDescription = document.getElementById("solarDescription");
  const solarDistance = document.getElementById("solarDistance");
  const solarNumber = document.getElementById("solarNumber");
  const previousSolar = document.getElementById("previousSolar");
  const nextSolar = document.getElementById("nextSolar");

  let selectedSolar = 0;

  function showSolar(index) {
    selectedSolar = (index + solarPlanets.length) % solarPlanets.length;
    const planet = solarPlanets[selectedSolar];

    if (solarName) solarName.textContent = planet.name;
    if (solarDescription) solarDescription.textContent = planet.description;

    if (solarDistance) {
      solarDistance.textContent =
        "Average distance from the Sun: " + planet.distance;
    }

    if (solarNumber) {
      solarNumber.textContent = `PLANET ${selectedSolar + 1} OF 8`;
    }

    solarButtons.forEach((button, i) => {
      button.classList.toggle("selected-solar-planet", i === selectedSolar);
    });
  }

  solarButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showSolar(Number(button.dataset.solar));
    });
  });

  if (previousSolar) {
    previousSolar.addEventListener("click", () => {
      showSolar(selectedSolar - 1);
    });
  }

  if (nextSolar) {
    nextSolar.addEventListener("click", () => {
      showSolar(selectedSolar + 1);
    });
  }

  if (solarButtons.length) showSolar(0);
});
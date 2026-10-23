document.addEventListener("DOMContentLoaded", function () {

    // INCOME TAX DEMO
    const incomeInput = document.getElementById("annualIncome");
    const estimateButton = document.getElementById("estimateTax");
    const detectionButton = document.getElementById("taxDetection");
    const taxResult = document.getElementById("taxResult");

    function getIncome() {
        const rawValue = incomeInput.value;
        const income = Number(rawValue);

        if (rawValue.trim() === "" || !Number.isFinite(income) || income < 0) {
            taxResult.textContent = "Please enter a valid non-negative income.";
            return null;
        }

        return income;
    }

    if (detectionButton) {
        detectionButton.addEventListener("click", function () {
            const income = getIncome();

            if (income !== null) {
                taxResult.textContent =
                    "Input check complete. Annual income entered: ₹" +
                    income.toLocaleString("en-IN");
            }
        });
    }

    if (estimateButton) {
        estimateButton.addEventListener("click", function () {
            const income = getIncome();

            if (income === null) return;

            // Illustrative sample calculation only, not official tax rules.
            const estimatedTax = income * 0.05;

            taxResult.textContent =
                "Illustrative sample estimate: ₹" +
                estimatedTax.toLocaleString("en-IN") +
                ". This is not an official income tax calculation.";
        });
    }


    // STUDENT GRADE CALCULATOR
    const gradeButton = document.getElementById("calculateGrade");
    const gradeResult = document.getElementById("gradeResult");

    if (gradeButton) {
        gradeButton.addEventListener("click", function () {
            const name = document.getElementById("studentName").value.trim();

            const rawMarks = [
                document.getElementById("mark1").value,
                document.getElementById("mark2").value,
                document.getElementById("mark3").value,
                document.getElementById("mark4").value,
                document.getElementById("mark5").value
            ];

            if (name === "") {
                gradeResult.textContent = "Please enter the student name.";
                return;
            }

            const validMarks = rawMarks.every(function (mark) {
                return mark.trim() !== "" &&
                    Number.isFinite(Number(mark)) &&
                    Number(mark) >= 0 &&
                    Number(mark) <= 100;
            });

            if (!validMarks) {
                gradeResult.textContent =
                    "Enter marks between 0 and 100 for all five subjects.";
                return;
            }

            const marks = rawMarks.map(Number);
            const total = marks.reduce(function (sum, mark) {
                return sum + mark;
            }, 0);

            const average = total / marks.length;
            const passed = marks.every(function (mark) {
                return mark >= 35;
            });

            let grade;

            if (!passed) {
                grade = "F";
            } else if (average >= 90) {
                grade = "A+";
            } else if (average >= 80) {
                grade = "A";
            } else if (average >= 70) {
                grade = "B";
            } else if (average >= 60) {
                grade = "C";
            } else if (average >= 50) {
                grade = "D";
            } else {
                grade = "E";
            }

            // Use textContent to display user-entered text safely.
            gradeResult.replaceChildren();

            const heading = document.createElement("strong");
            heading.textContent = "Student Result";
            gradeResult.appendChild(heading);

            const details = document.createElement("p");
            details.textContent =
                "Name: " + name +
                " | Total: " + total + "/500" +
                " | Average: " + average.toFixed(2) + "%" +
                " | Grade: " + grade +
                " | Status: " + (passed ? "PASS" : "FAIL");

            gradeResult.appendChild(details);
        });
    }


    // RANDOM NUMBER GUESSING GAME
    const guessInput = document.getElementById("guessNumber");
    const guessButton = document.getElementById("checkGuess");
    const newGameButton = document.getElementById("newGame");
    const gameMessage = document.getElementById("gameMessage");
    const attemptDisplay = document.getElementById("attemptCount");

    let secretNumber;
    let attempts;
    let gameOver;

    function startNewGame() {
        secretNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        gameOver = false;

        if (guessInput) {
            guessInput.value = "";
            guessInput.disabled = false;
        }

        if (guessButton) {
            guessButton.disabled = false;
        }

        if (attemptDisplay) {
            attemptDisplay.textContent = "0";
        }

        if (gameMessage) {
            gameMessage.textContent = "New game started! Guess a number.";
        }
    }

    if (guessButton) {
        startNewGame();

        guessButton.addEventListener("click", function () {
            if (gameOver) return;

            const rawGuess = guessInput.value;
            const guess = Number(rawGuess);

            if (rawGuess.trim() === "" ||
                !Number.isInteger(guess) ||
                guess < 1 || guess > 100) {
                gameMessage.textContent =
                    "Enter a whole number between 1 and 100.";
                return;
            }

            attempts++;
            attemptDisplay.textContent = String(attempts);

            if (guess < secretNumber) {
                gameMessage.textContent = "Too low! Try a higher number.";
            } else if (guess > secretNumber) {
                gameMessage.textContent = "Too high! Try a lower number.";
            } else {
                gameMessage.textContent =
                    "Correct! You won in " + attempts + " attempts.";

                gameOver = true;
                guessInput.disabled = true;
                guessButton.disabled = true;
            }

            guessInput.value = "";
        });
    }

    if (newGameButton) {
        newGameButton.addEventListener("click", startNewGame);
    }

});
const navLinks = document.querySelectorAll(".navbar nav a");

const sections = document.querySelectorAll(
    "#home, #about, #skills, #projects, #contact"
);

function updateActiveNav() {
    let currentSection = "home";

    sections.forEach((section) => {
        if (section.getBoundingClientRect().top <= 180) {
            currentSection = section.id;
        }
    });

    navLinks.forEach((link) => {
        const href = link.getAttribute("href");
        link.classList.remove("active");

        if (
            href === `#${currentSection}` ||
            (currentSection === "home" && href === "index.html") ||
            (currentSection === "projects" && href === "project.html")
        ) {
            link.classList.add("active");
        }
    });
}

window.addEventListener("scroll", updateActiveNav);
window.addEventListener("load", updateActiveNav);
/* DARK MODE TOGGLE */
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("portfolioTheme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
}

function updateThemeButton() {
    if (!themeToggle) return;

    const isDark = document.body.classList.contains("dark-mode");

    themeToggle.textContent = isDark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";

    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );
}

if (themeToggle) {
    updateThemeButton();

    themeToggle.addEventListener("click", function () {
        document.body.classList.toggle("dark-mode");

        const isDark = document.body.classList.contains("dark-mode");

        localStorage.setItem(
            "portfolioTheme",
            isDark ? "dark" : "light"
        );

        updateThemeButton();
    });
}
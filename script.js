
const display = document.querySelector("#display");
const buttons = document.querySelectorAll(".btn");

let currentInput = "0";
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

const updateDisplay = () => {
    display.value = currentInput;
};

const inputDigit = (digit) => {

    if (waitingForSecondOperand || currentInput === "Error") {
        currentInput = digit;
        waitingForSecondOperand = false;
    }

    else if (currentInput === "0") {
        currentInput = digit;
    }

    else {
        currentInput += digit;
    }

    updateDisplay();
};

const inputDecimal = () => {

    if (currentInput === "Error") {
        currentInput = "0";
    }

    if (waitingForSecondOperand) {
        currentInput = "0.";
        waitingForSecondOperand = false;
    }

    else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
};

const chooseOperator = (nextOperator) => {

    if (currentInput === "Error") return;

    const inputValue = parseFloat(currentInput);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    }

    else if (operator) {

        const result = calculate(
            firstOperand,
            inputValue,
            operator
        );

        if (result === null || !Number.isFinite(result)) {
            showError();
            return;
        }

        firstOperand = result;
        currentInput = formatResult(result);

        updateDisplay();
    }

    operator = nextOperator;
    waitingForSecondOperand = true;
};

const calculate = (first, second, operator) => {

    switch (operator) {

        case "+":
            return first + second;

        case "-":
            return first - second;

        case "*":
            return first * second;

        case "/":
            return second === 0 ? null : first / second;

        default:
            return second;
    }
};

const formatResult = (number) => {

    if (!Number.isFinite(number)) {
        return "Error";
    }

    return String(Number(number.toFixed(10)));
};

const performCalculation = () => {

    if (
        operator === null ||
        waitingForSecondOperand ||
        currentInput === "Error"
    ) {
        return;
    }

    const secondOperand = parseFloat(currentInput);

    const result = calculate(
        firstOperand,
        secondOperand,
        operator
    );

    if (result === null || !Number.isFinite(result)) {
        showError();
        return;
    }

    currentInput = formatResult(result);

    updateDisplay();

    firstOperand = null;
    operator = null;
    waitingForSecondOperand = true;
};

const clearCalculator = () => {

    currentInput = "0";
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;

    updateDisplay();
};

const deleteLastDigit = () => {

    if (currentInput === "Error") {
        clearCalculator();
        return;
    }

    if (waitingForSecondOperand) {
        currentInput = "0";
        waitingForSecondOperand = false;
    }

    else if (currentInput.length > 1) {

        currentInput = currentInput.slice(0, -1);

        if (currentInput === "-") {
            currentInput = "0";
        }
    }

    else {
        currentInput = "0";
    }

    updateDisplay();
};

const calculatePercentage = () => {

    if (currentInput === "Error") return;

    const value = parseFloat(currentInput);

    currentInput = formatResult(value / 100);

    waitingForSecondOperand = false;

    updateDisplay();
};

const showError = () => {

    currentInput = "Error";

    firstOperand = null;
    operator = null;
    waitingForSecondOperand = true;

    updateDisplay();
};

buttons.forEach((button) => {

    button.addEventListener("click", () => {

        const value = button.dataset.value;
        const action = button.dataset.action;

        switch (action) {

            case "clear":
                clearCalculator();
                break;

            case "delete":
                deleteLastDigit();
                break;

            case "decimal":
                inputDecimal();
                break;

            case "percent":
                calculatePercentage();
                break;

            case "equals":
                performCalculation();
                break;
        }

        if (value !== undefined) {

            if (/^\d$/.test(value)) {
                inputDigit(value);
            }

            else {
                chooseOperator(value);
            }
        }
    });
});

updateDisplay();

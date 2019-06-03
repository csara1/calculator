function add(a, b) {
    return a+b;
}

function subtract(a, b) {
    return a-b;
}

function multiply(a, b) {
    return a*b;
}

function divide(a, b) {
    return a/b;
}

function operate(operator, a, b) {
    switch(operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
    }
}

function splitInThousands(integer) {
    let string = "" + integer%10,
        digits = 1;
    integer /= 10;
    integer = Math.floor(integer);
    while(integer > 0) {
        if(digits%3 == 0) {
            string  = ',' + string;
        }
        digits++;
        string = integer%10 + string;
        integer /= 10;
        integer = Math.floor(integer);
    }
    return string;
}

function display(number) {
    const absValue = Math.abs(number);
    if(absValue >= 1000 && absValue < 1e21) {
        number = (number<0) ? '-'+splitInThousands(absValue)
                            : splitInThousands(absValue);
    }
    document.getElementById('display').value = number;
}

function digitClicked(event) {
    operatorSelected = false;
    result = null;
    operand *= 10;
    operand += parseInt(event.srcElement.innerText);
    display(operand);
    if(operand > 1e14) {
        numberButtons.forEach(button => {
            button.removeEventListener('click', digitClicked);
            button.classList.add('disabled');
        });
    }
}

function precedence(operator) {
    switch (operator) {
        case '+':
        case '-':
            return 0;
        case '*':
        case '/':
            return 1;
    }
}

function operatorClicked(event) {
    if(!operatorSelected) {
        numberButtons.forEach(button => {
            button.addEventListener('click', digitClicked);
            button.classList.remove('disabled');
        });
        if(result != null) {
            stackPush(operandStack, result);
            result = null;
        } else {
            stackPush(operandStack, operand);
            operand = 0;
        }
    } else {
        stackPop(operatorStack);
    }
    let currentOperator = event.srcElement.innerText;
    if(!stackEmpty(operatorStack) && precedence(currentOperator) <= precedence(stackTop(operatorStack))) {
        let result;
        do {
            let rightOperand = stackPop(operandStack),
                lastOperator = stackPop(operatorStack),
                leftOperand = stackPop(operandStack);
            result = operate(lastOperator, leftOperand, rightOperand);
            stackPush(operandStack, result);
        } while (!stackEmpty(operatorStack));
        display(result);
    }
    stackPush(operatorStack, currentOperator);
    operatorSelected = true;
}

function equalsClicked() {
    if(result != null) {
        return;
    }
    if(!operatorSelected) {
        numberButtons.forEach(button => {
            button.addEventListener('click', digitClicked);
            button.classList.remove('disabled');
        });
        stackPush(operandStack, operand);
        operand = 0;
    } else {
        stackPop(operatorStack);
    }
    while(!stackEmpty(operatorStack)) {
        let rightOperand = stackPop(operandStack),
            operator = stackPop(operatorStack),
            leftOperand = stackPop(operandStack);
        stackPush(operandStack, operate(operator, leftOperand, rightOperand));
    }
    result = stackPop(operandStack);
    display(result);
}

function stackCreate () {
    return new Array(0);
}

function stackPush(stack, element) {
    stack.push(element);
}

function stackEmpty(stack) {
    return stack.length == 0;
}

function stackTop(stack) {
    return stack.slice(-1)[0];
}

function stackPop(stack) {
    return stack.pop();
}

const numberButtons = Array.from(document.getElementsByClassName('number')),
      operatorButtons = Array.from(document.getElementsByClassName('operator')),
      operandStack = stackCreate(),
      operatorStack = stackCreate();
let operand = 0,
    operatorSelected = false,
    result = null;

display(0);
numberButtons.forEach(button => button.addEventListener('click', digitClicked));
operatorButtons.forEach(button => button.addEventListener('click', operatorClicked));
document.getElementById('equals').addEventListener('click', equalsClicked);

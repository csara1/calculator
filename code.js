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
    const parts = number.split('.'),
          intPart = parts[0].length > 0 ? Math.abs(parseInt(parts[0]))
                                        : 0;
          sign = number[0] == '-' ? '-'
                                  : '';
    let string = sign + (intPart >= 1000 && intPart < 1e21 ? splitInThousands(intPart)
                                                           : intPart);
    if(parts.length == 2 && parts[1].length > 0) {
        string += '.' + parts[1];
    }
    document.getElementById('display').value = string;
    return string;
}

function digitClicked(event) {
    operatorSelected = false;
    result = null;
    const element = event.srcElement;
    if(element.id == 'dot') {
        element.removeEventListener('click', digitClicked);
        element.classList.add('disabled');
        decimalEntered = true;
        operand += '.';
    } else {
        operand += event.srcElement.innerText;
    }
    if(display(operand).length >= 17) {
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
            stackPush(operandStack, parseFloat(operand));
            operand = '0';
        }
        decimalEntered = false;
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
        display(result + '');
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
        stackPush(operandStack, parseFloat(operand));
        operand = '0';
        decimalEntered = false;
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
    display(result + '');
}

function initialize() {
    decimalEntered = false;
    operand = '0';
    operatorSelected = false;
    operandStack = stackCreate();
    operatorStack = stackCreate();
    result = null;
    display('0');
    numberButtons.forEach(button => {
        button.addEventListener('click', digitClicked);
        button.classList.remove('disabled');
    });
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

function main() {
    const operatorButtons = Array.from(document.getElementsByClassName('operator'));

    initialize();
    operatorButtons.forEach(button => button.addEventListener('click', operatorClicked));
    document.getElementById('equals').addEventListener('click', equalsClicked);
    document.getElementById('clear').addEventListener('click', initialize);
}

const numberButtons = Array.from(document.getElementsByClassName('number'));
let decimalEntered,
    operand,
    operatorSelected,
    operandStack,
    operatorStack,
    result;
main();

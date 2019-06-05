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
    if(operatorSelected) {
        const lastOperator = stackTop(operatorStack),
              lastButton = getButtonBySymbol(lastOperator);
        lastButton.classList.remove('pressed');
        operatorSelected = false;
    }
    result = null;
    const element = event.srcElement;
    if(operand == '0' && element.id == 'zero') {
        return;
    }
    if(element.id == 'dot') {
        element.removeEventListener('click', digitClicked);
        element.classList.add('disabled');
        decimalEntered = true;
    }
    operand += element.innerText;
    backspaceButton.addEventListener('click', backspaceClicked);
    backspaceButton.classList.remove('disabled');
    backspaceEnabled = true;
    if(display(operand).length >= 17) {
        numberButtons.forEach(button => {
            button.removeEventListener('click', digitClicked);
            button.classList.add('disabled');
        });
        numbersEnabled = false;
    }
}

function backspaceClicked() {
    if(display(operand).length >= 17) {
        enableNumbers();
    }
    if(operand.slice(-1) == '.') {
        const decimalButton = document.getElementById('dot');
        decimalButton.addEventListener('click', digitClicked);
        decimalButton.classList.remove('disabled');
    }
    operand = operand.slice(0, -1);
    if(operand == '0') {
        disableBackspace();
    }
    display(operand);
}

function disableBackspace() {
    backspaceButton.removeEventListener('click', backspaceClicked);
    backspaceButton.classList.add('disabled');
    backspaceEnabled = false;
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

function getButtonBySymbol(symbol) {
    switch(symbol) {
        case '+':
            return document.getElementById('add');
        case '-':
            return document.getElementById('sub');
        case '*':
            return document.getElementById('mul');
        case '/':
            return document.getElementById('div');
    }
}

function deselectOperator(operator) {
    getButtonBySymbol(operator).classList.remove('pressed');
}

function operatorClicked(event) {
    if(operatorSelected) {
        deselectOperator(stackPop(operatorStack));
    } else {
        enableNumbers();
        if(result != null) {
            stackPush(operandStack, result);
            result = null;
        } else {
            stackPush(operandStack, parseFloat(operand));
            disableBackspace();
            operand = '0';
        }
        decimalEntered = false;
        operatorSelected = true;
    }
    const currentOperator = event.srcElement.innerText;
    if(!stackEmpty(operatorStack) && precedence(currentOperator) <= precedence(stackTop(operatorStack))) {
        let partialResult;
        do {
            let rightOperand = stackPop(operandStack),
                lastOperator = stackPop(operatorStack),
                leftOperand = stackPop(operandStack);
            partialResult = operate(lastOperator, leftOperand, rightOperand);
            stackPush(operandStack, partialResult);
        } while (!stackEmpty(operatorStack) && precedence(currentOperator) <= precedence(stackTop(operatorStack)));
        display(partialResult + '');
    }
    stackPush(operatorStack, currentOperator);
    getButtonBySymbol(currentOperator).classList.add('pressed');
}

function equalsClicked() {
    if(result != null) {
        return;
    }
    if(operatorSelected) {
        deselectOperator(stackPop(operatorStack));
        operatorSelected = false;
    } else {
        enableNumbers();
        disableBackspace();
        stackPush(operandStack, parseFloat(operand));
        operand = '0';
        decimalEntered = false;
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

function enableNumbers() {
    numberButtons.forEach(button => {
        button.addEventListener('click', digitClicked);
        button.classList.remove('disabled');
    });
    numbersEnabled = true;
}

function initialize() {
    decimalEntered = false;
    operand = '0';
    if(operatorSelected) {
        deselectOperator(stackPop(operatorStack));
        operatorSelected = false;
    }
    operandStack = stackCreate();
    operatorStack = stackCreate();
    result = null;
    display('0');
    enableNumbers();
    disableBackspace();
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

function keyPressed(event) {
    switch(event.key) {
        case 'Escape':
            initialize();
            break;
        case 'Backspace':
            if(backspaceEnabled) {
                backspaceClicked();
            }
            break;
        case 'Enter':
        case '=':
            equalsClicked();
            break;
        default:
            return;
    }
    event.preventDefault();
}

function main() {
    const operatorButtons = Array.from(document.getElementsByClassName('operator'));

    initialize();
    operatorButtons.forEach(button => button.addEventListener('click', operatorClicked));
    document.getElementById('equals').addEventListener('click', equalsClicked);
    document.getElementById('clear').addEventListener('click', initialize);
    document.addEventListener('keydown', keyPressed);
}

const backspaceButton = Array.from(document.getElementsByClassName('backspace'))[0],
      numberButtons = Array.from(document.getElementsByClassName('number'));
let backspaceEnabled,
    decimalEntered,
    numbersEnabled,
    operand,
    operatorSelected,
    operandStack,
    operatorStack,
    result;
main();

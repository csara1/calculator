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

function display(integer) {
    let string = "" + integer%10,
        digits = 1;
    integer /= 10;
    integer = Math.floor(integer);
    while(integer > 1) {
        if(digits%3 == 0) {
            string  = ',' + string;
        }
        digits++;
        string = integer%10 + string;
        integer /= 10;
        integer = Math.floor(integer);
    }
    document.getElementById('display').value = string;
}

function digit(event) {
    operatorSelected = false;
    displayValue *= 10;
    displayValue += parseInt(event.srcElement.innerText);
    display(displayValue);
    if(displayValue > 1e14) {
        numberButtons.forEach(button => {
            button.removeEventListener('click', digit);
            button.classList.add('disabled');
        });
    }
}

function operator(event) {
    if(!operatorSelected) {
        numberButtons.forEach(button => {
            button.addEventListener('click', digit);
            button.classList.remove('disabled');
        });
        operatorSelected = true;
        // use operand
    } else {
        // override last operator
    }
    let currentOperator = event.srcElement.innerText;
    // use operator
}

function stack_create () {
    return new Array(0);
}

function stack_push(stack, element) {
    stack.push(element);
}

function stack_empty(stack) {
    return stack.length == 0;
}

function stack_top(stack) {
    return stack.slice(-1)[0];
}

function stack_pop(stack) {
    return stack.pop();
}

let numberButtons = Array.from(document.getElementsByClassName('number')),
    operatorButtons = Array.from(document.getElementsByClassName('operator')),
    displayValue = 0,
    operatorSelected = false
    operandStack = stack_create(),
    operatorStack = stack_create();
display(0);
numberButtons.forEach(button => button.addEventListener('click', digit));
operatorButtons.forEach(button => button.addEventListener('click', operator));

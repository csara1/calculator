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
    displayValue *= 10;
    displayValue += parseInt(event.srcElement.innerText);
    display(displayValue);
    if(displayValue > 1e14) {
        numberButtons.forEach(button => {
            button.removeEventListener('click', digit);
            button.style.backgroundColor = "gray";
        });
    }
}

let numberButtons = Array.from(document.getElementsByClassName('number')),
    displayValue = 0;
display(0);
numberButtons.forEach(button => button.addEventListener('click', digit));

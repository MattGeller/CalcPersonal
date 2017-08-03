///////////////////////////////////////////////////////
///"With great OOPower comes great OOPesponsibility"///
///////////////////////////////////////////////////////

$(document).ready(applyClickHandlers);

function applyClickHandlers() {
    $(".number").click(inputNumbers);
    $(".operator").click(inputOperator);
}

function inputNumbers() {
    //console.log('input numbers was called');
    var num = $(this).text();
    console.log(num + ' was pressed');
}

function inputOperator() {
    var operator = $(this).attr('id');
    console.log(operator + ' was pressed');
}


function Calculator() {
    var self = this;

    this.Operand1 = new Operand();
    this.Operand2 = new Operand();
    this.operator = null;

    this.View = new View();



    this.doMathAndResult = function() {
        var result = this.doMath();
        console.log("Result of the math is " + result);
        this.View.setResult(result);
        // this.View.setResult(this.doMath());
    };

    this.doMath = function () {
        switch (this.operator) {
            case '+':
            case 'add':
                return this.Operand1.getValue() + this.Operand2.getValue();
            case '-':
            case 'subtract':
                return this.Operand1.getValue() - this.Operand2.getValue();
            case '*':
            case 'x':
            case 'X':
            case 'multiply':
                return this.Operand1.getValue() * this.Operand2.getValue();
            case 'divide':
            case '/':
                return this.Operand1.getValue() / this.Operand2.getValue();
            default:
                return "I don't know what you mean";
        }
    };

    this.calculate = function () {
        this.doMathAndResult();
        this.prepareForMoreMath();
    };

    this.prepareForMoreMath = function () {
        this.Operand1.copyToOtherOperand(this.Operand2);
    };

    this.backToBaseline = function () {
        this.Operand1.refresh();
        this.Operand2.refresh();
        this.operator = null;
    };

    this.backToHalfBaseline = function () {
        this.Operand2.refresh();
    };

    // this.view = function View() {
    //     this.resultNum = null;
    // };
}

var Calculator = new Calculator();

function View() {

    // this.dummyOperand = new Operand();

    this.result = null;

    this.setResult = function (result) {
        this.result = result;
    };

    this.display = function () {
        $('.display').text(this.result);
    };
}

function Operand() {
    this.value = 0;

    this.isDecimal = false;
    this.decimalCounter = 0;

    this.copyToOtherOperand = function(targetOperand){
        // var fieldsToCopy = ['value','isDecimal','decimalCounter'];
        // for(var i=0; i<fieldsToCopy.length; i++){
        //     targetOperand[fieldsToCopy[i]] = this[fieldsToCopy[i]];
        // }

        targetOperand.value = this.value;
        targetOperand.isDecimal = this.isDecimal;
        targetOperand.decimalCounter = this.decimalCounter;

    };
    this.add_digit = function (new_digit) {
        if (!this.isDecimal) {
            this.value *= 10;
            this.value += new_digit;
        } else {
            this.value += new_digit * Math.pow(10, -1 * ++this.decimalCounter)
        }
        console.log("Current value is ", this.value);
    };

    this.refresh = function () {
        this.value = 0;
        this.isDecimal = false;
        this.decimalCounter = 0;
    };

    this.getValue = function () {
        return this.value;
    };

    this.setValue = function (num) {
        this.value = num;
    };
}


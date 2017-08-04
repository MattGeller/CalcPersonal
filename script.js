///////////////////////////////////////////////////////
///"With great OOPower comes great OOPesponsibility"///
///////////////////////////////////////////////////////

$(document).ready(applyClickHandlers);

function applyClickHandlers() {
    $(".number").click(inputNumbers);
    $(".operator").click(inputOperator);
    $("#equals").click(equalsButtonClick);
    $("#clear").click(clearButtonClick);
    $("#decimal").click(decimalButtonClick);
}

function inputNumbers() {
    //console.log('input numbers was called');
    var num = $(this).text();
    // console.log(num + ' was pressed');
    The_Calculator.numIn(parseInt(num));
}

function decimalButtonClick() {
    The_Calculator.decIn();
}

function inputOperator() {
    var operator = $(this).attr('id');
    // console.log(operator + ' was pressed');
    The_Calculator.opIn(operator);
}

function equalsButtonClick() {
    The_Calculator.calculate();
}

function clearButtonClick() {
    The_Calculator.backToBaseline();
    console.log("Operand1 reset to " + The_Calculator.Operand1.getValue());
    console.log("Operand2 reset to " + The_Calculator.Operand2.getValue());
    console.log("Operator reset to " + The_Calculator.operator);
}

function Calculator() {
    var self = this;

    this.Operand1 = new Operand();
    this.Operand2 = new Operand();
    this.operator = null;

    this.The_View = new View();

    this.numIn = function (num) {
        // if (self.Operand1.getValue() === null) {
        if (self.operator === null) {
            self.Operand1.add_digit(num);
            console.log("Operand1 is now " + self.Operand1.getValue());
            self.The_View.displaySomething(self.Operand1.getValue());
        }

        else {
            self.Operand2.add_digit(num);
            console.log("Operand2 is now " + self.Operand2.getValue());
            self.The_View.displaySomething(self.Operand2.getValue());
        }
    };

    this.decIn = function () {
        // if (self.Operand1.getValue() === null) {
        if (self.operator === null && !self.Operand1.isDecimal) {
            self.Operand1.isDecimal = true;
            console.log("Operand1 is now " + self.Operand1.getValue());
            self.The_View.displaySomething(self.Operand1.getValue() + '.');
        }

        else if (!self.Operand2.isDecimal) {
            self.Operand2.isDecimal = true;
            console.log("Operand2 is now " + self.Operand2.getValue());
            self.The_View.displaySomething(self.Operand1.getValue() + '.');
        }
    };

    this.opIn = function (op) {
        self.operator = op;
        console.log("operator is now " + self.operator);

    };

    this.doMathAndResult = function () {
        var result = this.doMath();
        console.log("Result of the math is " + result);
        this.The_View.setResult(result);
        this.The_View.displayResult();
        // this.The_View.setResult(this.doMath());
    };

    this.doMath = function (argNum1, argNum2) {

        if (arguments.length === 0) {
            var num1 = this.Operand1.getValue();
            var num2 = this.Operand2.getValue();
        }

        switch (this.operator) {
            case '+':
            case 'add':
                return num1 + num2;
            case '-':
            case 'subtract':
                return num1 - num2;
            case '*':
            case 'x':
            case 'X':
            case 'multiply':
                return num1 * num2;
            case 'divide':
            case '/':
                return num1 / num2;
            default:
                return "I don't know what you mean";
        }
    };


    //Original version
    // this.calculate = function () {
    //     this.doMathAndResult();
    //     //this.prepareForMoreMath();
    //     this.Operand1.setValue(this.The_View.getResult());
    //     // this.Operand2.refresh();
    //
    //     // this.operator = null;
    //     // console.log("Operator is now " + this.operator);
    // };

    // //Dan's Idea Version
    // this.calculate = function () {
    //     if (this.Operand2.getValue() === 0){
    //         this.Operand1.copyToOtherOperand(this.Operand2)
    //     }
    //
    //     this.doMathAndResult();
    //     //this.prepareForMoreMath();
    //     this.Operand1.setValue(this.The_View.getResult());
    //     this.Operand2.refresh();
    //
    //     // this.operator = null;
    //     // console.log("Operator is now " + this.operator);
    // };


    this.calculate = function () {
        if (this.Operand2.getValue() === 0) {
            // this.Operand1.copyToOtherOperand(this.Operand2)
            this.doMath(this.Operand1.getValue(),this.Operand1.getValue())
        }
        else {
            this.doMathAndResult();
        }
        //this.prepareForMoreMath();
        this.Operand1.setValue(this.The_View.getResult());
        this.Operand2.refresh();

        // this.operator = null;
        // console.log("Operator is now " + this.operator);
    };


    this.prepareForMoreMath = function () {
        //this.Operand1.copyToOtherOperand(this.Operand2);

    };

    this.backToBaseline = function () {
        this.Operand1.refresh();
        this.Operand2.refresh();
        this.operator = null;
        this.The_View.displaySomething("");
    };

    this.backToHalfBaseline = function () {
        this.Operand2.refresh();
    };

    // this.view = function The_View() {
    //     this.resultNum = null;
    // };
}

var The_Calculator = new Calculator();

function View() {
    this.result = null;

    this.setResult = function (result) {
        this.result = result;
    };

    this.displayResult = function () {
        $('.display').text(this.result);
    };

    this.displaySomething = function (toDisplay) {
        $('.display').text(toDisplay);
    };

    this.getResult = function () {
        return this.result;
    };
}


function Operand() {
    this.value = 0;

    this.isDecimal = false;
    this.decimalCounter = 0;

    this.copyToOtherOperand = function (targetOperand) {
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
        // console.log("Current value is ", this.value);

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
        this.refresh();
        if (num % 1 !== 0) {
            this.isDecimal = true;
            var stringNum = num.toString();
            this.decimalCounter = stringNum.split('.')[1].length;
        }
        this.value = num;
    };
}


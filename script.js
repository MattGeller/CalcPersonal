///////////////////////////////////////////////////////
///"With great OOPower comes great OOPesponsibility"///
///////////////////////////////////////////////////////

$(document).ready(initialize);

function initialize() {
    applyClickHandlers();
    The_Calculator.backToBaseline();
}

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
    // console.log("Operand1 reset to " + The_Calculator.Operand1.getValue());
    // console.log("Operand2 reset to " + The_Calculator.Operand2.getValue());
    // console.log("Operator reset to " + The_Calculator.operator);
    The_Calculator.log_status();
}

function Calculator() {
    var self = this;

    this.Operand1 = new Operand();
    this.Operand2 = new Operand();
    this.Operator = new Operator();

    this.history = new History();

    this.justEqualsed = false;
    this.forceWriteToFirstOperand = false;
    this.historyMode = false;

    this.log_status = function () {
        console.log(self.Operand1.getValue(), self.Operator.value, self.Operand2.getValue(), "justEqualsed: " + self.justEqualsed, "forceWriteToFirstOperand: " + self.forceWriteToFirstOperand);
        console.log(this.history.historicNumber, this.history.historicOperator);
    };

    this.The_View = new View();

    this.numIn = function (num) {
        // if (self.Operand1.getValue() === null) {

        // if (self.justEqualsed){
        //     self.Operand1.reset();
        //     // self.Operand2.reset();
        //     self.operator = null;
        //
        //     self.justEqualsed = false;
        // }
// debugger
//         if (self.justEqualsed && self.forceWriteToFirstOperand){
//             self.Operand1.reset();
//             self.Operand1.add_digit(num);
//             self.justEqualsed = false;
//             self.The_View.displaySomething(self.Operand1.getValue());
        if (self.forceWriteToFirstOperand) {
            if (self.justEqualsed) {
                self.Operand1.reset();
                self.justEqualsed = false;
            }
            self.Operand1.add_digit(num);
            self.The_View.displaySomething(self.Operand1.getValue());

        } else {

            if (self.Operator.value === null) {
                self.Operand1.add_digit(num);
                // console.log("Operand1 is now " + self.Operand1.getValue());
                self.The_View.displaySomething(self.Operand1.getValue());
            }

            else {
                self.Operand2.add_digit(num);
                // console.log("Operand2 is now " + self.Operand2.getValue());
                self.The_View.displaySomething(self.Operand2.getValue());
            }
        }

        self.log_status();
    };

    this.decIn = function () {
        // if (self.Operand1.getValue() === null) {
        if (self.Operator.value === null && !self.Operand1.isDecimal) {
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
        var incomingOperator = new Operator();
        incomingOperator.setValue(op);

        // if (incomingOperator.precedence > self.Operator.precedence) {
        //     history.historicNumber =
        // }

        if (self.forceWriteToFirstOperand) {
            self.forceWriteToFirstOperand = false;
            self.Operand2.reset();
        } else {

            /**************************************if I already have an operator but not another nubmer then swap out operator*/
            /*******if i have an opaeerator and a second number immediately do math, and put it into the first number. Then i should be ready to carry on as normal*/
            if (self.Operator.value !== null && self.Operand2.getValue() !== null) {
                if (!self.justEqualsed) {
                    if (incomingOperator.precedence > self.Operator.precedence) {
                        self.history.historicNumber = self.Operand1.getValue();
                        self.history.historicOperator = self.Operator.value;
                        self.Operand1.setValue(self.Operand2.getValue());
                        self.The_View.setResult(self.Operand1.getValue());
                    } else {
                        self.Operand1.setValue(self.doMath(self.Operand1.getValue(), self.Operand2.getValue(), self.Operator.value));
                        self.The_View.setResult(self.Operand1.getValue());
                    }
                    if (incomingOperator.precedence < self.Operator.precedence) {
                        self.Operand1.setValue(self.doMath(self.Operand1.getValue(), self.history.historicNumber, self.history.historicOperator));
                        self.The_View.setResult(self.Operand1.getValue());
                        self.history.clearHistory();
                    }

                    /**Don't forget to clear out the second number!*/
                    self.Operand2.reset();
                } else { //if equals sign WAS just pressed
                    self.Operand1.setValue(self.The_View.getResult());
                    self.Operand2.reset();
                }
            }
        }


        // debugger;
        self.Operator.setValue(op);
        self.justEqualsed = false;
        self.log_status();
    };

    this.doMathAndResult = function () {
        var result = this.doMath();
        console.log("Result of the math is " + result);
        this.The_View.setResult(result);
        this.The_View.displayResult();
        // this.The_View.setResult(this.doMath());
    };

    this.doMath = function (num1, num2, op) {

        switch (op) {
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
        // var argNum1 = null;
        // var argNum2 = null;
        // var argOp = null;
        var result = null;

        if (self.Operator.value) { //if there IS an operator
            if (self.Operand2.getValue() !== null) { //if there IS a value in Operand2
                result = self.doMath(self.Operand1.getValue(), self.Operand2.getValue(), self.Operator.value);
            }
            else { // if there is NOT a value in Operand2
                result = self.doMath(self.Operand1.getValue(), self.Operand1.getValue(), self.Operator.value);
                self.Operand2.setValue(self.Operand1.getValue()); //set operand 2 to operand 1
                // self.Operand1.setValue(result); //set operand 1 to be the result //I do this after this code block anyway
                //with both of these things done, status should be ready to continue adding incrementally.
            }

            if (self.history.historicOperator) { //if there IS a history (checked by seeing if there's a historic operator
                result = self.doMath(self.history.historicNumber,result,self.history.historicOperator);
            }

            self.Operand1.setValue(result);
            self.The_View.setResult(result);
            self.The_View.displayResult();

        } else { //if there is NOT an operator

        }

        // self.Operand1.setValue(result);
        // if (this.Operand2.getValue() === 0) {
        //     // this.Operand1.copyToOtherOperand(this.Operand2)
        //     this.doMath(this.Operand1.getValue(),this.Operand1.getValue())
        // }
        // else {
        //     this.doMathAndResult();
        // }
        // //this.prepareForMoreMath();
        // this.Operand1.setValue(this.The_View.getResult());
        // this.Operand2.refresh();
        //
        // // this.operator = null;
        console.log("result calculated is", result);


        self.log_status();
        self.justEqualsed = true;
        self.forceWriteToFirstOperand = true;
    };

    this.prepareToCalculate = function () {

    };


    this.prepareForMoreMath = function () {
        //this.Operand1.copyToOtherOperand(this.Operand2);

    };

    this.backToBaseline = function () {
        this.Operand1.refresh();
        this.Operand2.reset();
        this.Operator.reset();
        this.The_View.setResult(this.Operand1.getValue());
        // this.The_View.displaySomething("");
        this.justEqualsed = false;
        this.forceWriteToFirstOperand = false;
        this.historyMode = false;
        this.history.clearHistory();
    };

    this.backToHalfBaseline = function () {
        this.Operand2.refresh();
    };

    // this.view = function The_View() {
    //     this.resultNum = null;
    // };
}

function History() {
    this.historicNumber = null;
    this.historicOperator = null;

    this.clearHistory = function () {
        this.historicNumber = null;
        this.historicOperator = null;
    };

}

var The_Calculator = new Calculator();

function View() {
    this.result = null;

    this.setResult = function (result) {
        this.result = result;
        this.displayResult();
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
    this.value = null;

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

    this.reset = function () {
        this.value = null;
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

function Operator() {
    this.value = null;

    this.precedence = null;

    this.setValue = function (op) {
        this.value = op;
        switch (op) {
            case '+':
            case 'add':
            case '-':
            case 'subtract':
                this.precedence = 1;
                break;
            case '*':
            case 'x':
            case 'X':
            case 'multiply':
            case 'divide':
            case '/':
                this.precedence = 2;
                break;
        }
    };
    this.reset = function () {
        this.value = null;
        this.precedence = null;
    }
}

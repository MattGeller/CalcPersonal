var Operand1 = new Operand();

function Operand() {
    this.value = 0;

    this.isDecimal = false;
    this.decimalCounter = 0;

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
    }
}
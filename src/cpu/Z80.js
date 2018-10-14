"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Z80 = /** @class */ (function () {
    function Z80() {
        this.programCounter = 0;
        this.registers = {
            a: 0,
            b: 0,
            c: 0,
            d: 0,
            e: 0,
            h: 0,
            l: 0,
            flags: {
                zero: false,
                carry: false,
                subtraction: false,
                halfCarry: false,
            },
            stackPointer: 0,
            // TODO (nw): why does the CPU also keep track of the clock? I'm unclear what's going on here
            clock: {
                m: 0,
                t: 0,
            },
        };
        this.MMU = {
            readByte: function () { },
            readWord: function () { },
            writeByte: function () { },
            writeWord: function () { }
        };
    }
    Z80.prototype.clearFlags = function () {
        this.registers.flags = {
            zero: false,
            carry: false,
            subtraction: false,
            halfCarry: false,
        };
    };
    Z80.prototype.addOneMTime = function () {
        this.registers.clock = {
            m: 1,
            t: 4,
        };
    };
    /*
     * Value in register 2 gets added to the value in register 1
     * The sum is left in register1
     */
    Z80.prototype._add = function (register1, register2) {
        this.registers[register1] += this.registers[register2];
        this.clearFlags();
        if (this.registers[register1] % 256 === 0) {
            this.registers.flags.zero = true;
        }
        if (this.registers[register1] > 255) {
            this.registers.flags.carry = true;
        }
        // TODO (nw): calculate the half-carry flag here as well
        this.registers[register1] = this.registers[register1] % 256;
        this.addOneMTime();
    };
    /*
     * Compare value in register 2 to value in register 1
     * Sets flags (subtraction, zero, and carry) accordingly
     * TODO (nw): also possibly half-carry? Maybe.
     */
    Z80.prototype._compare = function (register1, register2) {
        var difference = this.registers[register1] - this.registers[register2];
        this.registers.flags.subtraction = true;
        if (difference === 0) {
            this.registers.flags.zero = true;
        }
        if (difference < 0) {
            this.registers.flags.carry = true;
        }
        this.addOneMTime();
    };
    // Naming convention: add register e (to a)
    Z80.prototype.ADDr_e = function () { this._add('a', 'e'); };
    // Compare register (a) to b
    Z80.prototype.CPr_b = function () { this._compare('a', 'b'); };
    // TODO (nw): add all remaining operations (and there are many
    Z80.prototype.noop = function () {
        this.addOneMTime();
    };
    return Z80;
}());
exports.Z80 = Z80;
//# sourceMappingURL=Z80.js.map
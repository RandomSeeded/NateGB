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
        // TODO (nw): implementation of this
        this.MMU = {
            readByte: function (addr) { return -1; },
            readWord: function (addr) { return -1; },
            writeByte: function (addr, val) { },
            writeWord: function (addr, val) { }
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
    Z80.prototype.addMTime = function (cycles) {
        this.registers.clock = {
            m: cycles,
            t: 4 * cycles,
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
        this.addMTime(1);
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
        this.addMTime(1);
    };
    /*
     * Push the values in the two registers provided onto the stack.
     * The stack is stored in memory.
     */
    Z80.prototype._push = function (register1, register2) {
        this.registers.stackPointer--;
        this.MMU.writeByte(this.registers.stackPointer, this.registers[register1]);
        this.registers.stackPointer--;
        this.MMU.writeByte(this.registers.stackPointer, this.registers[register2]);
        this.addMTime(3);
    };
    /*
     * Pop the values from the stack onto the two registers provided
     */
    Z80.prototype._pop = function (register1, register2) {
        this.registers[register1] = this.MMU.readByte(this.registers.stackPointer);
        this.registers.stackPointer++;
        this.registers[register2] = this.MMU.readByte(this.registers.stackPointer);
        this.registers.stackPointer++;
    };
    // Naming convention: add register e (to a)
    Z80.prototype.ADDr_e = function () { this._add('a', 'e'); };
    // Compare register (a) to b
    Z80.prototype.CPr_b = function () { this._compare('a', 'b'); };
    // Push BC to the stack
    Z80.prototype.PUSHBC = function () { this._push('b', 'c'); };
    // Pop HL from the stack
    // TODO (nw): add all remaining operations (and there are many
    Z80.prototype.noop = function () {
        this.addMTime(1);
    };
    return Z80;
}());
exports.Z80 = Z80;
//# sourceMappingURL=Z80.js.map
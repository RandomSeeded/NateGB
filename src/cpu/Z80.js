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
                operation: false,
                halfCarry: false,
            },
            stackPointer: 0,
            // TODO (nw): why does the CPU also keep track of the clock? I'm unclear what's going on here
            clock: {
                m: 0,
                t: 0,
            },
        };
    }
    Z80.prototype.clearFlags = function () {
        this.registers.flags = {
            zero: false,
            carry: false,
            operation: false,
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
    Z80.prototype.add = function (register1, register2) {
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
    Z80.prototype.noop = function () {
        this.addOneMTime();
    };
    return Z80;
}());
exports.Z80 = Z80;
//# sourceMappingURL=Z80.js.map
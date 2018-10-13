"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = __importDefault(require("ava"));
var Z80_1 = require("../../src/cpu/Z80");
ava_1.default('adds to a register and increments the clock', function (t) {
    var z80 = new Z80_1.Z80();
    z80.registers.e = 1;
    t.is(z80.registers.clock.m, 0);
    t.is(z80.registers.clock.t, 0);
    z80.ADDR_e();
    t.is(z80.registers.a, 1);
    t.is(z80.registers.e, 1);
    t.is(z80.registers.clock.m, 1);
    t.is(z80.registers.clock.t, 4);
    t.is(z80.registers.flags.carry, false);
    t.is(z80.registers.flags.zero, false);
});
ava_1.default('it correctly handles overflow', function (t) {
    var z80 = new Z80_1.Z80();
    z80.registers.a = 200;
    z80.registers.e = 200;
    z80.ADDR_e();
    t.is(z80.registers.a, 144);
    t.is(z80.registers.e, 200);
    t.is(z80.registers.flags.carry, true);
    t.is(z80.registers.flags.zero, false);
});
ava_1.default('it correctly handles zero', function (t) {
    var z80 = new Z80_1.Z80();
    z80.registers.a = 255;
    z80.registers.e = 1;
    z80.ADDR_e();
    t.is(z80.registers.a, 0);
    t.is(z80.registers.e, 1);
    t.is(z80.registers.flags.carry, true);
    t.is(z80.registers.flags.zero, true);
});
//# sourceMappingURL=add.test.js.map
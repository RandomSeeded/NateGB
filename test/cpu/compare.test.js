"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = __importDefault(require("ava"));
var Z80_1 = require("../../src/cpu/Z80");
ava_1.default('compares registers without modifying values', function (t) {
    var z80 = new Z80_1.Z80();
    z80.registers.a = 2;
    z80.registers.b = 1;
    t.is(z80.registers.clock.m, 0);
    t.is(z80.registers.clock.t, 0);
    z80.CPr_b();
    t.is(z80.registers.a, 2);
    t.is(z80.registers.b, 1);
    t.is(z80.registers.flags.carry, false);
    t.is(z80.registers.flags.zero, false);
    t.is(z80.registers.clock.m, 1);
    t.is(z80.registers.clock.t, 4);
});
ava_1.default('compare correctly handles zero flag', function (t) {
    var z80 = new Z80_1.Z80();
    z80.registers.a = 2;
    z80.registers.b = 2;
    z80.CPr_b();
    t.is(z80.registers.flags.carry, false);
    t.is(z80.registers.flags.zero, true);
});
ava_1.default('compare correctly handles carry flag', function (t) {
    var z80 = new Z80_1.Z80();
    z80.registers.a = 2;
    z80.registers.b = 3;
    z80.CPr_b();
    t.is(z80.registers.flags.carry, true);
    t.is(z80.registers.flags.zero, false);
});
//# sourceMappingURL=compare.test.js.map
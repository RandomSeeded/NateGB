"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = __importDefault(require("ava"));
var Z80_1 = require("../../src/cpu/Z80");
ava_1.default('increments one machine cycle', function (t) {
    var z80 = new Z80_1.Z80();
    t.is(z80.registers.clock.m, 0);
    t.is(z80.registers.clock.t, 0);
    z80.noop();
    t.is(z80.registers.clock.m, 1);
    t.is(z80.registers.clock.t, 4);
});
//# sourceMappingURL=noop.test.js.map
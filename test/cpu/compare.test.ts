import test from 'ava';

import { Z80 } from '../../src/cpu/Z80';

test('compares registers without modifying values', t => {
  const z80 = new Z80();
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

test('compare correctly handles zero flag', t => {
  const z80 = new Z80();
  z80.registers.a = 2;
  z80.registers.b = 2;
  z80.CPr_b();

  t.is(z80.registers.flags.carry, false);
  t.is(z80.registers.flags.zero, true);
});

test('compare correctly handles carry flag', t => {
  const z80 = new Z80();
  z80.registers.a = 2;
  z80.registers.b = 3;
  z80.CPr_b();

  t.is(z80.registers.flags.carry, true);
  t.is(z80.registers.flags.zero, false);
});

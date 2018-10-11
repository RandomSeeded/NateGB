import test from 'ava';

import { Z80 } from '../../src/cpu/Z80';

test('adds to a register and increments the clock', t => {
  const z80 = new Z80();
  z80.registers.b = 1;

  t.is(z80.registers.clock.m, 0);
  t.is(z80.registers.clock.t, 0);

  z80.add('a', 'b');
  t.is(z80.registers.a, 1);
  t.is(z80.registers.b, 1);
  t.is(z80.registers.clock.m, 1);
  t.is(z80.registers.clock.t, 4);
  t.is(z80.registers.flags.carry, false);
  t.is(z80.registers.flags.zero, false);
});

test('it correctly handles overflow', t => {
  const z80 = new Z80();
  z80.registers.a = 200;
  z80.registers.b = 200;

  z80.add('a', 'b');
  t.is(z80.registers.a, 144);
  t.is(z80.registers.b, 200);
  t.is(z80.registers.flags.carry, true);
  t.is(z80.registers.flags.zero, false);
});

test('it correctly handles zero', t => {
  const z80 = new Z80();
  z80.registers.a = 255;
  z80.registers.b = 1;

  z80.add('a', 'b');
  t.is(z80.registers.a, 0);
  t.is(z80.registers.b, 1);
  t.is(z80.registers.flags.carry, true);
  t.is(z80.registers.flags.zero, true);
});

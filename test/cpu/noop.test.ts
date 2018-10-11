import test from 'ava';

import { Z80 } from '../../src/cpu/Z80';

test('increments one machine cycle', t => {
  const z80 = new Z80();
  t.is(z80.registers.clock.m, 0);
  t.is(z80.registers.clock.t, 0);
  z80.noop();
  t.is(z80.registers.clock.m, 1);
  t.is(z80.registers.clock.t, 4);
});

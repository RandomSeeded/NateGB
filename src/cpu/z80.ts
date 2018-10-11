type EightBitRegister = 'a' | 'b' | 'c' | 'd' | 'e' | 'h' | 'l';

interface Clock {
  lastInstruction: number;
  total: number;
}

interface Registers {
  // 8-bit registers
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  h: number;
  l: number;

  // 16-bit registers
  flags: {
    zero: number;
    carry: number;
    operation: number;
    halfCarry: number;
  };
  stackPointer: number;
  clock: Clock;
}

export class Z80 {
  programCounter: number;
  registers: Registers;
  clock: Clock;

  constructor() {
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
        zero: 0,
        carry: 0,
        operation: 0,
        halfCarry: 0,
      },

      stackPointer: 0,

      // CPU also tracks m and t, not sure why
      clock: {
        lastInstruction: 0,
        total: 0,
      },
    };
  }

  clearFlags() {
    this.registers.flags = {
      zero: 0,
      carry: 0,
      operation: 0,
      halfCarry: 0,
    };
  }

  add(register1: EightBitRegister, register2: EightBitRegister) {
    // Value in register 2 gets added to the value in register 1
    // The sum is left in register1
    this.registers[register1] = this.registers[register1] + this.registers[register2];
  }
}

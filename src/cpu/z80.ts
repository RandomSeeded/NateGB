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
    zero: boolean;
    carry: boolean;
    operation: boolean;
    halfCarry: boolean;
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
        zero: false,
        carry: false,
        operation: false,
        halfCarry: false,
      },

      stackPointer: 0,

      // TODO (nw): why does the CPU also keep track of the clock? I'm unclear what's going on here
      clock: {
        lastInstruction: 0,
        total: 0,
      },
    };
  }

  clearFlags() {
    this.registers.flags = {
      zero: false,
      carry: false,
      operation: false,
      halfCarry: false,
    };
  }

  /*
   * Value in register 2 gets added to the value in register 1
   * The sum is left in register1
   */
  add(register1: EightBitRegister, register2: EightBitRegister) {
    this.registers[register1] += this.registers[register2];
    this.clearFlags();

    if (this.registers[register1] % 256 === 0) {
      this.registers.flags.zero = false;
    }

    // Z80._r.a += Z80._r.e;                      // Perform addition
    // Z80._r.f = 0;                              // Clear flags

    // if(!(Z80._r.a & 255)) Z80._r.f |= 0x80;    // Check for zero
    // What is this doing? From the inside:
    // bitwise & with 255. Given that it's an 8bit register, that means
    // XXXXXXXX & 11111111 => XXXXXXXX.
    // So this basically means (if XXXXXXX === 0). Unclear why he didn't just do that.
    // It's basically a modulus operator


    // if(Z80._r.a > 255) Z80._r.f |= 0x10;       // Check for carry
    // Z80._r.a &= 255;                           // Mask to 8-bits
    // Z80._r.m = 1; Z80._r.t = 4;                // 1 M-time taken
  }
}

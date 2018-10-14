type EightBitRegister = 'a' | 'b' | 'c' | 'd' | 'e' | 'h' | 'l';

interface Clock {
  // I BELIEVE that t is always m * 4. T is actual mhz, m is 'machine cycles'
  m: number;
  t: number;
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
    subtraction: boolean;
    halfCarry: boolean;
  };
  stackPointer: number;
  clock: Clock;
}

interface MMU {
  readByte: (addr: number) => number;
  readWord: (addr: number) => number;
  writeByte: (addr: number, val: number) => void;
  writeWord: (addr: number, val: number) => void;
}

export class Z80 {
  programCounter: number;
  registers: Registers;
  clock: Clock;
  MMU: MMU;

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
        zero: false, // Set if result % 256 === 0
        carry: false, // Set if result > 255
        subtraction: false, // Set if last operation was a subtraction
        halfCarry: false, // Set if last operation lower half > 15 (why?)
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
      readByte: function(addr) { return -1; },
      readWord: function(addr) { return -1; },
      writeByte: function(addr, val) {},
      writeWord: function(addr, val) {}
    };
  }

  clearFlags(): void {
    this.registers.flags = {
      zero: false,
      carry: false,
      subtraction: false,
      halfCarry: false,
    };
  }

  addMTime(cycles: number) {
    this.registers.clock = {
      m: cycles,
      t: 4 * cycles,
    };
  }

  /*
   * Value in register 2 gets added to the value in register 1
   * The sum is left in register1
   */
  _add(register1: EightBitRegister, register2: EightBitRegister) {
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
  }


  /*
   * Compare value in register 2 to value in register 1
   * Sets flags (subtraction, zero, and carry) accordingly
   * TODO (nw): also possibly half-carry? Maybe.
   */
  _compare(register1: EightBitRegister, register2: EightBitRegister): void {
    const difference = this.registers[register1] - this.registers[register2];

    this.registers.flags.subtraction = true;
    if (difference === 0) {
      this.registers.flags.zero = true;
    }
    if (difference < 0) {
      this.registers.flags.carry = true;
    }
    this.addMTime(1);
  }

  /*
   * Push the values in the two registers provided onto the stack.
   * The stack is stored in memory.
   */
  _push(register1: EightBitRegister, register2: EightBitRegister): void {
    this.registers.stackPointer--;
    this.MMU.writeByte(this.registers.stackPointer, this.registers[register1]);
    this.registers.stackPointer--;
    this.MMU.writeByte(this.registers.stackPointer, this.registers[register2]);
    this.addMTime(3);
  }

  /*
   * Pop the values from the stack onto the two registers provided
   */
  _pop(register1: EightBitRegister, register2: EightBitRegister): void {
    this.registers[register1] = this.MMU.readByte(this.registers.stackPointer);
    this.registers.stackPointer++;
    this.registers[register2] = this.MMU.readByte(this.registers.stackPointer);
    this.registers.stackPointer++;
  }

  // Naming convention: add register e (to a)
  ADDr_e() { this._add('a', 'e'); }

  // Compare register (a) to b
  CPr_b() { this._compare('a', 'b'); }

  // Push BC to the stack
  PUSHBC() { this._push('b', 'c'); }

  // Pop HL from the stack

  // TODO (nw): add all remaining operations (and there are many

  noop(): void {
    this.addMTime(1);
  }
}

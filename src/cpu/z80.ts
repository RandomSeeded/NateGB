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

  private clearFlags(): void {
    this.registers.flags = {
      zero: false,
      carry: false,
      subtraction: false,
      halfCarry: false,
    };
  }

  private addMTime(cycles: number) {
    this.registers.clock = {
      m: cycles,
      t: 4 * cycles,
    };
  }

  /*
   * Value in register 2 gets added to the value in register 1
   * The sum is left in register1
   */
  private _add(register1: EightBitRegister, register2: EightBitRegister) {
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
  private _compare(register1: EightBitRegister, register2: EightBitRegister): void {
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
  private _push(register1: EightBitRegister, register2: EightBitRegister): void {
    this.registers.stackPointer--;
    this.MMU.writeByte(this.registers.stackPointer, this.registers[register1]);
    this.registers.stackPointer--;
    this.MMU.writeByte(this.registers.stackPointer, this.registers[register2]);
    this.addMTime(3);
  }

  /*
   * Pop the values from the stack onto the two registers provided
   */
  private _pop(register1: EightBitRegister, register2: EightBitRegister): void {
    this.registers[register1] = this.MMU.readByte(this.registers.stackPointer);
    this.registers.stackPointer++;
    this.registers[register2] = this.MMU.readByte(this.registers.stackPointer);
    this.registers.stackPointer++;
    this.addMTime(3);
  }

  private _load(register: EightBitRegister): void {
    const addr = this.programCounter;
    // TODO (nw): why does this take 2 cycles?
    // Easy answer: because that's how long it takes in the actual hardware
    // Long answer: I don't know why that takes 2 cycles in actual hardware, you'd need to look into it
    this.programCounter += 2;
    this.registers[register] = this.MMU.readByte(addr);
    this.addMTime(4); // TODO (nw): how do you know how many cycles it takes? Have to look it up presumably
  }

  // Naming convention: add register e (to a)
  ADDr_e() { this._add('a', 'e'); }

  // Compare register (a) to b
  CPr_b() { this._compare('a', 'b'); }

  // Push BC to the stack
  PUSHBC() { this._push('b', 'c'); }

  // Pop HL from the stack
  POPHL() { this._pop('h', 'l'); }

  // Load value at address into register A
  LDAmm() { this._load('a'); }

  // TODO (nw): add all remaining operations (and there are many)

  noop(): void {
    this.addMTime(1);
  }

  dispatcher(): void {
    // Fetch instruction
    const operation = this.MMU.readByte(this.programCounter++);
    // Dispatch (run instruction)
    // TODO (nw): this needs a mapping between instructions and JS functions

    // Mask PC to 16 bits (why?)
    // This seems accurate from an emulation perspective (it is a 16-bit number)
    // But I can't imagine under what circumstance you'd ever want to reset the program counter to 0...
    this.programCounter = this.programCounter % 65535;


    // Increment the clock (why?)
    this.clock.m += this.registers.clock.m;
    this.clock.t += this.registers.clock.t;
  }
}

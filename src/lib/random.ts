export interface RandomGenerator {
  next(): number;
  integer(min: number, max: number): number;
  pick<T>(items: T[]): T;
}

export class SeededRandom implements RandomGenerator {
  private seed: number;

  constructor(seed: string | number) {
    this.seed = typeof seed === "string" ? this.hashString(seed) : seed;
  }

  next(): number {
    this.seed = (this.seed * 16807 + 0) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  integer(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  pick<T>(items: T[]): T {
    const index = this.integer(0, items.length - 1);
    return items[index];
  }

  private hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 33 + str.charCodeAt(i)) % 2147483647;
    }
    return hash || 1;
  }
}

export function createRandomGenerator(seed?: string | number): RandomGenerator {
  if (seed !== undefined) {
    return new SeededRandom(seed);
  }
  return new BrowserRandom();
}

class BrowserRandom implements RandomGenerator {
  next(): number {
    return Math.random();
  }

  integer(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  pick<T>(items: T[]): T {
    const index = Math.floor(Math.random() * items.length);
    return items[index];
  }
}

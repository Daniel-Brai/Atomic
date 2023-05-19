/**
 * An implementation of Bloom filter for the Atomic URL Shortening service.
 * THis implementation is memory-based so there is no continuity
 */

import crc32 from 'crc-32';

// TODO: Add Redis storage backend for the Bloom filter
class BloomFilter {
  private readonly bitArray: boolean[];
  private readonly numHashFunctions: number;

  constructor(size: number, numHashFunctions: number) {
    this.bitArray = new Array(size).fill(false);
    this.numHashFunctions = numHashFunctions;
  }

  private hash(element: string, seed: number): number {
    const hashValue = crc32.str(element + seed.toString());
    return Math.abs(hashValue) % this.bitArray.length;
  }

  add(element: string): void {
    for (let i = 0; i < this.numHashFunctions; i++) {
      const hashValue = this.hash(element, i);
      this.bitArray[hashValue] = true;
    }
  }

  mayContain(element: string): boolean {
    for (let i = 0; i < this.numHashFunctions; i++) {
      const hashValue = this.hash(element, i);
      if (!this.bitArray[hashValue]) {
        return false;
      }
    }
    return true;
  }
}

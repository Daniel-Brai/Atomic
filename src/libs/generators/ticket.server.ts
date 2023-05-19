/**
 * Implementation of a Ticket server that generates a unique 64-bit complaint numeric id
 * The id generated will be used as a hash to the original url for the Link Entity
 */

import { customAlphabet } from 'nanoid';

export class TicketServer {
  private counter: number;

  constructor() {
    this.counter = 0;
  }

  generateShortUrlHash(): string {
    const timestamp = Date.now();
    const id = (timestamp << 16) | (this.counter & 0xffff);

    this.counter = (this.counter + 1) & 0xffff; // Increment and reset counter if it exceeds 16 bits

    return this.base62Encoder(id);
  }

  private base62Encoder(value: number): string {
    const CHARACTERS =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';

    do {
      const remainder = value % 62;
      result = CHARACTERS.charAt(remainder) + result;
      value = Math.floor(value / 62);
    } while (value > 0);

    if (result == '') {
      // TODO: Remove Fallback when I have gotten the algorithm to product a non-empty result all the time
      const id = customAlphabet(CHARACTERS, 6);
      return id();
    } else {
      return result;
    }
  }
}

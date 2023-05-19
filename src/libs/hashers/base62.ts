/**
 * Implementation of Base 62 Hashing for the Atomic URL shortening service
 * Base conversion helps to convert the same number between its different number representation systems. Base
 * 62 conversion is used as there are 62 possible characters for hashValue
 */

class Base62 {
  private static charset: string[] =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTU'.split('');

  static encode(id: number) {
    if (+id === 0) {
      return 0;
    }
    let s = [];
    while (id > 0) {
      s = [Base62.charset[id % 62], ...s];
      id = Math.floor(id / 62);
    }
    return s.join('');
  }
  static decode(chars: string) {
    chars
      .split('')
      .reverse()
      .reduce(
        (prev, curr, i) => prev + Base62.charset.indexOf(curr) * 62 ** i,
        0,
      );
  }
}

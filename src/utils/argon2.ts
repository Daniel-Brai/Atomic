import * as argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password);
  } catch (e) {
    throw new Error(`${e.msg}`);
  }
}

export async function verifyPassword(
  hashed_password: string,
  password: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hashed_password, password);
  } catch (e) {
    throw new Error(`${e.msg}`);
  }
}

import bcrypt from "bcryptjs";

export default async function hashPasssword(
  plainText: string
): Promise<String> {
  const hashed = await bcrypt.hash(plainText, 5);

  return hashed;
}

export async function verifyHash(
  plainText: string,
  hash: string
): Promise<boolean> {
  const passwordMatch = await bcrypt.compare(plainText, hash);
  return passwordMatch;
}

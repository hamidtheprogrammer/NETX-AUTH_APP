import { db } from "../database/dbConfig";

async function checkUser(email: string) {
  return await db.users.findFirst({
    where: { email },
    select: { id: true, name: true, email: true },
  });
}

async function createUser(email: string, name: string, passwordHash?: string) {
  const data: { email: string; name: string; password?: string } = {
    email,
    name,
  };

  if (passwordHash) {
    data.password = passwordHash;
  }

  try {
    return await db.users.create({
      data,
      select: { id: true, name: true, email: true },
    });
  } catch (error) {
    console.log(error);
  }
}

export { checkUser, createUser };

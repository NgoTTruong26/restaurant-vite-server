import bcrypt from "bcryptjs";

export const encrypt = async (args: string) => {
  return await bcrypt.hash(args, 8);
};

export const compare = async (args: string, encrypt: string) => {
  return await bcrypt.compare(args, encrypt);
};

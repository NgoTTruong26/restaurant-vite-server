import { error } from "console";
import App from "./app";
import prisma from "./configs/prisma.config";

prisma
  .$connect()
  .then(() => {
    console.log("Connected to SQL Database");

    const app = new App(process.env.PORT!);
    app.listen();
  })
  .catch((err) => {
    throw new Error(err);
  });

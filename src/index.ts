import App from "./app";
import prismaClient from "./configs/prisma.config";

prismaClient
  .$connect()
  .then(() => {
    console.log("Connected to SQL Database");

    const app = new App(process.env.PORT!);
    app.listen();
  })
  .catch((err) => {
    throw new Error(err);
  });

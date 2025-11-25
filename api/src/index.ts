import express, { Express, Request, Response } from "express";
import { errorHandler } from "./middlewares/error.handler";
import config from "./config/config";
import router from "./routes";

const app: Express = express();

app.use(express.json());

app.use("/api", router);
app.use(errorHandler);

app.listen(config.port, "0.0.0.0", () => {
  console.log(`Server running on port ${config.port}`);
});

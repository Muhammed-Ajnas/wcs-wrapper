import { router } from "#routes/routes.js";
import express from "express";
import morgan from "morgan";

export const app = express();

app.use(morgan("common"));
app.use("/api", router);

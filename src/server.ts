import { router } from "#routes/routes.js";
import express from "express";
import morgan from "morgan";

const app = express();
const port = process.env.PORT ?? "9001";

app.use(morgan("common"));
app.use("/api/v1", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

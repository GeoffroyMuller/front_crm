require("dotenv").config();
import bodyParser from "body-parser";
import express, { Application } from "express";
const cors = require("cors");
import FixerService from "./fixer.service";
import rates from "./rates.json";

const app: Application = express();

app.use(bodyParser.json());

app.use(cors());

app.get("/currencies/rates", (req, res) => {
  res.json(rates);
});

/* app.get("/currencies/fetch", async (req, res) => {
  const rates = await FixerService.getRates("USD");
  res.json(rates);
});  */

app.listen(3006, () => {
  console.log("The application is listening on port 3006!");
});

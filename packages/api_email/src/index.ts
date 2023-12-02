require("dotenv").config();
import bodyParser from "body-parser";
import express, { Application } from "express";
import "./config/database";
const cors = require("cors");
let cookieParser = require("cookie-parser");
import * as path from "path"; 
import Routes from 'core_api/routes';

const app: Application = express();

// parse application/json
app.use(bodyParser.json());

app.use(
  cookieParser({
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
);
app.use(cors());


Routes(app, path.join(__dirname, "api"));


app.listen(3010, () => {
  console.log("The application is listening on port 3010!");
});

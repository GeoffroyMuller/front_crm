import express from "express";
const fs = require("fs");
const path = require("path");
import * as formidable from "formidable";
import { NotFoundError, handleError } from "core_api/errors";
import { IAuthRequest, User } from "core_api/types";

const app = express();

const router = express.Router();

router.post("/upload", (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      if (!files.media?.[0]) {
        throw Error();
      }

      let oldPath = files.media[0].filepath;
      
      let newPath = path.join(__dirname, "../uploads") + "/" + (files.media[0].originalFilename);
      let rawData = fs.readFileSync(oldPath);

      fs.writeFile(newPath, rawData, function (err: any) {
        if (err) throw err;
        return res.send("Successfully uploaded");
      });
    });
  } catch (err) {
    handleError(req as IAuthRequest<User>, res, err);
  }
});

app.use("/media", router);

// @ts-ignore
app.listen(3011, function (err) {
  if (err) console.log(err);
  console.log("Server listening on Port 3011");
});

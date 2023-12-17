import express from "express";
const fs = require("fs");
const path = require("path");
import * as formidable from "formidable";
import { NotFoundError, handleError } from "core_api/errors";
import { IAuthRequest, User } from "core_api/types";
import Media from "./media.model";
import crypto from "node:crypto";
import "./config/database";
import authMiddleware from "core_api/middlewares/auth.middleware";

const app = express();

const router = express.Router();

router.use(authMiddleware);

router.post("/upload", async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      const file = files.media?.[0] || files.file?.[0];
      if (!file) {
        throw Error();
      }

      let oldPath = file.filepath;
      const filename = file.originalFilename || "";
      const fileextension = filename.split(".")?.[1];
      const filepath = `${crypto.randomUUID()}.${fileextension}`;
      let newPath = path.join(__dirname, "../uploads") + "/" + filepath;
      let rawData = fs.readFileSync(oldPath);
      const idCompany = (req as IAuthRequest<User>).auth.idCompany as number || 0;
      fs.writeFile(newPath, rawData, async function (err: any) {
        if (err) throw err;
        const media = await Media.query().insertAndFetch({
          idCompany,
          filepath,
          filename,
        });
        return res.json(media);
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

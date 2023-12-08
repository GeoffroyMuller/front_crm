import express from "express";
const fs = require("fs");
const path = require("path");
import formidable from "formidable";

const app = express();

app.post("/api/upload", (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.parse(req, function (err, fields, files) {
    let oldPath = files.profilePic.filepath;
    let newPath = path.join(__dirname, "uploads") + "/" + files.profilePic.name;
    let rawData = fs.readFileSync(oldPath);

    fs.writeFile(newPath, rawData, function (err) {
      if (err) console.log(err);
      return res.send("Successfully uploaded");
    });
  });
});

app.listen(3000, function (err) {
  if (err) console.log(err);
  console.log("Server listening on Port 3000");
});

import { Stream } from "stream";
import { IPdfService } from "./types";
import * as fs from "fs";
import puppeteer, { Browser } from "puppeteer";

var pdf = require("html-pdf");
let ejs = require("ejs");
const { Readable } = require("stream");

let browser: Browser;
async function getBrowser() {
  if (!browser || !browser.isConnected()) browser = await puppeteer.launch({ headless: true });
  return browser;
}

const PdfService: IPdfService = {
  async printPDF(props) {
    const browser = await getBrowser();
    const page = await browser.newPage();
    const html = fs.readFileSync(props.inputPath, "utf8");
    const htmlReplaced: string = ejs.render(html, props.data);
    await page.setContent(htmlReplaced, { waitUntil: "domcontentloaded" });

    // To reflect CSS used for screens instead of print
    await page.emulateMediaType("screen");
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.disconnect();

    if (props.returnType === "buffer") {
      return pdf;
    }
    const stream = Readable.from(pdf);
    return stream;
  },
};

export default PdfService;

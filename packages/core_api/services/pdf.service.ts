import { Stream } from "stream";
import { IPdfService } from "./types";
import * as fs from 'fs';

var pdf = require("html-pdf");
let ejs = require("ejs");
const puppeteer = require("puppeteer");
const { Readable } = require("stream");

const PdfService: IPdfService = {
  async printPDF(props) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const html = fs.readFileSync(props.inputPath, "utf8");
    const htmlReplaced: string = ejs.render(html, props.data);
    await page.setContent(htmlReplaced, { waitUntil: "domcontentloaded" });

    // To reflect CSS used for screens instead of print
    await page.emulateMediaType("screen");
    const pdf = await page.pdf({ format: "A4", printBackground: true, path: 'test.pdf' });

    
    await browser.close();

    if (props.returnType === "buffer") {
      return pdf;
    }
    const stream = Readable.from(pdf);
    return stream;
  },
};

export default PdfService;


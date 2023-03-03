require("dotenv").config();
const cors = require("cors");
import express, { Application, RequestHandler } from "express";
import proxy from "express-http-proxy";

const app: Application = express();

app.use(cors());

const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL,
  erp: process.env.ERP_SERVICE_URL
} as { [key: string]: string };

const PROXY_OPTIONS: proxy.ProxyOptions = {
  proxyReqPathResolver: function (req) {
    return req.originalUrl;
  },
};

const PROXIES = {
  auth: proxy(SERVICES.auth, PROXY_OPTIONS),
  users: proxy(SERVICES.auth, PROXY_OPTIONS),
  roles: proxy(SERVICES.auth, PROXY_OPTIONS),
  rights: proxy(SERVICES.auth, PROXY_OPTIONS),
  google: proxy(SERVICES.auth, PROXY_OPTIONS),
} as { [key: string]: RequestHandler };

Object.keys(PROXIES).forEach((p) => {
  app.use(`/${p}/*`, PROXIES[p]);
  app.use(`/${p}`, PROXIES[p]);
});

app.use(proxy(SERVICES.erp, PROXY_OPTIONS));

app.listen(3005, () => {
  console.log("The application is listening on port 3005!");
});

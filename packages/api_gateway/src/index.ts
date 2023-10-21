require("dotenv").config();
const cors = require("cors");
import express, { Application, RequestHandler } from "express";
import proxy from "express-http-proxy";
import xAuthMiddleware from "core_api/middlewares/xauth.middleware";

const app: Application = express();

app.use(cors());

const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL,
  erp: process.env.ERP_SERVICE_URL,
  calendar: process.env.CALENDAR_SERVICE_URL,
  products: process.env.PRODUCTS_SERVICE_URL,
  projects: process.env.PROJECTS_SERVICE_URL,
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
  events: proxy(SERVICES.calendar, PROXY_OPTIONS),
  products: proxy(SERVICES.products, PROXY_OPTIONS),
  products_real: proxy(SERVICES.products, PROXY_OPTIONS),
  product_real_out: proxy(SERVICES.products, PROXY_OPTIONS),
  reservations: proxy(SERVICES.calendar, PROXY_OPTIONS),
  projects: proxy(SERVICES.projects, PROXY_OPTIONS),
  sections: proxy(SERVICES.projects, PROXY_OPTIONS),
  tasks: proxy(SERVICES.projects, PROXY_OPTIONS),
} as { [key: string]: RequestHandler };

app.use(xAuthMiddleware);

Object.keys(PROXIES).forEach((p) => {
  app.use(`/${p}/*`, PROXIES[p]);
  app.use(`/${p}`, PROXIES[p]);
});

app.use(proxy(SERVICES.erp, PROXY_OPTIONS));

app.listen(3005, () => {
  console.log("The application is listening on port 3005!");
});

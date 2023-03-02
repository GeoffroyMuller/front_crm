require("dotenv").config();
const cors = require("cors");
import express, { Application } from "express";
import proxy from "express-http-proxy";


const app: Application = express();

app.use(cors());

const SERVICES = {
  auth: process.env.AUTH_SERVICE_URL,
} as { [key: string]: string };

const PROXY_OPTIONS: proxy.ProxyOptions = {
  proxyReqPathResolver: function (req) {
    return req.originalUrl;
  },
};

app.use('/auth/*', proxy(SERVICES.auth, PROXY_OPTIONS));
app.use('/companies/*', proxy(SERVICES.auth, PROXY_OPTIONS));
app.use('/users/*', proxy(SERVICES.auth, PROXY_OPTIONS));
app.use('/users', proxy(SERVICES.auth, PROXY_OPTIONS));
app.use('/roles/*', proxy(SERVICES.auth, PROXY_OPTIONS));
app.use('/rights/*', proxy(SERVICES.auth, PROXY_OPTIONS));


app.listen(3005, () => {
  console.log("The application is listening on port 3005!");
});

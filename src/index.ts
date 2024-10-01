// src/index.js
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import router from "./routes/teamRoute";

const mongoose = require("mongoose");

dotenv.config();

const app: Express = express();

app.use(router);

const MONGO_URL = process.env.MONGO_URL || "";
const DEV_URL = process.env.DEV_URL || "";
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

var currentMONGO_URL = "";
// either development or production
if (NODE_ENV == "development") {
    currentMONGO_URL = MONGO_URL;
} else {
    currentMONGO_URL = DEV_URL;
}

mongoose
.connect(currentMONGO_URL)
.then(() => {
    console.log("connected to mongodb");
    app.listen(PORT, () => {
        console.log(`Node API app is running on Port ${PORT}`);
    });
}).catch((error: any) => {
    console.log(error);
});
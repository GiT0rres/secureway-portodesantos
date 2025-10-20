import express, { Request, Response } from "express";
import router from "./routes";
import cors from "cors";

function crateApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use("/api", router);
    return app;
}
export default crateApp;
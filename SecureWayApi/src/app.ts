import express from "express";
import router from "./routes";
import cors from "cors";

function crateApp() {
    const app = express();

    // --- ATIVAR CORS AQUI ---
    app.use(cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }));
    // -------------------------

    app.use(express.json());
    app.use("/api", router);

    return app;
}

export default crateApp;

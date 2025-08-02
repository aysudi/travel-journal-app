import cors from "cors";
import express from "express";
const app = express();
app.use(express.json());
app.use(cors());
app.get("/", (_, res) => {
    res.send("Server is up and running!");
});
export default app;

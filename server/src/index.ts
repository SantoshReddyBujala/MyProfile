import express from "express";
import cors from "cors";
import { profile } from "./profileData";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/profile", (_req, res) => {
    res.json(profile);
});

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});

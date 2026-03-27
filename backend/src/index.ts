import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Khai báo rõ kiểu cho req và res
app.get("/", (req: Request, res: Response) => {
  res.send("Furniro Backend API is running!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

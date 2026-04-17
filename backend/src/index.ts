import express from "express";
import cors from "cors";
import routes from "./routes";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/error.middleware";

const app = express();

// Middleware cơ bản
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL as string,
      "http://localhost:3000"
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

// Middleware xử lý lỗi tập trung
app.use(globalErrorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend Server đang chạy tại http://localhost:${PORT}`);
});

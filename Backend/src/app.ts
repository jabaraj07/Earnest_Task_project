import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./routes/authRoute";
import taskRoute from "./routes/taskRoute";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/tasks", taskRoute);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Testing API" });
});

app.listen(process.env.PORT, () => {
  console.log(`Express app running on PORT : ${process.env.PORT}`);
});

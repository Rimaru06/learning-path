import express from "express";
import cors from "cors";
import goalRoutes from "./routes/goal.routes.js";
import learningPathRoutes from "./routes/learning-path.routes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "Welcome to the Learning Path API!" });
});

app.use("/api/goals", goalRoutes);
app.use("/api/users", learningPathRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

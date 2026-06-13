import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();
const configuredOrigins = process.env.CORS_ORIGIN?.split(",").map((origin) => origin.trim());

// basic configuration
app.use(express.json({limit:"32kb"}));
app.use(express.urlencoded({extended:true, limit:"32kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// cors configuration
app.use(cors({origin: configuredOrigins?.includes("*") ? true : configuredOrigins || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
   }),
);

// import the routes
import healthCheckRouter from "./routes/healthcheck.routes.js";
app.use("/api/v1/healthcheck", healthCheckRouter);

import authRouter from "./routes/auth.router.js";
app.use("/api/v1/auth", authRouter);

import projectRouter from "./routes/project.routes.js";
app.use("/api/v1/projects", projectRouter);

import taskRouter from "./routes/task.routes.js";
app.use("/api/v1/tasks", taskRouter);

import noteRouter from "./routes/note.routes.js";
app.use("/api/v1/notes", noteRouter);

app.get('/', (req, res) => {
  res.send('welcome here!')
});

app.use(errorHandler);

export default app;

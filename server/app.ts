import { Hono } from "hono";
import { logger } from "hono/logger";
import { serveStatic } from 'hono/bun'
import { expensesRoute } from "./routes/expenses";
import { authRoute } from "./routes/auth";

const app = new Hono();

app.use("*", logger());
 
app.route("/api/expenses", expensesRoute);
app.route("/api/", authRoute);

app.get("*", serveStatic({ root: "./expenses/dist" }));
app.get("*", serveStatic({ path: './expenses/dist/index.html' }))

export default app;
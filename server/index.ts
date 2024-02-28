import expensesRoute from "./app.ts"

const server = Bun.serve({
  fetch: expensesRoute.fetch,
  port: process.env.PORT || 3000,
  hostname: "0.0.0.0"
})

console.log(`Listening on port:${server.port}`);
// import { expenses as expensesTable } from "../db/schema/expenses";
// import { db } from "../db";
// import { desc, eq, sum } from "drizzle-orm"
// import { Hono } from "hono";


// export const expensesRoute = new Hono()
//   .get("/", async (c) => {
//     const expenses = await db.select().from(expensesTable).orderBy(desc(expensesTable.createdAt));
//     return c.json({ expenses: expenses });
//   })
//   .post("/", async (c) => {
//     const body = await c.req.json();

//     const dbExpense = await db
//       .insert(expensesTable)
//       .values({ ...body, userId: "fake-user-id" })
//       .returning();

//     return c.json({ expense: dbExpense }, 201);
//   })
//   .get("/total-amount", async (c) => {
//     const result = await db
//       .select({ value: sum(expensesTable.amount) })
//       .from(expensesTable)
//       .limit(1)
//       .then((r) => r[0]);
//     return c.json({ total: result.value });
//   })
//   .get("/:id{[0-9]+}", async (c) => {
//     const id  = Number.parseInt(c.req.param("id"));
//     const expense = await db.select().from(expensesTable).where(eq(expensesTable.id, id));
//     if (!expense) {
//       return c.json({ error: "Expense not found" }, 404);
//     }
//     return c.json({ expense });
//   })
//   .delete("/:id{[0-9]+}", async (c) => {
//     const id = Number.parseInt(c.req.param("id"));
//     const deletedCount = await db.delete(expensesTable).where(eq(expensesTable.id, id));
//     if (!deletedCount) {
//       return c.json({ error: "Expense not found" }, 404);
//     }
//     return c.json({ success: true });
//   });
import { Hono } from "hono";

import { expenses as expensesTable } from "../db/schema/expenses";
import { db } from "../db";
import { desc, eq, sum, and } from "drizzle-orm";

import { getUser } from "../auth";

type Expense = {
  title: string;
  amount: string;
  date: string;
};

export const expensesRoute = new Hono()
  .get("/", getUser, async (c) => {
    const user = c.var.user;
    const expenses = await db
      .select()
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .orderBy(desc(expensesTable.date));
    return c.json({ expenses });
  })
  .post("/", getUser, async (c) => {
    const user = c.var.user;
    const userId = user.id;
    const expense: Expense = await c.req.json();

    const databaseExpense = await db
      .insert(expensesTable)
      .values({ ...expense, userId })
      .returning()
      .then((rows) => rows[0]);

    return c.json({ expense: databaseExpense }, 201);
  })
  .get("/total-amount", getUser, async (c) => {
    const user = c.var.user;
    const total = await db
      .select({ total: sum(expensesTable.amount) })
      .from(expensesTable)
      .where(eq(expensesTable.userId, user.id))
      .then((rows) => rows[0]);

    return c.json(total);
  })
  .get("/:id{[0-9]+}", getUser, async (c) => {
    const user = c.var.user;
    const id = Number.parseInt(c.req.param("id"));
    const expense = await db
      .select()
      .from(expensesTable)
      .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, user.id)))
      .then((rows) => rows[0]);
    return c.json({ expense });
  })
  .delete("/:id{[0-9]+}", getUser, async (c) => {
    const user = c.var.user;
    const id = Number.parseInt(c.req.param("id"));
    const deletedExpense = await db
      .delete(expensesTable)
      .where(and(eq(expensesTable.id, id), eq(expensesTable.userId, user.id)))
      .returning()
      .then((rows) => rows[0]);

    return c.json({ expense: deletedExpense });
  });
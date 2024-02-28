import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/expenses')({
  component: Expenses,
})

function Expenses() {
  async function getAllExpenses() {
    const res = await fetch("/api/expenses");
    const json =  await res.json();
    console.log(json);
    return json;
  }
  const queryAll = useQuery({
    queryKey: ["all-expenses"],
    queryFn: getAllExpenses,
  });
  type Expense = {
  id: number;
  title: string,
  amount: number,
  date: string, 
}
  return (
  <div>
        {queryAll.error ? (
          <div>{queryAll.error.message}</div>
        ) : queryAll.isPending ? (
          <div className="flex flex-col max-w-96 m-auto animate-pulse">
            Loading ...
          </div>
        ) : (
          <div className="flex flex-col max-w-96 m-auto p-4 border-b border-black">
            {queryAll.data.expenses.map((expense: Expense) => (
              <div key={expense.id}>
                <div>{expense.title} - ${expense.amount}</div>
                {/* <div>{expense.amount}</div> */}
                {/* <div>{expense.date}</div> */}
              </div>
            ))}
          </div>
        )}
      </div>
  );
}
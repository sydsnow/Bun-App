import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from '@tanstack/react-router';

//import { Expense } from "./interfaces/interface.ts";
export const Route = createFileRoute('/_authenticated/')({
  component: HomePage,
})

async function getTotalExpenses() {
  const res = await fetch("/api/expenses/total-amount");
  const json = await res.json();
  return json;
}

function HomePage() {
  
  //const [date, setDate] = useState(Date);

  const query = useQuery({
    queryKey: ["total-amount"],
    queryFn: getTotalExpenses,
  });
  
  return (
    <div className="home-page">
      <div className="w-screen bg-white dark:bg-black text-black dark:text-white">
        <h1 className="text-center text-3xl mb-6">Expenses</h1>
        {query.error ? (
          <div>{query.error.message}</div>
        ) : query.isPending ? (
          <div className="flex flex-col max-w-96 m-auto animate-pulse">
            Total Spent ...
          </div>
        ) : (
          <div className="flex flex-col max-w-96 m-auto p-4 border-b border-black">
            Total Spent {query.data.total}
          </div>
        )}
      </div>
    </div>
  );
}
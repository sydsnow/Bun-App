import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_authenticated/create')({
  component: Create,
})

function Create() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        await createExpense(title, parseFloat(amount));
        // queryClient.invalidateQueries('total-amount');
        setTitle('');
        setAmount('');
        navigate({to: '/expenses'});
    };
    async function createExpense(title: string, amount: number) {
        await fetch('/api/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, amount}),
        });
      }
      
  return (
  <form className="note-form flex flex-col w-200 ml-275" onSubmit={handleSubmit}>
      <input
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border border-gray-300 p-1 m-5"
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        className="border border-gray-300 p-1"
      />
      <button type="submit" className="border border-black p-2 rounded-lg m-3">Add Expense</button>
    </form>
  );
}
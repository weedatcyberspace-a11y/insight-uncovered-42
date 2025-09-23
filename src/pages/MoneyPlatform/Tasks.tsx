import React from 'react';
import { useNavigate } from 'react-router-dom';

type Task = { id: string; title: string; description?: string; rewardUsd: number; completed?: boolean };

const TASKS_KEY = 'money_tasks';
const BALANCE_KEY = 'money_balance';
const COMPLETED_KEY = 'money_completed';

function loadTasks(): Task[] { try { return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]'); } catch { return []; } }
function saveTasks(t: Task[]) { localStorage.setItem(TASKS_KEY, JSON.stringify(t)); }
function loadCompleted(): string[] { try { return JSON.parse(localStorage.getItem(COMPLETED_KEY) || '[]'); } catch { return []; } }
function saveCompleted(c: string[]) { localStorage.setItem(COMPLETED_KEY, JSON.stringify(c)); }

function loadBalance(): number { try { return Number(localStorage.getItem(BALANCE_KEY) || '0'); } catch { return 0; } }
function saveBalance(b: number) { localStorage.setItem(BALANCE_KEY, String(b)); }

const seedTasks: Task[] = [
  { id: 't1', title: 'Complete 1-minute survey', rewardUsd: 0.50, description: 'Quick feedback survey' },
  { id: 't2', title: 'Watch 30s video', rewardUsd: 0.25, description: 'Watch an ad-style clip' },
  { id: 't3', title: 'Install & open app', rewardUsd: 1.00, description: 'Install our demo app and open it once' },
];

const Tasks: React.FC = ()=>{
  const [tasks, setTasks] = React.useState<Task[]>(()=> {
    const t = loadTasks();
    if (t.length === 0) { saveTasks(seedTasks); return seedTasks; }
    return t;
  });
  const [completed, setCompleted] = React.useState<string[]>(()=> loadCompleted());
  const [balance, setBalance] = React.useState<number>(()=> loadBalance());
  const navigate = useNavigate();

  const perform = (task: Task) => {
    if (completed.includes(task.id)) { alert('You already completed this task.'); return; }
    // For prototype: confirm completion, then credit balance
    if (!confirm(`Mark '${task.title}' as completed and earn $${task.rewardUsd.toFixed(2)}?`)) return;
    const nextCompleted = [...completed, task.id];
    setCompleted(nextCompleted);
    saveCompleted(nextCompleted);
    const nextBalance = Number((balance + task.rewardUsd).toFixed(2));
    setBalance(nextBalance);
    saveBalance(nextBalance);
    alert(`You earned $${task.rewardUsd.toFixed(2)}. Your balance is $${nextBalance.toFixed(2)}.`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <div>
          <button onClick={()=>navigate('/platform/wallet')} className="px-3 py-1 bg-indigo-600 text-white rounded">Wallet</button>
        </div>
      </div>

      <ul className="space-y-3">
        {tasks.map((t)=> (
          <li key={t.id} className="p-3 border rounded flex items-center justify-between">
            <div>
              <div className="font-semibold">{t.title}</div>
              <div className="text-sm text-muted">{t.description}</div>
            </div>
            <div className="space-x-2 text-right">
              <div className="font-medium">${t.rewardUsd.toFixed(2)}</div>
              <div>
                <button onClick={()=>perform(t)} disabled={completed.includes(t.id)} className="px-2 py-1 bg-green-600 text-white rounded">{completed.includes(t.id)?'Done':'Perform'}</button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <div>Balance: <strong>${balance.toFixed(2)}</strong></div>
      </div>
    </div>
  );
};

export default Tasks;

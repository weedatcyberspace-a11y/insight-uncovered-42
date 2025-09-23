import React from 'react';
import { useNavigate } from 'react-router-dom';

const BALANCE_KEY = 'money_balance';
const WITHDRAW_KEY = 'money_withdrawals';

function loadBalance(): number { try { return Number(localStorage.getItem(BALANCE_KEY) || '0'); } catch { return 0; } }
function saveBalance(b: number) { localStorage.setItem(BALANCE_KEY, String(b)); }

function loadWithdrawals(): any[] { try { return JSON.parse(localStorage.getItem(WITHDRAW_KEY) || '[]'); } catch { return []; } }
function saveWithdrawals(w: any[]) { localStorage.setItem(WITHDRAW_KEY, JSON.stringify(w)); }

const Wallet: React.FC = ()=>{
  const [balance, setBalance] = React.useState<number>(()=> loadBalance());
  const [withdrawals, setWithdrawals] = React.useState<any[]>(()=> loadWithdrawals());
  const [amount, setAmount] = React.useState('');
  const [dest, setDest] = React.useState('');
  const [userName, setUserName] = React.useState(() => localStorage.getItem('money_user_name') || '');
  const [userEmail, setUserEmail] = React.useState(() => localStorage.getItem('money_user_email') || '');
  const [userId, setUserId] = React.useState(() => {
    const existing = localStorage.getItem('money_user_id');
    if (existing) return existing;
    const id = 'u' + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
    localStorage.setItem('money_user_id', id);
    return id;
  });
  const navigate = useNavigate();

  const request = ()=>{
    const num = Number(amount);
    if (!num || num <= 0) return alert('Enter a valid amount');
    if (num > balance) return alert('Insufficient balance');
    if (!dest) return alert('Enter payout destination (email or PayPal)');
    if (!userName || !userEmail) return alert('Please enter your name and email before requesting a withdrawal');
    // persist user info
    localStorage.setItem('money_user_name', userName);
    localStorage.setItem('money_user_email', userEmail);
    const next = [...withdrawals, { id: Date.now()+'' , amount: num, dest, status: 'pending', createdAt: Date.now() }];
    setWithdrawals(next); saveWithdrawals(next);
    const nextBal = Number((balance - num).toFixed(2));
    setBalance(nextBal); saveBalance(nextBal);
    // Open WhatsApp prefilled message to notify operator about the withdrawal request
    try {
      const reqId = Date.now();
      const text = encodeURIComponent(`Withdrawal request:\nUser ID: ${userId}\nName: ${userName}\nEmail: ${userEmail}\nAmount: $${num.toFixed(2)}\nDestination: ${dest}\nRequest ID: ${reqId}`);
      const wa = `https://wa.me/254114470612?text=${text}`;
      window.open(wa, '_blank');
    } catch (e) {
      // fallback alert
    }
    alert('Withdrawal requested. A WhatsApp chat to the operator has been opened with your user details. (Prototype: no automated payout)');
    setAmount(''); setDest('');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Wallet</h2>
        <div>
          <button onClick={()=>navigate('/platform/tasks')} className="px-3 py-1 bg-indigo-600 text-white rounded">Tasks</button>
        </div>
      </div>

      <div className="mb-4">Balance: <strong>${balance.toFixed(2)}</strong></div>

      <div className="mb-4 p-4 border rounded">
        <div className="mb-3">
          <label className="block text-sm font-medium">Your name</label>
          <input value={userName} onChange={(e)=>setUserName(e.target.value)} className="mt-1 p-2 border w-full" />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-medium">Your email</label>
          <input value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} className="mt-1 p-2 border w-full" />
        </div>
      </div>

      <div className="mb-4 p-4 border rounded">
        <div className="mb-2">Request Withdrawal (prototype)</div>
        <input placeholder="Amount in USD" value={amount} onChange={(e)=>setAmount(e.target.value)} className="p-2 border w-full mb-2" />
        <input placeholder="Payout destination (email, PayPal)" value={dest} onChange={(e)=>setDest(e.target.value)} className="p-2 border w-full mb-2" />
        <div className="flex gap-2">
          <button onClick={request} className="px-3 py-1 bg-green-600 text-white rounded">Request</button>
          <button onClick={()=>{ setAmount(''); setDest(''); }} className="px-3 py-1 bg-gray-200 rounded">Clear</button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Withdrawal Requests</h3>
        <ul className="space-y-2">
          {withdrawals.map(w=> (
            <li key={w.id} className="p-2 border rounded flex items-center justify-between">
              <div>
                <div>{w.dest}</div>
                <div className="text-sm text-muted">{new Date(w.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-3">
                <div>${w.amount.toFixed(2)} — {w.status}</div>
                <button onClick={()=>{
                  const text = encodeURIComponent(`Withdrawal inquiry:\nUser ID: ${userId}\nName: ${userName}\nEmail: ${userEmail}\nAmount: $${w.amount.toFixed(2)}\nDestination: ${w.dest}\nRequest ID: ${w.id}`);
                  const wa = `https://wa.me/254114470612?text=${text}`;
                  window.open(wa, '_blank');
                }} className="px-2 py-1 bg-green-600 text-white rounded">Contact via WhatsApp</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <div className="text-sm text-muted">Note: This is a prototype. To make payouts real, integrate a payment processor (Stripe Connect, PayPal Payouts) and perform server-side verification.</div>
      </div>
    </div>
  );
};

export default Wallet;

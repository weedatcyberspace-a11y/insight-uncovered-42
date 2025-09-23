Perform-to-Earn Prototype (Client-side)

Overview

This prototype implements a simple perform-to-earn platform that runs entirely in the browser and is mounted under `/platform`.

Pages
- `Tasks` (`/platform` or `/platform/tasks`): lists available tasks with USD rewards. Completing a task credits the user's wallet in USD.
- `Wallet` (`/platform/wallet`): shows current balance, lets the user request withdrawals (records stored locally), and lists withdrawal requests.

How it works (prototype)
- Data persistence: Uses `localStorage` keys:
  - `money_tasks` - seeded tasks
  - `money_balance` - current USD balance
  - `money_completed` - completed task ids
  - `money_withdrawals` - withdrawal request records
- Performing tasks: The UI confirms completion and increments balance. There is no server verification in this prototype.
- Withdrawals: Requests are recorded locally with status `pending`. When a withdrawal is requested the prototype opens a WhatsApp chat to `+254114470612` with a prefilled message containing the withdrawal details. The Wallet page collects the user's name and email and those are included in the message. This is a convenience for operators in prototype mode and not an automated payout flow.

Security & compliance
- This is a client-only prototype and is NOT suitable for real payouts. Key missing pieces for production:
  - Server-side earnings ledger to prevent tampering and ensure accurate accounting.
  - Payment processor integration (Stripe, PayPal Payouts) for real transfers.
  - Identity verification (KYC) and anti-fraud measures.
  - Legal and tax compliance (reporting, thresholds, transactional fees).

Next steps to production
1. Add a backend (Node.js + DB or Supabase) to store tasks, balances, and withdrawals securely.
2. Integrate payment processor (Stripe Connect or PayPal Payouts) and server-side payout flows.
3. Add KYC / identity verification for payouts.
4. Implement rate-limiting, activity logs, and fraud detection heuristics.
5. Add admin dashboard to approve/reject withdrawals and monitor metrics.

Developer notes
- To run locally:
  ```powershell
  npm run dev
  # open http://localhost:5173/platform
  ```
- To reset prototype data, clear localStorage keys listed above.

Contact
- This is a demo feature. If you want me to wire this to Supabase + Stripe for a minimal secure MVP, tell me and I’ll add a server-side plan and required changes.

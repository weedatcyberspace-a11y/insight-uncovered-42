Mini Survey Local Prototype

This mini survey app is a lightweight, client-side survey prototype mounted at `/mini`.

Files added
- `src/pages/SurveyMini/List.tsx` - list surveys, open share modal, delete
- `src/pages/SurveyMini/Create.tsx` - create surveys with MC and text questions, optional passcode
- `src/pages/SurveyMini/Respond.tsx` - respondent UI, enforces passcode if set
- `src/pages/SurveyMini/Results.tsx` - aggregate and display responses

How it works
- Persistence: Uses `localStorage` keys `mini_surveys` and `mini_responses`.
- Share: Link and QR generated via `https://api.qrserver.com/v1/create-qr-code/` and can be downloaded.
- Passcode: Optional passcode per survey - enforced client-side only (not secure for production).

Run locally
```powershell
cd C:\Users\Administrator\TUSKHUB\insight-uncovered-42-1
npm run dev
```
Open the Vite URL and navigate to `/mini` or click "Open mini survey site" on `/`.

Next steps / improvements
- Persist surveys/responses to Supabase and enable owner-restricted access.
- Add secure passcode/OTP via server-side check (Supabase functions or server).
- Add charts (bar charts for MC) and CSV export of results.
- Improve UI and accessibility.

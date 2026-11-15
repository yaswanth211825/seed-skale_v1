# Connect the SkaleSeed form to Google Sheets

The form is ready to use this Google Sheet:

`1u4GD45XEdoRJYS0TDsK4LSLKK5HV1SXm5SEPJo2sLGY`

1. Open the sheet and rename the receiving tab to `Leads`.
2. Add this exact header row in row 1: `Submitted at | Name | Email | Phone | Message | Source`.
3. Open **Extensions → Apps Script**.
4. Replace the editor contents with [Code.gs](Code.gs), then save.
5. Choose **Deploy → New deployment → Web app**.
6. Set **Execute as** to **Me**, set **Who has access** to **Anyone**, then deploy. Google will ask you to authorise the script the first time.
7. Copy the Web App URL ending in `/exec`.
8. In [main.js](../main.js), replace `GOOGLE_SHEETS_ENDPOINT = 'XXXXX'` with that URL.

The browser validates input before submission. The Apps Script repeats the same checks, rejects hidden bot-field submissions, rejects unrealistically quick submissions, limits repeated requests from the same email, serialises writes, and protects spreadsheet cells from formula injection.

The website uses `no-cors` for the request because Apps Script Web Apps do not return browser CORS headers. The form treats a completed browser request as sent; server-side validation remains the authoritative check.

const SPREADSHEET_ID = '1u4GD45XEdoRJYS0TDsK4LSLKK5HV1SXm5SEPJo2sLGY';
const SHEET_NAME = 'Leads';
const MAX_SUBMISSIONS_PER_HOUR = 3;
const MINIMUM_FORM_TIME_MS = 2500;

function doPost(event) {
  try {
    if (!event || !event.postData || !event.postData.contents) return reply_({ ok: false, error: 'Invalid request.' });
    const data = JSON.parse(event.postData.contents);
    if (data.website || !validSubmission_(data)) return reply_({ ok: false, error: 'Invalid request.' });

    const cacheKey = 'lead-' + digest_(String(data.email).toLowerCase());
    const cache = CacheService.getScriptCache();
    const attempts = Number(cache.get(cacheKey) || 0);
    if (attempts >= MAX_SUBMISSIONS_PER_HOUR) return reply_({ ok: false, error: 'Please try again later.' });

    const lock = LockService.getScriptLock();
    lock.waitLock(5000);
    try {
      const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
      if (!sheet) throw new Error('Missing Leads sheet');
      sheet.appendRow([
        new Date(),
        safeCell_(data.name),
        safeCell_(String(data.email).toLowerCase()),
        safeCell_(data.phone),
        safeCell_(data.message),
        safeCell_(data.source)
      ]);
      cache.put(cacheKey, String(attempts + 1), 3600);
    } finally {
      lock.releaseLock();
    }
    return reply_({ ok: true });
  } catch (error) {
    console.log(error);
    return reply_({ ok: false, error: 'Unable to save request.' });
  }
}

function doGet() {
  return reply_({ ok: false, error: 'POST requests only.' });
}

function validSubmission_(data) {
  const name = clean_(data.name, 80);
  const email = clean_(data.email, 254);
  const phone = clean_(data.phone, 18);
  const message = clean_(data.message, 1000);
  const startedAt = Number(data.startedAt);
  const age = Date.now() - startedAt;
  return /^[A-Za-zÀ-ÿ .'-]{2,80}$/.test(name) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    /^[+0-9 ()-]{10,18}$/.test(phone) &&
    message.length >= 10 &&
    Number.isFinite(startedAt) && age >= MINIMUM_FORM_TIME_MS && age < 86400000;
}

function clean_(value, maxLength) {
  return String(value || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function safeCell_(value) {
  const clean = clean_(value, 1000);
  return /^[=+\-@]/.test(clean) ? "'" + clean : clean;
}

function digest_(value) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value);
  return bytes.map(function(byte) { return (byte + 256).toString(16).slice(-2); }).join('');
}

function reply_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

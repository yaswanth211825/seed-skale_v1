const WHATSAPP_NUMBER = '919515647977';
const GOOGLE_SHEETS_ENDPOINT = 'XXXXX';
const MINIMUM_FORM_TIME_MS = 2500;

const waLink = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
document.querySelectorAll('[data-year]').forEach((element) => { element.textContent = new Date().getFullYear(); });
document.querySelectorAll('[data-wa-message]').forEach((link) => { link.href = waLink(link.dataset.waMessage); });

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('is-open', !open);
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.motion-rise').forEach((item) => observer.observe(item));

const cleanText = (value, maxLength) => value.replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
const fieldRules = {
  name: { max: 80, message: 'Enter your name using at least 2 letters.' },
  email: { max: 254, message: 'Enter a valid email address.' },
  phone: { max: 18, message: 'Enter a valid phone number.' },
  message: { max: 1000, message: 'Tell us a little more about your business.' }
};

const leadForm = document.querySelector('[data-lead-form]');
if (leadForm) {
  leadForm.elements.startedAt.value = String(Date.now());
  const status = leadForm.querySelector('[data-form-status]');
  const showError = (fieldName, message = '') => {
    const field = leadForm.elements[fieldName];
    const error = document.getElementById(`${fieldName}-error`);
    field.setAttribute('aria-invalid', String(Boolean(message)));
    if (message) field.setAttribute('aria-describedby', `${fieldName}-error`);
    else field.removeAttribute('aria-describedby');
    error.textContent = message;
  };
  Object.keys(fieldRules).forEach((fieldName) => leadForm.elements[fieldName].addEventListener('input', () => showError(fieldName)));

  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = leadForm.querySelector('button[type="submit"]');
    const raw = Object.fromEntries(new FormData(leadForm).entries());
    const data = Object.fromEntries(Object.entries(fieldRules).map(([key, rule]) => [key, cleanText(raw[key] || '', rule.max)]));
    let valid = true;

    Object.entries(fieldRules).forEach(([fieldName, rule]) => {
      const field = leadForm.elements[fieldName];
      const badValue = !data[fieldName] || !field.checkValidity();
      showError(fieldName, badValue ? rule.message : '');
      valid &&= !badValue;
    });
    if (!valid) { status.textContent = 'Please correct the highlighted fields.'; return; }
    if (raw.website || Date.now() - Number(raw.startedAt) < MINIMUM_FORM_TIME_MS) { status.textContent = 'Unable to submit this request.'; return; }
    if (GOOGLE_SHEETS_ENDPOINT === 'XXXXX') { status.textContent = 'The form endpoint is being set up. Please message us on WhatsApp.'; return; }

    submit.disabled = true;
    status.textContent = 'Sending your request…';
    const payload = { ...data, submittedAt: new Date().toISOString(), source: window.location.pathname };
    try {
      await fetch(GOOGLE_SHEETS_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      leadForm.reset();
      leadForm.elements.startedAt.value = String(Date.now());
      status.textContent = 'Thank you. Your request has been sent.';
    } catch (error) {
      status.textContent = 'We could not send your request. Please try again or chat with us on WhatsApp.';
    } finally {
      submit.disabled = false;
    }
  });
}

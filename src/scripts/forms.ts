// Shared form handling for every <form data-form>:
// - field rules via data-rule="name|email|phone|message|text" (+ the usual required attribute)
// - errors appear on blur, update while typing once shown, and all show on submit
// - spam guards: Formspree honeypot (_gotcha) and a minimum time on the page
// - sends to Formspree in the background and shows the in-page success panel
//   (without JS the form still posts normally)

type Field = HTMLInputElement | HTMLTextAreaElement;

const messages = {
  name: (v: string) =>
    v.length < 2 ? 'Please enter your name.' : !/^[\p{L}][\p{L} .'-]{1,79}$/u.test(v) ? 'Please use letters only.' : '',
  email: (v: string) =>
    !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? 'That email does not look right. Example: you@example.com' : '',
  phone: (v: string) => {
    if (!/^\+?[\d\s()-]+$/.test(v)) return 'Please use numbers only. Example: +91 98765 43210';
    const digits = v.replace(/\D/g, '').length;
    return digits < 10 || digits > 15 ? 'Please enter a full number with 10 to 15 digits.' : '';
  },
  message: (v: string) => (v.length < 10 ? 'A little more detail helps us, at least 10 characters.' : ''),
  text: (v: string) => (v.length > 120 ? 'Please keep this under 120 characters.' : ''),
};

const requiredText: Record<string, string> = {
  name: 'Please enter your name.',
  email: 'Please enter your email.',
  phone: 'Please enter your WhatsApp number.',
  message: 'Please tell us a little about your business.',
};

function errorFor(field: Field): string {
  const value = field.value.trim();
  const rule = (field.dataset.rule ?? 'text') as keyof typeof messages;
  if (!value) return field.required ? requiredText[rule] ?? 'This field is required.' : '';
  return messages[rule]?.(value) ?? '';
}

function show(field: Field, message: string) {
  const id = `${field.id}-error`;
  const slot = document.getElementById(id);
  field.setAttribute('aria-invalid', String(Boolean(message)));
  if (message) field.setAttribute('aria-describedby', id);
  else field.removeAttribute('aria-describedby');
  if (slot) slot.textContent = message;
}

document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((form) => {
  const started = Date.now();
  const fields = Array.from(form.querySelectorAll<Field>('[data-rule]'));
  const status = form.querySelector<HTMLElement>('[data-status]');
  const submit = form.querySelector<HTMLButtonElement>('[type="submit"]');
  const success = document.getElementById(form.dataset.success ?? '');
  const label = submit?.innerHTML ?? '';

  fields.forEach((field) => {
    field.addEventListener('blur', () => {
      if (field.value.trim() || field.dataset.touched) show(field, errorFor(field));
      field.dataset.touched = '1';
    });
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') show(field, errorFor(field));
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const invalid = fields.filter((f) => {
      const message = errorFor(f);
      show(f, message);
      return Boolean(message);
    });
    if (invalid.length) {
      if (status) status.textContent = `Please fix ${invalid.length === 1 ? 'the highlighted field' : `the ${invalid.length} highlighted fields`}.`;
      invalid[0].focus();
      return;
    }
    const trap = form.querySelector<HTMLInputElement>('[name="_gotcha"]');
    if (trap?.value || Date.now() - started < 2500) {
      if (status) status.textContent = 'Please wait a moment and try again.';
      return;
    }

    if (submit) {
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      submit.textContent = 'Sending…';
    }
    if (status) status.textContent = '';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.focus();
      }
    } catch {
      if (status) {
        status.innerHTML =
          'We could not send that just now. Please try again, or <a href="https://wa.me/919515647977" target="_blank" rel="noopener">message us on WhatsApp</a>.';
      }
      if (submit) {
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
        submit.innerHTML = label;
      }
    }
  });
});

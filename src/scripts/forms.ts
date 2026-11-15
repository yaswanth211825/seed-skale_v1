// Shared form handling for every <form data-form>:
// - field rules via data-rule="name|email|phone|business|message|text" (+ the usual required attribute)
// - phone: country code picker (default +91) + national number; input is cleaned as you type
//   (digits only, leading zeros and a repeated country code removed) so autofill and paste just work
// - errors appear on blur, update while typing once shown, and all show on submit
// - spam guards: Formspree honeypot (_gotcha) and a minimum time on the page
// - sends to Formspree in the background and shows the in-page success panel
//   (without JS the form still posts normally)

type Field = HTMLInputElement | HTMLTextAreaElement;

const ccOf = (field: Field) =>
  (field.closest('.f-field')?.querySelector<HTMLSelectElement>('[data-cc]')?.value ?? '+91');

/** Digits only, without leading zeros or a repeated country code. */
function cleanPhone(raw: string, cc: string) {
  let digits = raw.replace(/\D/g, '');
  const code = cc.replace(/\D/g, '');
  const national = code === '91' ? 10 : 0;
  // "+91 98765 43210", "919876543210" or "0091…" pasted or autofilled: drop the code.
  digits = digits.replace(/^0+/, '');
  if (national) {
    // An 11th digit after a leading 91 means the code was typed too.
    if (digits.length > national && digits.startsWith(code)) digits = digits.slice(code.length);
  } else if (digits.startsWith(code) && digits.length > 9 && digits.length - code.length >= 6) {
    digits = digits.slice(code.length);
  }
  digits = digits.replace(/^0+/, '');
  return digits.slice(0, national || 14);
}

const EMAIL =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,}$/i;

const rules: Record<string, (v: string, field: Field) => string> = {
  name: (v) => {
    if (!/^[\p{L}][\p{L} .'-]*$/u.test(v)) return 'Please use letters only, like “Ravi Kumar”.';
    if ((v.match(/\p{L}/gu) ?? []).length < 2) return 'Please enter your full name.';
    return v.length > 80 ? 'Please keep your name under 80 characters.' : '';
  },
  email: (v) => {
    if (v.length > 254 || !EMAIL.test(v) || v.includes('..') || /^\.|\.@/.test(v)) {
      return 'Please enter a valid email, like you@example.com.';
    }
    return '';
  },
  phone: (v, field) => {
    const cc = ccOf(field);
    if (/^0/.test(v)) return 'The number cannot start with 0.';
    if (cc === '+91') return /^\d{10}$/.test(v) ? '' : 'Please enter your 10-digit mobile number.';
    return /^\d{6,14}$/.test(v) ? '' : 'Please enter your number without the country code.';
  },
  business: (v) => {
    if (v.length < 2 || !/[\p{L}\p{N}]/u.test(v)) return 'Please enter your business name.';
    return v.length > 120 ? 'Please keep this under 120 characters.' : '';
  },
  message: (v) => {
    if (v.length < 15) return 'A little more detail helps: what you do and what you need (at least 15 characters).';
    return v.length > 1000 ? 'Please keep this under 1000 characters.' : '';
  },
  text: (v) => (v.length > 120 ? 'Please keep this under 120 characters.' : ''),
};

const requiredText: Record<string, string> = {
  name: 'Please enter your name.',
  email: 'Please enter your email.',
  phone: 'Please enter your 10-digit mobile number.',
  business: 'Please enter your business name.',
  message: 'Please tell us about your business.',
};

function errorFor(field: Field): string {
  const value = field.value.trim();
  const rule = field.dataset.rule ?? 'text';
  if (!value) return field.required ? requiredText[rule] ?? 'This field is required.' : '';
  return rules[rule]?.(value, field) ?? '';
}

function show(field: Field, message: string) {
  const id = `${field.id}-error`;
  const slot = document.getElementById(id);
  field.setAttribute('aria-invalid', String(Boolean(message)));
  if (message) field.setAttribute('aria-describedby', id);
  else field.removeAttribute('aria-describedby');
  if (slot) slot.textContent = message;
}

/** Tidy values the way people expect: single spaces, lowercase email, clean phone. */
function normalise(field: Field) {
  const rule = field.dataset.rule;
  if (rule === 'phone') field.value = cleanPhone(field.value, ccOf(field));
  else if (rule === 'email') field.value = field.value.trim().toLowerCase();
  else if (rule === 'name' || rule === 'business') field.value = field.value.replace(/\s+/g, ' ').trim();
  else field.value = field.value.trim();
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
      normalise(field);
      if (field.value || field.dataset.touched) show(field, errorFor(field));
      field.dataset.touched = '1';
    });
    field.addEventListener('input', () => {
      if (field.dataset.rule === 'phone') {
        const clean = cleanPhone(field.value, ccOf(field));
        if (clean !== field.value) field.value = clean;
      }
      if (field.getAttribute('aria-invalid') === 'true') show(field, errorFor(field));
    });
  });

  // Changing the country re-checks the number for that country's length.
  form.querySelectorAll<HTMLSelectElement>('[data-cc]').forEach((select) =>
    select.addEventListener('change', () => {
      const field = select.closest('.f-field')?.querySelector<HTMLInputElement>('[data-rule="phone"]');
      if (!field) return;
      field.placeholder = select.value === '+91' ? '9876543210' : 'Number without country code';
      field.value = cleanPhone(field.value, select.value);
      if (field.dataset.touched) show(field, errorFor(field));
    }),
  );

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    fields.forEach(normalise);
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

    // One ready-to-dial number, e.g. "+91 9876543210".
    form.querySelectorAll<HTMLInputElement>('[data-phone-full]').forEach((full) => {
      const wrap = full.closest('.f-field');
      const num = wrap?.querySelector<HTMLInputElement>('[data-rule="phone"]')?.value ?? '';
      full.value = num ? `${wrap?.querySelector<HTMLSelectElement>('[data-cc]')?.value ?? '+91'} ${num}` : '';
    });

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

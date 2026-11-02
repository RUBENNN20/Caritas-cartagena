const form = document.querySelector('[data-auth-form]');
const status = document.querySelector('[data-status]');
const title = document.querySelector('[data-title]');
const description = document.querySelector('[data-description]');
const confirmField = document.querySelector('[data-confirm-field]');
const submit = document.querySelector('[data-submit]');

let setupRequired = true;

function showStatus(message = '') {
  status.textContent = message;
}

async function request(path, options = {}) {
  const response = await fetch(path, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, credentials: 'same-origin' });
  const body = response.status === 204 ? {} : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || 'No se pudo completar la solicitud.');
  return body;
}

try {
  const auth = await request('/api/auth/status', { method: 'GET' });
  if (auth.authenticated) location.replace('admin.html');
  setupRequired = auth.setupRequired;
  if (!setupRequired) {
    title.textContent = 'Iniciar sesión';
    description.textContent = 'Ingresa con la cuenta administradora para editar el contenido.';
    confirmField.hidden = true;
    confirmField.querySelector('input').disabled = true;
    submit.textContent = 'Entrar al editor';
    form.password.autocomplete = 'current-password';
  }
} catch {
  showStatus('No se pudo conectar con el servidor local. Inicia el sitio con iniciar-sitio.bat.');
  submit.disabled = true;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = form.username.value.trim();
  const password = form.password.value;
  if (setupRequired && password !== form.confirmation.value) return showStatus('Las contraseñas no coinciden.');
  submit.disabled = true;
  showStatus('');
  try {
    await request(setupRequired ? '/api/auth/setup' : '/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) });
    location.replace('admin.html');
  } catch (error) {
    showStatus(error.message);
    submit.disabled = false;
  }
});

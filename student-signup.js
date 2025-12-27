// Client-side validation for student signup
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('studentSignupForm');
  if(!form) return;
  const nameEl = form.querySelector('input[name="name"]');
  const idEl = form.querySelector('input[name="identifier"]');
  const passEl = form.querySelector('input[name="password"]');
  const confEl = form.querySelector('input[name="confirmPassword"]');

  function setError(el,msg){ let next = el.nextElementSibling; if(next && next.classList && next.classList.contains('field-error')) next.remove(); if(msg){ const div = document.createElement('div'); div.className='field-error'; div.style.color='#b91c1c'; div.style.marginTop='6px'; div.textContent=msg; el.insertAdjacentElement('afterend',div); }}

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    setError(nameEl,''); setError(idEl,''); setError(passEl,''); setError(confEl,'');
    let hasError = false;
    if(!nameEl.value.trim()){ setError(nameEl,'Name is required'); hasError = true; }
    if(!idEl.value.trim()){ setError(idEl,'Identifier is required'); hasError = true; }
    if(passEl.value.length < 8){ setError(passEl,'Password must be at least 8 characters'); hasError = true; }
    if(passEl.value !== confEl.value){ setError(confEl,'Passwords do not match'); hasError = true; }
    if(hasError) return;

    // send to backend (production)
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true; submitBtn.textContent = 'Signing up...';
    try{
      const res = await fetch((typeof API_BASE !== 'undefined' && API_BASE ? API_BASE : '') + '/api/auth/student-signup', {
        method: 'POST', headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ name: nameEl.value.trim(), identifier: idEl.value.trim(), password: passEl.value })
      });
      if(!res.ok){ const err = await res.json().catch(()=>({message:'Signup failed'})); throw new Error(err.message || 'Signup failed'); }
      const data = await res.json();
      // After signup, optionally redirect to login or dashboard
      window.location.href = 'student-login.html';
    }catch(err){ setError(confEl, err.message || 'Signup error'); }
    finally{ submitBtn.disabled = false; submitBtn.textContent = 'Sign up'; }
  });
});

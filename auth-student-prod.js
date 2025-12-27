// Student auth handler for production
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('studentLoginForm');
  if(!form) return;
  const userEl = form.querySelector('input[name="username"]');
  const passEl = form.querySelector('input[name="password"]');
  function setError(el,msg){ let next = el.nextElementSibling; if(next && next.classList && next.classList.contains('field-error')) next.remove(); if(msg){ const div = document.createElement('div'); div.className='field-error'; div.style.color='#b91c1c'; div.style.marginTop='6px'; div.textContent=msg; el.insertAdjacentElement('afterend',div); }}
  form.addEventListener('submit', async function(e){ e.preventDefault(); setError(userEl,''); setError(passEl,''); const username=userEl.value.trim(), password=passEl.value.trim(); if(!username){ setError(userEl,'Username required'); return;} if(!password){ setError(passEl,'Password required'); return;} const submitBtn = form.querySelector('button[type="submit"]'); submitBtn.disabled = true; submitBtn.textContent='Signing in...'; try{ const res = await fetch((typeof API_BASE!=='undefined'&&API_BASE?API_BASE:'') + '/api/auth/student', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ username, password }) }); if(!res.ok){ const err = await res.json().catch(()=>({message:'Login failed'})); throw new Error(err.message || 'Login failed'); } const data = await res.json(); localStorage.setItem('authToken', data.token); localStorage.setItem('authUser', JSON.stringify(data.user)); window.location.href = '/dashboard.html'; }catch(err){ setError(passEl, err.message || 'Authentication error'); }finally{ submitBtn.disabled=false; submitBtn.textContent='Sign in'; }});
});

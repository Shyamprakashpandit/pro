// Production auth handler: posts to backend endpoint and handles responses
// Assumes API_BASE is defined in api-config.js
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('schoolLoginForm');
  if(!form) return;
  const emailEl = form.querySelector('input[name="email"]');
  const passEl = form.querySelector('input[name="password"]');

  function setError(el,msg){
    let next = el.nextElementSibling;
    if(next && next.classList && next.classList.contains('field-error')) next.remove();
    if(msg){
      const div = document.createElement('div');
      div.className = 'field-error';
      div.style.color = '#b91c1c';
      div.style.marginTop = '6px';
      div.textContent = msg;
      el.insertAdjacentElement('afterend', div);
    }
  }

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    setError(emailEl,''); setError(passEl,'');
    const email = emailEl.value.trim();
    const password = passEl.value.trim();
    let hasError = false;
    if(!email){ setError(emailEl,'Email is required'); hasError = true; }
    else if(!/^\S+@\S+\.\S+$/.test(email)){ setError(emailEl,'Enter a valid email'); hasError = true; }
    if(!password){ setError(passEl,'Password is required'); hasError = true; }
    if(hasError) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true; submitBtn.textContent = 'Signing in...';

    try{
      const res = await fetch((typeof API_BASE !== 'undefined' && API_BASE ? API_BASE : '') + '/api/auth/school', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if(!res.ok){
        const err = await res.json().catch(()=>({message:'Login failed'}));
        throw new Error(err.message || 'Login failed');
      }
      const data = await res.json();
      // store token
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));
      window.location.href = '/dashboard.html';
    }catch(err){
      setError(passEl, err.message || 'Authentication error');
    }finally{
      submitBtn.disabled = false; submitBtn.textContent = 'Sign in';
    }
  });
});

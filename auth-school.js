// Client-side auth handling for school-login.html using mockApi
document.addEventListener('DOMContentLoaded', function(){
  const form = document.getElementById('schoolLoginForm');
  if(!form || !window.mockApi) return;

  const emailEl = form.querySelector('input[name="email"]');
  const passEl = form.querySelector('input[name="password"]');

  function setError(el,msg){
    // remove any existing
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
    // clear errors
    setError(emailEl,''); setError(passEl,'');
    const email = emailEl.value.trim();
    const password = passEl.value.trim();
    let hasError = false;
    if(!email){ setError(emailEl,'Email is required'); hasError = true; }
    else if(!/^\S+@\S+\.\S+$/.test(email)){ setError(emailEl,'Enter a valid email'); hasError = true; }
    if(!password){ setError(passEl,'Password is required'); hasError = true; }
    if(hasError) return;

    // disable submit
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true; submitBtn.textContent = 'Signing in...';

    try{
      const resp = await window.mockApi.mockAuth('school', email, password);
      // store token (demo) and redirect to dashboard
      localStorage.setItem('authToken', resp.token);
      localStorage.setItem('authUser', JSON.stringify(resp.user));
      // redirect to a fake dashboard (create page)
      window.location.href = 'dashboard.html';
    }catch(err){
      setError(passEl, err.message);
    }finally{
      submitBtn.disabled = false; submitBtn.textContent = 'Sign in';
    }
  });
});

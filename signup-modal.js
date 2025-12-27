// Controls the signup modal: open/close and simple accessibility
document.addEventListener('DOMContentLoaded', function(){
  const modal = document.getElementById('signupModal');
  if(!modal) return;
  const openBtn = document.getElementById('openSignup');
  const closeBtn = document.getElementById('closeSignup');
  const cancelBtn = document.getElementById('cancelSignup');
  const form = document.getElementById('modalSignupForm');
  const firstInput = form.querySelector('input[name="name"]');

  function show(){ modal.style.display='block'; modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; firstInput.focus(); }
  function hide(){ modal.style.display='none'; modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }

  openBtn.addEventListener('click', show);
  closeBtn.addEventListener('click', hide);
  cancelBtn.addEventListener('click', hide);
  modal.querySelector('.modal-backdrop').addEventListener('click', hide);

  // submit delegates to student-signup.js handler by calling its logic; reuse same form submission logic by delegating
  form.addEventListener('submit', function(e){
    e.preventDefault();
    // copy values into the standard signup form handler by posting to the same endpoint used by student-signup.js
    const name = form.name.value.trim();
    const identifier = form.identifier.value.trim();
    const password = form.password.value;
    const confirm = form.confirmPassword.value;

    // basic checks
    if(!name || !identifier || password.length < 8 || password !== confirm){
      alert('Please fill fields correctly. Password must be 8+ and match confirmation.');
      return;
    }

    // perform signup via fetch
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true; submitBtn.textContent = 'Signing up...';
    fetch((typeof API_BASE !== 'undefined' && API_BASE ? API_BASE : '') + '/api/auth/student-signup', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ name, identifier, password })
    }).then(async res => {
      if(!res.ok){ const err = await res.json().catch(()=>({message:'Signup failed'})); throw new Error(err.message||'Signup failed'); }
      return res.json();
    }).then(()=>{
      alert('Signup successful — please sign in.');
      hide();
    }).catch(err=>{
      alert(err.message || 'Signup error');
    }).finally(()=>{ submitBtn.disabled=false; submitBtn.textContent='Sign up'; });
  });
});

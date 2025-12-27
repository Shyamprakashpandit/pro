// Toggle login dropdown on click (for touch devices) and handle outside clicks
document.addEventListener('DOMContentLoaded', function(){
  const dropdowns = document.querySelectorAll('.login-dropdown');
  dropdowns.forEach(dd => {
    const toggle = dd.querySelector('.login-toggle');
    toggle.addEventListener('click', (e)=>{
      e.preventDefault();
      dd.classList.toggle('open');
    });
  });
  // close when clicking outside
  document.addEventListener('click', function(e){
    dropdowns.forEach(dd=>{
      if(!dd.contains(e.target)) dd.classList.remove('open');
    });
  });
});

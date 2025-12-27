// Mobile menu toggle
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
menuBtn.addEventListener('click', ()=>{
    const open = mobileNav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
});

// Dropdown toggle for Features
const dropdown = document.querySelector('.dropdown');
if(dropdown){
    const toggle = dropdown.querySelector('.nav-link');
    toggle.addEventListener('click', (e)=>{
        e.preventDefault();
        dropdown.classList.toggle('open');
    });
    // close when clicking outside
    document.addEventListener('click', (e)=>{
        if(!dropdown.contains(e.target)) dropdown.classList.remove('open');
    });
}

// Smooth scrolling for nav links
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', (e)=>{
        // ignore feature dropdown toggle handled earlier
        if(link.closest('.dropdown')) return;
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const target = document.getElementById(targetId);
        if(target){
            const top = target.getBoundingClientRect().top + window.scrollY - 20;
            window.scrollTo({top,behavior:'smooth'});
        }
        // close mobile nav when clicking
        if(mobileNav.classList.contains('open')) mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
    });
});

// Set year
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// Simple form handler (no backend) — prevent submit
const form = document.querySelector('form');
if(form){
    form.addEventListener('submit', function(e){
        e.preventDefault();
        alert('Thanks! Message not actually sent in demo.');
        this.reset();
    });
}

// Active nav link on scroll
const sections = document.querySelectorAll('main section[id]');
function onScroll(){
    const scrollPos = window.scrollY + 30;
    sections.forEach(section => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.id;
        const link = document.querySelector('.nav-link[href="#'+id+'"]');
        if(link){
            if(scrollPos >= top && scrollPos < bottom){
                document.querySelectorAll('.nav-link').forEach(l=>l.classList.remove('active'));
                link.classList.add('active');
            }
        }
    });
}
window.addEventListener('scroll', onScroll);
window.addEventListener('load', onScroll);

// Header collapse on scroll
(function(){
    const header = document.querySelector('header.container');
    if(!header) return;
    let ticking = false;
    function check(){
        const y = window.scrollY || window.pageYOffset;
        if(y > 40) header.classList.add('scrolled'); else header.classList.remove('scrolled');
        ticking = false;
    }
    window.addEventListener('scroll', ()=>{
        if(!ticking){
            window.requestAnimationFrame(check);
            ticking = true;
        }
    });
})();

// Carousel behavior
(function(){
    const track = document.querySelector('.slides');
    if(!track) return;
    const slides = Array.from(track.children);
    const prevBtn = document.querySelector('.carousel-control.prev');
    const nextBtn = document.querySelector('.carousel-control.next');
    const indicators = Array.from(document.querySelectorAll('.indicator'));
    let index = 0;
    let intervalId = null;
    const slideTo = (i)=>{
        index = (i + slides.length) % slides.length;
        track.style.transform = `translateX(-${index*100}%)`;
        indicators.forEach(ind=>ind.classList.remove('active'));
        if(indicators[index]) indicators[index].classList.add('active');
    };
    const next = ()=> slideTo(index+1);
    const prev = ()=> slideTo(index-1);
    nextBtn.addEventListener('click', next);
    prevBtn.addEventListener('click', prev);
    indicators.forEach((ind,i)=>ind.addEventListener('click', ()=>slideTo(i)));
    // auto play
    const start = ()=> intervalId = setInterval(next, 4000);
    const stop = ()=> { if(intervalId) clearInterval(intervalId); intervalId = null };
    track.parentElement.addEventListener('mouseenter', stop);
    track.parentElement.addEventListener('mouseleave', start);
    // keyboard
    document.addEventListener('keydown', (e)=>{
        if(e.key === 'ArrowLeft') prev();
        if(e.key === 'ArrowRight') next();
    });
    slideTo(0);
    start();
})();

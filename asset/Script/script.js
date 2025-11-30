
// Consolidated JS for menu, reveal, modals, lightbox, cards, sliders
document.addEventListener('DOMContentLoaded', () => {
  const menuOpen = document.querySelector('.menu-icon');
  const menuClose = document.querySelector('.menu-icon-x');
  const navbar = document.querySelector('.navbar');

  if (menuOpen && navbar) {
    menuOpen.addEventListener('click', (e) => {
      e.stopPropagation();
      navbar.classList.add('active');
      menuOpen.style.display = 'none';
      if (menuClose) menuClose.style.display = 'inline-block';
    });
  }
  if (menuClose && navbar) {
    menuClose.addEventListener('click', (e) => {
      e.stopPropagation();
      navbar.classList.remove('active');
      menuClose.style.display = 'none';
      if (menuOpen) menuOpen.style.display = 'inline-block';
    });
  }
  document.addEventListener('click', (e) => {
    if (!navbar) return;
    const t = e.target;
    if (!navbar.contains(t) && !menuOpen?.contains(t) && !menuClose?.contains(t)) {
      navbar.classList.remove('active');
      if (menuClose) menuClose.style.display = 'none';
      if (menuOpen) menuOpen.style.display = 'inline-block';
    }
  });

  // reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add('visible');
          obs.unobserve(ent.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => obs.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  window.openModal = function(id){ const el = document.getElementById('modal-'+id); if(!el) return; el.classList.add('visible'); el.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
  window.closeModal = function(id){ const el = document.getElementById('modal-'+id); if(!el) return; el.classList.remove('visible'); el.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  window.backdropClick = function(evt,id){ if(evt.target.id === 'modal-'+id) closeModal(id); }

  window.openImage = function(src){ const lb = document.getElementById('lightbox'); const img = document.getElementById('lightbox-img'); if(!lb||!img) return; img.src = src; lb.classList.add('visible'); lb.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }
  window.closeLightbox = function(){ const lb = document.getElementById('lightbox'); const img = document.getElementById('lightbox-img'); if(!lb||!img) return; lb.classList.remove('visible'); lb.setAttribute('aria-hidden','true'); img.src=''; document.body.style.overflow=''; }

  document.addEventListener('keydown', (e) => { if(e.key === 'Escape'){ document.querySelectorAll('.modal-backdrop.visible').forEach(m=>{m.classList.remove('visible'); m.setAttribute('aria-hidden','true')}); document.body.style.overflow=''; }});

  // cards ripple & tilt
  (function(){
    const cards = document.querySelectorAll('.card');
    cards.forEach(card=>{
      card.addEventListener('click', function(e){
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = (x - 10) + 'px';
        ripple.style.top = (y - 10) + 'px';
        const size = Math.max(rect.width, rect.height) * 0.2;
        ripple.style.width = ripple.style.height = size + 'px';
        card.appendChild(ripple);
        setTimeout(()=> ripple.remove(), 700);
      });
      card.addEventListener('mousemove', function(e){
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (py - 0.5) * 6;
        const ry = (px - 0.5) * -6;
        card.style.transform = `translateY(-8px) scale(1.02) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave', function(){ card.style.transform = ''; });
    });
  })();

  // image sliders
  (function(){
    document.querySelectorAll('.image-slider').forEach(slider=>{
      const img = slider.querySelector('img');
      const prev = slider.querySelector('.prev-img');
      const next = slider.querySelector('.next-img');
      let images = [];
      try { images = JSON.parse(slider.getAttribute('data-images')||'[]'); } catch(e){ images = []; }
      if(!images.length) return;
      let index = 0;
      if(img && !img.src) img.src = images[0];
      if(prev) prev.addEventListener('click', (ev)=>{ ev.stopPropagation(); index=(index-1+images.length)%images.length; if(img) img.src = images[index]; });
      if(next) next.addEventListener('click', (ev)=>{ ev.stopPropagation(); index=(index+1)%images.length; if(img) img.src = images[index]; });
    });
  })();

  window.showProject = function(projectId){ const projects = document.querySelectorAll('.project-content'); projects.forEach(p=>p.classList.remove('active')); const sel = document.getElementById(projectId); if(sel) sel.classList.add('active'); const projectSection = document.getElementById('project'); if(projectSection) projectSection.scrollIntoView({behavior:'smooth', block:'start'}); };

});

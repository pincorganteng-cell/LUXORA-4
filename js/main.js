(function(){
  "use strict";

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Scroll progress ---------- */
  var progressFill = document.getElementById('progressFill');
  function updateProgress(){
    var doc = document.documentElement;
    var scrollTop = doc.scrollTop || document.body.scrollTop;
    var scrollHeight = (doc.scrollHeight - doc.clientHeight) || 1;
    var pct = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
    if(progressFill) progressFill.style.height = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, {passive:true});
  updateProgress();

  /* ---------- Mobile nav toggle ---------- */
  var lnToggle = document.getElementById('lnToggle');
  var lnList = document.getElementById('lnList');
  if(lnToggle && lnList){
    lnToggle.addEventListener('click', function(){
      lnList.classList.toggle('open');
    });
    lnList.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ lnList.classList.remove('open'); });
    });
  }

  /* ---------- Active section nav highlight ---------- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('.scene'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.ln-list a'));

  function setActive(id){
    navLinks.forEach(function(a){
      a.classList.toggle('active', a.getAttribute('href') === '#' + id);
    });
  }

  if('IntersectionObserver' in window){
    var navObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          setActive(entry.target.id);
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function(s){ navObserver.observe(s); });

    /* ---------- Reveal on scroll ---------- */
    var revealEls = document.querySelectorAll('.reveal');
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function(el){ revealObserver.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- Ring cursor-light hover ---------- */
  document.querySelectorAll('.ring-hover').forEach(function(img){
    img.addEventListener('mousemove', function(e){
      var rect = img.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      img.style.filter = 'drop-shadow(0 12px 30px rgba(212,175,55,.35)) brightness(1.03)';
      img.style.transformOrigin = x + '% ' + y + '%';
    });
    img.addEventListener('mouseleave', function(){
      img.style.filter = '';
    });
  });

  /* ---------- Gold dust particle canvas ---------- */
  var canvas = document.getElementById('gold-dust');
  if(canvas && !reduceMotion){
    var ctx = canvas.getContext('2d');
    var particles = [];
    var W, H, dpr;

    function resize(){
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initParticles(){
      var count = Math.round((W * H) / 26000);
      count = Math.min(count, 70);
      particles = [];
      for(var i = 0; i < count; i++){
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: Math.random() * 1.4 + 0.4,
          speedY: Math.random() * 0.12 + 0.03,
          speedX: (Math.random() - 0.5) * 0.06,
          opacity: Math.random() * 0.5 + 0.15,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function draw(t){
      ctx.clearRect(0, 0, W, H);
      particles.forEach(function(p){
        var flicker = 0.6 + 0.4 * Math.sin(t / 1400 + p.phase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(212,175,55,' + (p.opacity * flicker) + ')';
        ctx.fill();

        p.y -= p.speedY;
        p.x += p.speedX;
        if(p.y < -10){ p.y = H + 10; p.x = Math.random() * W; }
        if(p.x < -10) p.x = W + 10;
        if(p.x > W + 10) p.x = -10;
      });
      requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    requestAnimationFrame(draw);
    window.addEventListener('resize', function(){
      resize();
      initParticles();
    });
  }

})();

document.addEventListener('DOMContentLoaded', () => {

  // ======== STICKY HEADER ========
  const header = document.querySelector('.header');
  function updateHeader() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // ======== MOBILE HAMBURGER ========
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
      hamburger.setAttribute('aria-expanded', nav.classList.contains('open'));
    });

    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ======== ACTIVE NAV LINK ========
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // ======== COUNTER ANIMATION ========
  const counters = document.querySelectorAll('.stat-number, .number, .stat-card .stat-number, .hero-stat-number');

  function animateCounter(el) {
    const raw = el.dataset.target || el.textContent.replace(/[,+Kk]/g, '').trim();
    const target = parseInt(raw, 10) || 0;
    if (target === 0) return;

    const hasSuffix = el.dataset.suffix !== undefined ? el.dataset.suffix : (
      el.textContent.includes('+') ? '+' :
      el.textContent.includes('K') ? 'K' : ''
    );
    const displaySuffix = hasSuffix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toLocaleString() + displaySuffix;
      }
    }
    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => counterObserver.observe(c));

  // ======== FADE-IN ON SCROLL ========
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .fade-up, .scale-in, .stagger-children');

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  fadeElements.forEach(el => fadeObserver.observe(el));

  // ======== TIMELINE SCROLL ANIMATION ========
  const timelineItems = document.querySelectorAll('.timeline-item');

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  timelineItems.forEach(item => timelineObserver.observe(item));

  // ======== FAQ ACCORDION ========
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) {
          item.classList.add('open');
        }
      });
      question.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    }
  });

  // ======== GALLERY LIGHTBOX ========
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  let lastFocusedElement = null;

  if (lightbox && lightboxImg) {
    function openLightbox(src) {
      lastFocusedElement = document.activeElement;
      lightboxImg.src = src;
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lightbox.focus();
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lightboxImg.src = '';
      if (lastFocusedElement) {
        lastFocusedElement.focus();
      }
    }

    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          openLightbox(img.src);
        }
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          item.click();
        }
      });
    });

    document.querySelector('.lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        closeLightbox();
      }
    });
    lightbox.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
      }
    });
  }

  // ======== DONATION AMOUNT SELECTION ========
  const donationAmounts = document.querySelectorAll('.donation-amount');
  const donationAmountInput = document.getElementById('donation-amount');
  const customAmountContainer = document.getElementById('custom-amount-container');
  const customAmountInput = document.getElementById('custom-amount');

  donationAmounts.forEach(btn => {
    btn.addEventListener('click', () => {
      donationAmounts.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const amount = btn.dataset.amount;
      if (amount === 'custom') {
        customAmountContainer.style.display = 'block';
        donationAmountInput.value = '';
        if (customAmountInput) customAmountInput.focus();
      } else {
        customAmountContainer.style.display = 'none';
        donationAmountInput.value = amount;
        if (customAmountInput) customAmountInput.value = '';
      }
    });
  });

  if (customAmountInput) {
    customAmountInput.addEventListener('input', () => {
      donationAmountInput.value = customAmountInput.value;
    });
  }

  // ======== FREQUENCY TOGGLE ========
  const frequencyOptions = document.querySelectorAll('.frequency-option');
  const frequencyInput = document.getElementById('donation-frequency');
  frequencyOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      frequencyOptions.forEach(o => {
        o.style.borderColor = 'var(--border)';
        o.style.background = 'transparent';
        o.style.color = 'var(--text-light)';
        o.style.fontWeight = '600';
      });
      opt.style.borderColor = 'var(--secondary)';
      opt.style.background = 'var(--secondary)';
      opt.style.color = 'var(--primary-dark)';
      opt.style.fontWeight = '700';
      frequencyInput.value = opt.dataset.frequency;
    });
  });

  // ======== FORM SUBMISSION HANDLER ========
  async function handleFormSubmit(e, endpoint, successMessage) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        showFormFeedback(form, result.message || successMessage, 'success');
        form.reset();
        donationAmounts?.forEach(b => b.classList.remove('selected'));
        if (customAmountContainer) customAmountContainer.style.display = 'none';
        if (donationAmountInput) donationAmountInput.value = '';
      } else {
        showFormFeedback(form, result.message || 'Something went wrong. Please try again.', 'error');
      }
    } catch (err) {
      showFormFeedback(form, 'Network error. Please check your connection and try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  function showFormFeedback(form, message, type) {
    const existing = form.querySelector('.form-feedback');
    if (existing) existing.remove();

    const feedback = document.createElement('div');
    feedback.className = `form-feedback form-feedback-${type}`;
    feedback.textContent = message;
    feedback.setAttribute('role', 'alert');
    form.appendChild(feedback);

    setTimeout(() => feedback.remove(), 8000);
  }

  // Attach handlers to all forms
  const contactForm = document.querySelector('form[action*="/api/contact"]');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => handleFormSubmit(e, contactForm.action, 'Thank you for reaching out!'));
  }

  const volunteerForm = document.querySelector('form[action*="/api/volunteer"]');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', (e) => handleFormSubmit(e, volunteerForm.action, 'Application submitted!'));
  }

  const partnerForm = document.querySelector('form[action*="/api/partner"]');
  if (partnerForm) {
    partnerForm.addEventListener('submit', (e) => handleFormSubmit(e, partnerForm.action, 'Inquiry submitted!'));
  }

  const newsletterForm = document.querySelector('form[action*="/api/newsletter"]');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => handleFormSubmit(e, newsletterForm.action, 'Subscribed!'));
  }

  const donationForm = document.getElementById('donation-form');
  if (donationForm) {
    donationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(donationForm);
      const data = Object.fromEntries(formData.entries());
      const submitBtn = donationForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      if (!data.amount && !data.custom_amount) {
        showFormFeedback(donationForm, 'Please select or enter a donation amount.', 'error');
        return;
      }

      const finalAmount = data.amount || data.custom_amount;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing...';

      try {
        const response = await fetch(donationForm.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            note: data.note || '',
            amount: parseFloat(finalAmount),
            frequency: data.frequency || 'one-time',
          }),
        });
        const result = await response.json();

        if (response.ok) {
          showFormFeedback(donationForm, `Payment intent created! Complete your donation via the payment popup.`, 'success');
          donationForm.reset();
          donationAmounts?.forEach(b => b.classList.remove('selected'));
          if (customAmountContainer) customAmountContainer.style.display = 'none';
          if (donationAmountInput) donationAmountInput.value = '';
        } else {
          showFormFeedback(donationForm, result.message || 'Payment failed. Please try again.', 'error');
        }
      } catch (err) {
        showFormFeedback(donationForm, 'Network error. Please try again.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // ======== SMOOTH SCROLL FOR ANCHOR LINKS ========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ======== HERO SLIDESHOW ========
  const heroSlideshow = document.getElementById('heroSlideshow');
  if (heroSlideshow) {
    const slides = heroSlideshow.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    const totalSlides = slides.length;

    function nextSlide() {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % totalSlides;
      slides[currentSlide].classList.add('active');
    }

    if (totalSlides > 1) {
      setInterval(nextSlide, 6000);
    }
  }

  // ======== HERO PARALLAX ========
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      const slideshow = hero.querySelector('.hero-slideshow');
      if (slideshow && scrolled < hero.offsetHeight) {
        slideshow.style.transform = `translateY(${scrolled * 0.25}px)`;
      }
    }, { passive: true });
  }

  // ======== VIDEO MODAL ========
  const videoModal = document.getElementById('videoModal');
  const videoBtn = document.getElementById('heroVideoBtn');
  const videoClose = document.getElementById('videoModalClose');
  const videoEl = videoModal ? videoModal.querySelector('video') : null;

  function openVideoModal() {
    if (videoModal && videoEl) {
      videoModal.classList.add('open');
      videoModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      videoEl.currentTime = 0;
      videoEl.play().catch(() => {});
    }
  }

  function closeVideoModal() {
    if (videoModal && videoEl) {
      videoModal.classList.remove('open');
      videoModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      videoEl.pause();
      videoEl.currentTime = 0;
    }
  }

  if (videoBtn && videoModal) {
    videoBtn.addEventListener('click', openVideoModal);
  }

  if (videoClose && videoModal) {
    videoClose.addEventListener('click', closeVideoModal);
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && videoModal.classList.contains('open')) {
        closeVideoModal();
      }
    });
  }

  // ======== VIDEO SHOWCASE LIGHTBOX ========
  const showcaseModal = document.getElementById('showcaseVideoModal');
  const showcaseClose = document.getElementById('showcaseVideoClose');
  const showcaseVideoEl = showcaseModal ? showcaseModal.querySelector('video') : null;

  function openShowcaseVideo(src) {
    if (showcaseModal && showcaseVideoEl) {
      showcaseVideoEl.querySelector('source').src = src;
      showcaseVideoEl.load();
      showcaseModal.classList.add('open');
      showcaseModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      showcaseVideoEl.play().catch(() => {});
    }
  }

  function closeShowcaseVideo() {
    if (showcaseModal && showcaseVideoEl) {
      showcaseModal.classList.remove('open');
      showcaseModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      showcaseVideoEl.pause();
      showcaseVideoEl.currentTime = 0;
    }
  }

  document.querySelectorAll('.video-showcase-hero, .showcase-card').forEach(el => {
    el.addEventListener('click', () => {
      const src = el.dataset.videoSrc;
      if (src) openShowcaseVideo(src);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  if (showcaseClose) {
    showcaseClose.addEventListener('click', closeShowcaseVideo);
  }

  if (showcaseModal) {
    showcaseModal.addEventListener('click', (e) => {
      if (e.target === showcaseModal) closeShowcaseVideo();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && showcaseModal.classList.contains('open')) {
        closeShowcaseVideo();
      }
    });
  }

  // ======== PROGRESS BAR ANIMATION ========
  const progressBars = document.querySelectorAll('.progress-fill');
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.dataset.width || entry.target.style.width || '75%';
        entry.target.style.width = '0%';
        setTimeout(() => {
          entry.target.style.width = width;
        }, 200);
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  progressBars.forEach(bar => progressObserver.observe(bar));

  // ======== GALLERY RENDERER (FIXED PAGINATION) ========
  function renderGallery(containerId, category, itemsPerPage = 24) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (typeof MEDIA_CATALOG === 'undefined' || !MEDIA_CATALOG[category]) {
      container.innerHTML = '<p class="gallery-empty">Media catalog not available.</p>';
      return;
    }

    const items = MEDIA_CATALOG[category];
    if (!items || items.length === 0) {
      container.innerHTML = '<p class="gallery-empty">No media in this category.</p>';
      return;
    }

    const totalPages = Math.ceil(items.length / itemsPerPage);

    // Store state on the container element itself for reliable access
    container._galleryState = { currentPage: 0, totalPages, items, itemsPerPage, containerId, category };

    function renderPage() {
      const state = container._galleryState;
      const page = state.currentPage;
      const start = page * state.itemsPerPage;
      const end = Math.min(start + state.itemsPerPage, state.items.length);
      const pageItems = state.items.slice(start, end);

      let html = '<div class="gallery-grid" role="list" aria-label="' + category + ' gallery">';
      pageItems.forEach((item) => {
        const alt = item.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ').replace(/\s+/g, ' ').trim();
        if (item.video) {
          html += `<div class="gallery-item video-item" data-video="${item.name}" role="listitem">
            <div class="gallery-img-wrapper">
              <video preload="none" playsinline>
                <source src="images/${item.name}" type="video/mp4">
              </video>
              <div class="video-play-btn" aria-label="Play video" role="button" tabindex="0">
                <span>&#9654;</span>
              </div>
            </div>
          </div>`;
        } else {
          const safeAlt = alt.replace(/"/g, '&quot;');
          const thumbName = 'images/thumbnails/' + item.name.replace(/[/\\]/g, '-').replace(/\.[^.]+$/, '.jpg');
          html += `<div class="gallery-item" role="listitem" tabindex="0">
            <div class="gallery-img-wrapper">
              <img src="${thumbName}" alt="${safeAlt}" loading="lazy"
                data-full="images/${item.name}"
                onerror="this.src='images/${item.name}';this.onerror=function(){this.parentElement.innerHTML='<div class=\\'gallery-img-fallback\\'></div>'}"
                style="background:var(--bg);">
              <div class="overlay" aria-hidden="true">&#128269;</div>
            </div>
          </div>`;
        }
      });
      html += '</div>';

      if (state.totalPages > 1) {
        html += '<div class="gallery-pagination">';
        html += '<button class="btn btn-sm btn-outline pagination-prev" aria-label="Previous page">Previous</button>';
        html += '<span class="pagination-info">Page ' + (page + 1) + ' of ' + state.totalPages + ' (' + state.items.length + ' items)</span>';
        html += '<button class="btn btn-sm btn-outline pagination-next" aria-label="Next page">Next</button>';
        html += '</div>';
      }

      container.innerHTML = html;

      // Attach pagination event listeners
      const prevBtn = container.querySelector('.pagination-prev');
      const nextBtn = container.querySelector('.pagination-next');

      if (prevBtn) {
        prevBtn.disabled = page === 0;
        prevBtn.addEventListener('click', () => {
          if (container._galleryState.currentPage > 0) {
            container._galleryState.currentPage--;
            renderPage();
          }
        });
      }

      if (nextBtn) {
        nextBtn.disabled = page >= state.totalPages - 1;
        nextBtn.addEventListener('click', () => {
          if (container._galleryState.currentPage < container._galleryState.totalPages - 1) {
            container._galleryState.currentPage++;
            renderPage();
          }
        });
      }

      // Attach click and keyboard handlers for dynamically created gallery items
      container.querySelectorAll('.gallery-item img').forEach(img => {
        const item = img.closest('.gallery-item');
        if (item) {
          item.addEventListener('click', () => {
            const fullSrc = img.dataset.full || img.src;
            openLightboxFromSrc(fullSrc);
          });
          item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              item.click();
            }
          });
        }
      });

      container.querySelectorAll('.video-item .video-play-btn').forEach(btn => {
        function playVideo() {
          const videoItem = btn.closest('.video-item');
          const video = videoItem.querySelector('video');
          if (video && video.paused) {
            video.play();
            btn.style.display = 'none';
          }
        }
        btn.addEventListener('click', playVideo);
        btn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            playVideo();
          }
        });
      });
    }

    renderPage();
  }

  function openLightboxFromSrc(src) {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lightbox-img');
    if (lb && lbImg) {
      lastFocusedElement = document.activeElement;
      lbImg.src = src;
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lb.focus();
    }
  }

  window.openLightbox = openLightboxFromSrc;

  // ======== VIDEO GALLERY (DEDUPLICATED) ========
  function renderVideoGrid(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (typeof MEDIA_CATALOG === 'undefined' || typeof CATEGORY_ORDER === 'undefined') {
      container.innerHTML = '<p class="gallery-empty">Media catalog not available.</p>';
      return;
    }

    const seen = new Set();
    const allVideos = [];
    for (const cat of CATEGORY_ORDER) {
      const items = MEDIA_CATALOG[cat] || [];
      items.forEach(item => {
        if (item.video && !seen.has(item.name)) {
          seen.add(item.name);
          allVideos.push({ ...item, category: cat });
        }
      });
    }

    if (allVideos.length === 0) {
      container.innerHTML = '<p class="gallery-empty">No videos available.</p>';
      return;
    }

    let html = '<div class="video-grid">';
    allVideos.forEach((video) => {
      const alt = video.name.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ').replace(/\s+/g, ' ').trim();
      html += '<div class="video-card">';
      html += '<div class="video-wrapper">';
      html += '<video controls preload="metadata">';
      html += '<source src="images/' + video.name + '" type="video/mp4">';
      html += '</video>';
      html += '</div>';
      html += '<div class="video-info"><p>' + alt + '</p></div>';
      html += '</div>';
    });
    html += '</div>';
    container.innerHTML = html;

    // Add error fallback for video elements
    container.querySelectorAll('video').forEach(v => {
      v.addEventListener('error', function() {
        const wrapper = this.closest('.video-card');
        if (wrapper) {
          wrapper.innerHTML = '<div class="video-fallback"><p>Video unavailable</p></div>';
        }
      });
    });
  }

  // Auto-render galleries on page load
  document.querySelectorAll('[data-gallery-category]').forEach(el => {
    const category = el.dataset.galleryCategory;
    const itemsPerPage = parseInt(el.dataset.itemsPerPage, 10) || 24;
    renderGallery(el.id, category, itemsPerPage);
  });

  document.querySelectorAll('[data-video-gallery]').forEach(el => {
    renderVideoGrid(el.id);
  });

  // ======== BEFORE/AFTER COMPARISON ========
  document.querySelectorAll('.before-after').forEach(container => {
    const slider = container.querySelector('.ba-slider');
    const before = container.querySelector('.ba-before');
    if (slider && before) {
      slider.addEventListener('input', () => {
        before.style.clipPath = `inset(0 ${100 - slider.value}% 0 0)`;
      });
    }
  });

});

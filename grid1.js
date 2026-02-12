// ============================================================================
// ANIMATIONS & INTERACTIVE SECTIONS – Clean & Optimized (2025 style)
// All original behaviors preserved
// ============================================================================

// ── Shared Utilities ────────────────────────────────────────────────────────
function throttle(fn, limit = 100) {
  let wait = false;
  return (...args) => {
    if (!wait) {
      fn(...args);
      wait = true;
      setTimeout(() => { wait = false; }, limit);
    }
  };
}

let scrollTimeout;
const glass = document.querySelector('.services-main');

window.addEventListener('scroll', () => {
  glass.style.backdropFilter = 'none';
  glass.style.webkitBackdropFilter = 'none';

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    glass.style.backdropFilter = 'blur(4px)';
    glass.style.webkitBackdropFilter = 'blur(4px)';
  }, 150); // re-enable 150ms after scroll stops
}, { passive: true });

function rafThrottle(fn) {
  let ticking = false;
  return (...args) => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        fn(...args);
        ticking = false;
      });
    }
  };
}

// ── 1. Service Hero Title Animation ─────────────────────────────────────────
function initServiceHeroAnimation() {
  const hero = document.querySelector(".service-hero");
  const title = document.querySelector(".service-hero h2");

  if (!hero || !title) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        title.classList.toggle("animate-in", entry.isIntersecting);
      });
    },
    { threshold: 0.4 }
  );

  observer.observe(hero);
}

// ── 2. Service Cards – Staggered Entrance + Responsive Direction ────────────
function initServiceCardsAnimation() {
  const cards = document.querySelectorAll(".service-card");
  if (!cards.length) return;

  function getDeviceType() {
    const w = window.innerWidth;
    if (w >= 1024) return "laptop";
    if (w >= 768)  return "tablet";
    return "mobile";
  }

  function applyEntranceClasses() {
    const device = getDeviceType();

    cards.forEach((card, idx) => {
      const i = idx + 1;

      // Clear previous classes
      card.classList.remove("from-left", "from-right", "from-top", "from-bottom", "delay-1s");

      if (device === "laptop") {
        if ([1,2,5,6].includes(i)) card.classList.add("from-left");
        else                         card.classList.add("from-right");

        if ([1,4,5,8].includes(i)) card.classList.add("delay-1s");
      }
      else if (device === "tablet") {
        if ([1,2,5,6].includes(i)) card.classList.add("from-left");
        else                       card.classList.add("from-right");
      }
      else { // mobile
        if ([1,3,5,7].includes(i)) card.classList.add("from-left");
        else                       card.classList.add("from-right");
      }
    });
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle("show", entry.isIntersecting);
      });
    },
    {
      threshold: 0.25,
      rootMargin: "0px 0px -80px 0px"
    }
  );

  cards.forEach(card => observer.observe(card));

  // Initial setup + resize handling
  applyEntranceClasses();
  window.addEventListener("resize", throttle(applyEntranceClasses, 200));
}

// ── 3. Tools Carousel (infinite loop + dots + auto + pause on hover) ────────
function initToolsCarousel() {
  const track        = document.getElementById("toolsTrack");
  const dotsContainer = document.getElementById("toolsDots");
  const prevBtn      = document.getElementById("toolsPrev");
  const nextBtn      = document.getElementById("toolsNext");

  if (!track || !dotsContainer) return;

  let items = Array.from(track.children);
  const totalRealItems = items.length;

  // Clone items once for seamless loop
  items.forEach(item => track.appendChild(item.cloneNode(true)));

  let currentIndex = 0;
  let itemWidth = 0;
  let autoInterval;
  let isPaused = false;

  function calculateItemWidth() {
    const firstItem = track.children[0];
    if (!firstItem) return;

    const rect = firstItem.getBoundingClientRect();
    const style = getComputedStyle(firstItem);
    const margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight);

    itemWidth = rect.width + margin;

    // Force position without animation during resize
    track.style.transition = "none";
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  }

  function updateDots() {
    document.querySelectorAll(".carousel-dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === (currentIndex % totalRealItems));
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    track.style.transition = "transform 0.6s ease-in-out";
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    updateDots();
    resetAuto();
  }

  function slideNext() {
    if (isPaused) return;
    currentIndex++;
    track.style.transition = "transform 0.6s ease-in-out";
    track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

    if (currentIndex >= totalRealItems) {
      setTimeout(() => {
        track.style.transition = "none";
        currentIndex = 0;
        track.style.transform = "translateX(0)";
      }, 600);
    }
    updateDots();
  }

  function slidePrev() {
    if (isPaused) return;

    if (currentIndex === 0) {
      track.style.transition = "none";
      currentIndex = totalRealItems;
      track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

      requestAnimationFrame(() => {
        currentIndex--;
        track.style.transition = "transform 0.6s ease-in-out";
        track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
      });
    } else {
      currentIndex--;
      track.style.transition = "transform 0.6s ease-in-out";
      track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    }
    updateDots();
  }

  function startAuto() {
    clearInterval(autoInterval);
    autoInterval = setInterval(slideNext, 3000);
  }

  function resetAuto() {
    clearInterval(autoInterval);
    startAuto();
  }

  // Create dots (only once)
  for (let i = 0; i < totalRealItems; i++) {
    const dot = document.createElement("div");
    dot.classList.add("carousel-dot");
    if (i === 0) dot.classList.add("active");
    dot.onclick = () => goToSlide(i);
    dotsContainer.appendChild(dot);
  }

  // Controls
  nextBtn?.addEventListener("click", () => { slideNext(); resetAuto(); });
  prevBtn?.addEventListener("click", () => { slidePrev(); resetAuto(); });

  // Hover pause – desktop only
  if (window.innerWidth > 1024) {
    const container = track.parentElement;
    container.addEventListener("mouseenter", () => {
      isPaused = true;
      clearInterval(autoInterval);
    });
    container.addEventListener("mouseleave", () => {
      isPaused = false;
      startAuto();
    });
  }

  // Global controls (for tooltip interaction)
  window.startToolsAutoSlide  = startAuto;
  window.stopToolsAutoSlide   = () => { isPaused = true; clearInterval(autoInterval); };
  window.resumeToolsAutoSlide = () => { isPaused = false; startAuto(); };

  // Init
  calculateItemWidth();
  window.addEventListener("resize", throttle(calculateItemWidth, 150));
  startAuto();
}

// ── 4. Tools Tooltip System ─────────────────────────────────────────────────
function initToolsTooltip() {
  const tooltip = document.getElementById("globalTooltip");
  const items   = document.querySelectorAll(".tool-item");

  if (!tooltip || !items.length) return;

  let hideTimer;

  const isTouch = () => window.innerWidth <= 1024;

  function positionTooltip(item) {
    const rect = item.getBoundingClientRect();
    let left = rect.left + rect.width / 2;
    const tooltipW = tooltip.offsetWidth;
    const screenW = window.innerWidth;

    // Keep tooltip inside viewport
    if (left - tooltipW / 2 < 10)           left = tooltipW / 2 + 10;
    if (left + tooltipW / 2 > screenW - 10) left = screenW - tooltipW / 2 - 10;

    tooltip.style.left = `${left}px`;
    tooltip.style.top  = `${rect.top - 12}px`;

    // Arrow position
    const arrowLeft = (rect.left + rect.width / 2) - (left - tooltipW / 2);
    tooltip.style.setProperty("--arrow-left", `${arrowLeft}px`);

    tooltip.style.opacity = "1";
  }

  function show(item) {
    clearTimeout(hideTimer);
    window.stopToolsAutoSlide?.();

    tooltip.textContent = item.dataset.tooltip;
    positionTooltip(item);

    if (isTouch()) {
      hideTimer = setTimeout(() => {
        hide();
        setTimeout(window.resumeToolsAutoSlide, 1000);
      }, 5000);
    }
  }

  function hide() {
    clearTimeout(hideTimer);
    tooltip.style.opacity = "0";
  }

  items.forEach(item => {
    // Desktop → hover
    item.addEventListener("mouseenter", () => {
      if (!isTouch()) show(item);
    });

    item.addEventListener("mouseleave", () => {
      if (!isTouch()) hide();
    });

    // Touch → click
    item.addEventListener("click", e => {
      e.stopPropagation();
      show(item);
    });
  });

  // Click anywhere → hide
  document.addEventListener("click", hide);
}

// ── 5. Active Tool Highlight on Click (5s) ──────────────────────────────────
function initActiveToolHighlight() {
  const items = document.querySelectorAll(".tool-item");
  let timeoutId = null;

  items.forEach(item => {
    item.addEventListener("click", e => {
      e.stopPropagation();

      items.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => item.classList.remove("active"), 5000);
    });
  });
}

// ── 6. Project Grid – Responsive Staggered Animation ────────────────────────
function initProjectGridAnimation() {
  const cards = document.querySelectorAll(".project-card");
  if (!cards.length) return;

  function getDevice() {
    const w = window.innerWidth;
    if (w <= 360) return "mobile-small";
    if (w <= 768) return "mobile";
    if (w <= 1024) return "tablet";
    return "laptop";
  }

  function applyStaggerClasses() {
    const device = getDevice();

    cards.forEach((card, idx) => {
      card.classList.remove("from-left", "from-right", "from-bottom", "show");

      if (device === "laptop") {
        const pos = idx % 3;
        if      (pos === 0) card.classList.add("from-left");
        else if (pos === 1) card.classList.add("from-bottom");
        else                card.classList.add("from-right");
      }
      else if (device === "tablet") {
        const pos = idx % 2;
        if (pos === 0) card.classList.add("from-left");
        else           card.classList.add("from-right");
      }
      else { // mobile
        card.classList.add(idx % 2 === 0 ? "from-left" : "from-right");
      }
    });
  }

  function checkVisibility() {
    const trigger = window.innerHeight * 0.85;

    cards.forEach(card => {
      const rect = card.getBoundingClientRect();
      card.classList.toggle("show", rect.top < trigger && rect.bottom > 0);
    });
  }

  // Throttled scroll
  window.addEventListener("scroll", rafThrottle(checkVisibility));

  // Resize → re-apply classes & check
  window.addEventListener("resize", throttle(() => {
    applyStaggerClasses();
    checkVisibility();
  }, 200));

  // Init
  applyStaggerClasses();
  checkVisibility();
}

// ── 7. Animation Thumbnails – Hover / Tap Video Preview ─────────────────────

  document.addEventListener('DOMContentLoaded', function() {
  // Get all video cards
  const videoCards = document.querySelectorAll('.animations-card');
  
  // Get modal elements
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  const modalTitle = document.getElementById('modalTitle');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  
  // Store scroll position when modal opens
  let scrollPosition = 0;
  
  // Initialize each video card
  videoCards.forEach(card => {
      const thumbnail = card.querySelector('.animations-thumbnail');
      const previewVideo = card.querySelector('.Thumb-video');
      const videoSrc = card.getAttribute('data-video');
      const videoTitle = card.getAttribute('data-title');
      
      // Set the preview video source
      if (previewVideo && videoSrc) {
          previewVideo.src = videoSrc;
      }
      
      // Desktop hover behavior
      thumbnail.addEventListener('mouseenter', function() {
          if (previewVideo) {
              previewVideo.currentTime = 0;
              previewVideo.play().catch(error => {
                  console.log('Preview video play failed:', error);
              });
          }
      });
      
      thumbnail.addEventListener('mouseleave', function() {
          if (previewVideo) {
              previewVideo.pause();
              previewVideo.currentTime = 0;
          }
      });
      
      // Click to open modal
      card.addEventListener('click', function() {
          openModal(videoSrc, videoTitle);
      });
  });
  
  // Open modal function
  function openModal(videoSrc, videoTitle) {
      // Store current scroll position
      scrollPosition = window.scrollY;
      
      // Set modal video source and title
      modalVideo.src = videoSrc;
      modalTitle.textContent = videoTitle;
      
      // Show modal
      modal.classList.add('active');
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
      
      // Play the video
      modalVideo.currentTime = 0;
      modalVideo.play().catch(error => {
          console.log('Modal video play failed:', error);
      });
  }
  
  // Close modal function
  function closeModal() {
      // Hide modal
      modal.classList.remove('active');
      
      // Pause and reset video
      modalVideo.pause();
      modalVideo.currentTime = 0;
      
      // Restore body scroll
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Restore scroll position
      window.scrollTo(0, scrollPosition);
  }
  
  // Close modal on close button click
  modalCloseBtn.addEventListener('click', closeModal);
  
  // Close modal when clicking outside the modal content
  modal.addEventListener('click', function(event) {
      if (event.target === modal) {
          closeModal();
      }
  });
  
  // Close modal on ESC key press
  document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && modal.classList.contains('active')) {
          closeModal();
      }
  });
  
  // Handle video end event
  modalVideo.addEventListener('ended', function() {
      // Optional: You can add behavior when video ends
      // For example, show related videos or replay button
  });
});


// ── Main Initialization ─────────────────────────────────────────────────────
function initializeAllAnimations() {
  initServiceHeroAnimation();
  initServiceCardsAnimation();
  initToolsCarousel();
  initToolsTooltip();
  initActiveToolHighlight();
  initProjectGridAnimation();
  initAnimationThumbnails();
  truncateVideoTitles();
  initVideoModals();
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAllAnimations);
} else {
  initializeAllAnimations();
}

//=============== contact page===================================//


      // ============================================
        // 1. TYPEWRITER EFFECT
        // ============================================
        const typewriterWords = ["Something Creative", "Amazing Websites", "Visual Experiences"];
        let currentWordIndex = 0;
        let currentCharIndex = 0;
        let isDeletingText = false;
        const typingSpeed = 100;
        const deletingSpeed = 50;
        const pauseBetweenWords = 2000;
        const typewriterElement = document.getElementById('hero-typewriter-text');

        function animateTypewriter() {
            const currentWord = typewriterWords[currentWordIndex];
            
            if (isDeletingText) {
                typewriterElement.textContent = currentWord.substring(0, currentCharIndex - 1);
                currentCharIndex--;
            } else {
                typewriterElement.textContent = currentWord.substring(0, currentCharIndex + 1);
                currentCharIndex++;
            }

            let nextAnimationSpeed = isDeletingText ? deletingSpeed : typingSpeed;

            if (!isDeletingText && currentCharIndex === currentWord.length) {
                nextAnimationSpeed = pauseBetweenWords;
                isDeletingText = true;
            } else if (isDeletingText && currentCharIndex === 0) {
                isDeletingText = false;
                currentWordIndex = (currentWordIndex + 1) % typewriterWords.length;
            }

            setTimeout(animateTypewriter, nextAnimationSpeed);
        }
        
        document.addEventListener('DOMContentLoaded', animateTypewriter);


        // ============================================
        // 2. PARTICLE BACKGROUND ANIMATION
        // ============================================
        const particleCanvas = document.getElementById('hero-particle-canvas');
        const canvasContext = particleCanvas.getContext('2d');
        let particleArray;

        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;

        class FloatingParticle {
            constructor() {
                this.xPosition = Math.random() * particleCanvas.width;
                this.yPosition = Math.random() * particleCanvas.height;
                this.particleSize = Math.random() * 3;
                this.xVelocity = Math.random() * 1 - 0.5;
                this.yVelocity = Math.random() * 1 - 0.5;
                this.particleColor = Math.random() > 0.5 ? '#FF1B8D' : '#7209B7';
            }
            
            updatePosition() {
                this.xPosition += this.xVelocity;
                this.yPosition += this.yVelocity;
                
                if (this.xPosition > particleCanvas.width || this.xPosition < 0) {
                    this.xVelocity = -this.xVelocity;
                }
                if (this.yPosition > particleCanvas.height || this.yPosition < 0) {
                    this.yVelocity = -this.yVelocity;
                }
            }
            
            drawParticle() {
                canvasContext.fillStyle = this.particleColor;
                canvasContext.globalAlpha = 0.5;
                canvasContext.beginPath();
                canvasContext.arc(this.xPosition, this.yPosition, this.particleSize, 0, Math.PI * 2);
                canvasContext.fill();
            }
        }

        function initializeParticles() {
            particleArray = [];
            for (let i = 0; i < 50; i++) {
                particleArray.push(new FloatingParticle());
            }
        }

        function animateParticles() {
            canvasContext.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            for (let i = 0; i < particleArray.length; i++) {
                particleArray[i].updatePosition();
                particleArray[i].drawParticle();
            }
            requestAnimationFrame(animateParticles);
        }

        window.addEventListener('resize', () => {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
            initializeParticles();
        });

        initializeParticles();
        animateParticles();

        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primaryPink: '#FF1B8D',
                        primaryPurple: '#7209B7',
                        darkBackground: '#0F0518'
                    },
                    fontFamily: {
                        sans: ['Poppins', 'sans-serif'],
                    },
                    animation: {
                        'morphBlob': 'morphBlob 7s infinite',
                        'floatUpDown': 'floatUpDown 6s ease-in-out infinite',
                    },
                    keyframes: {
                        morphBlob: {
                            '0%': { transform: 'translate(0px, 0px) scale(1)' },
                            '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                            '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                            '100%': { transform: 'translate(0px, 0px) scale(1)' },
                        },
                        floatUpDown: {
                            '0%, 100%': { transform: 'translateY(0)' },
                            '50%': { transform: 'translateY(-20px)' },
                        }
                    }
                }
            }
        }


        // ============================================
        // 1. FAQ ACCORDION TOGGLE FUNCTIONALITY
        // ============================================
        function toggleFaqAccordion(buttonElement) {
            const accordionContent = buttonElement.nextElementSibling;
            const chevronIcon = buttonElement.querySelector('.faq-chevron-icon');
            
            // Optional: Close all other accordions (single-open behavior)
            const allAccordionContents = document.querySelectorAll('.faq-accordion-content');
            const allChevronIcons = document.querySelectorAll('.faq-chevron-icon');
            
            allAccordionContents.forEach((content) => {
                if (content !== accordionContent) {
                    content.classList.remove('faq-expanded');
                }
            });
            
            allChevronIcons.forEach((icon) => {
                if (icon !== chevronIcon) {
                    icon.classList.remove('faq-rotated');
                }
            });
            
            // Toggle current accordion
            if (accordionContent.classList.contains('faq-expanded')) {
                // Close the accordion
                accordionContent.classList.remove('faq-expanded');
                chevronIcon.classList.remove('faq-rotated');
            } else {
                // Open the accordion
                accordionContent.classList.add('faq-expanded');
                chevronIcon.classList.add('faq-rotated');
            }
        }


        // ============================================
        // 2. SCROLL REVEAL ANIMATION (Intersection Observer)
        // ============================================
        const faqScrollObserverOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const faqScrollObserver = new IntersectionObserver((observedEntries) => {
            observedEntries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('faq-visible');
                    // Optional: Stop observing after animation
                    faqScrollObserver.unobserve(entry.target);
                }
            });
        }, faqScrollObserverOptions);

        // Observe all elements with the reveal class
        document.addEventListener('DOMContentLoaded', () => {
            const faqRevealElements = document.querySelectorAll('.faq-scroll-reveal');
            faqRevealElements.forEach(element => {
                faqScrollObserver.observe(element);
            });
        });


        // ============================================
        // 3. KEYBOARD ACCESSIBILITY (Optional Enhancement)
        // ============================================
        document.addEventListener('DOMContentLoaded', () => {
            const faqToggleButtons = document.querySelectorAll('.faq-toggle-button');
            
            faqToggleButtons.forEach(button => {
                button.addEventListener('keydown', (event) => {
                    // Toggle on Enter or Space key
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        toggleFaqAccordion(button);
                    }
                });
            });
        });


        // ============================================
        // 1. MULTI-STEP FORM NAVIGATION
        // ============================================
        
        function proceedToNextStep() {
            if (validateStepOne()) {
                // Hide Step 1
                document.getElementById('contact-form-step-1').classList.remove('contact-step-active');
                
                // Show Step 2
                setTimeout(() => {
                    document.getElementById('contact-form-step-2').classList.add('contact-step-active');
                }, 50); // slight delay for transition
                
                // Update Progress Bar
                updateProgressBar(100);
                
                // Update Step Indicators
                const stepIndicators = document.querySelectorAll('.contact-step-indicator');
                stepIndicators[0].classList.remove('contact-indicator-active', 'bg-primaryPink', 'shadow-lg', 'shadow-primaryPink/50');
                stepIndicators[0].classList.add('bg-gray-700');
                stepIndicators[0].innerHTML = '<i class="fas fa-check"></i>'; // Change to checkmark
                
                stepIndicators[1].classList.add('contact-indicator-active', 'bg-primaryPink', 'shadow-lg', 'shadow-primaryPink/50');
                stepIndicators[1].classList.remove('bg-gray-700');
            }
        }

        function returnToPreviousStep() {
            // Hide Step 2
            document.getElementById('contact-form-step-2').classList.remove('contact-step-active');
            
            // Show Step 1
            setTimeout(() => {
                document.getElementById('contact-form-step-1').classList.add('contact-step-active');
            }, 50);

            // Update Progress Bar
            updateProgressBar(0);
            
            // Update Step Indicators
            const stepIndicators = document.querySelectorAll('.contact-step-indicator');
            stepIndicators[1].classList.remove('contact-indicator-active', 'bg-primaryPink', 'shadow-lg', 'shadow-primaryPink/50');
            stepIndicators[1].classList.add('bg-gray-700');
            
            stepIndicators[0].classList.add('contact-indicator-active', 'bg-primaryPink', 'shadow-lg', 'shadow-primaryPink/50');
            stepIndicators[0].classList.remove('bg-gray-700');
            stepIndicators[0].innerHTML = '1'; // Revert to number
        }

        function updateProgressBar(percentage) {
            document.getElementById('contact-progress-line').style.width = percentage + '%';
        }


        // ============================================
        // 2. FORM VALIDATION
        // ============================================
        
        function validateStepOne() {
            const firstName = document.getElementById('contact-first-name-input').value.trim();
            const lastName = document.getElementById('contact-last-name-input').value.trim();
            const email = document.getElementById('contact-email-input').value.trim();
            const mobile = document.getElementById('contact-mobile-input').value.trim();

            if (!firstName || !lastName || !email || !mobile) {
                shakeInput();
                showToast("Please fill in all required fields.");
                return false;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast("Please enter a valid email address.");
                return false;
            }
            
            const mobileRegex = /^[0-9+\-\s()]+$/;
            if (!mobileRegex.test(mobile)) {
                showToast("Please enter a valid mobile number.");
                return false;
            }
            
            return true;
        }

        // ============================================
        // 3. CHARACTER COUNTER
        // ============================================
        
        function updateMessageCharacterCount(messageValue) {
            const maxLength = 500;
            const currentLength = messageValue.length;
            const counterElement = document.getElementById('contact-character-counter');
            
            if (currentLength > maxLength) {
                // Prevent typing more than limit
                document.getElementById('contact-message-textarea').value = messageValue.substring(0, maxLength);
                counterElement.textContent = `${maxLength} / ${maxLength}`;
                counterElement.classList.add('text-red-500');
                return;
            }

            counterElement.textContent = `${currentLength} / ${maxLength}`;
            
            if (currentLength > 450) {
                counterElement.classList.remove('text-primaryPink');
                counterElement.classList.add('text-red-500');
            } else {
                counterElement.classList.remove('text-red-500');
                counterElement.classList.add('text-primaryPink');
            }
        }

        // ============================================
        // 4. FILE UPLOAD HANDLER (FUNCTIONAL)
        // ============================================
        
        let selectedFiles = [];
        const MAX_FILES = 10;
        const MAX_SIZE_PER_FILE = 5 * 1024 * 1024;
        const MAX_TOTAL_SIZE = 50 * 1024 * 1024;

        const uploadArea = document.getElementById('contact-file-upload-area');
        const fileInput = document.getElementById('contact-file-input');
        const filesListContainer = document.getElementById('files-list-container');
        const fileCountEl = document.getElementById('file-count');
        const totalSizeEl = document.getElementById('total-size');

        uploadArea.addEventListener('click', (e) => {
            if(e.target.closest('.remove-file-btn')) return;
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('border-primaryPink', 'bg-primaryPink/10');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-primaryPink', 'bg-primaryPink/10');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-primaryPink', 'bg-primaryPink/10');
            
            if (e.dataTransfer.files.length) {
                handleFiles(Array.from(e.dataTransfer.files));
            }
        });

        function handleFilesSelect(input) {
            if (input.files.length) {
                handleFiles(Array.from(input.files));
            }
            input.value = '';
        }

        function handleFiles(newFiles) {
            if (selectedFiles.length + newFiles.length > MAX_FILES) {
                showToast(`Maximum ${MAX_FILES} files allowed. You can add ${MAX_FILES - selectedFiles.length} more.`);
                uploadArea.classList.add('shake');
                setTimeout(() => uploadArea.classList.remove('shake'), 400);
                return;
            }

            newFiles.forEach(file => {
                if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                    showToast(`"${file.name}" already added.`);
                    return;
                }

                if (file.size > MAX_SIZE_PER_FILE) {
                    showToast(`"${file.name}" exceeds 5MB limit.`);
                    return;
                }

                const currentTotal = selectedFiles.reduce((sum, f) => sum + f.size, 0);
                if (currentTotal + file.size > MAX_TOTAL_SIZE) {
                    showToast("Total size exceeds 50MB limit.");
                    return;
                }

                selectedFiles.push(file);
            });

            updateFileList();
        }

        function updateFileList() {
            if (selectedFiles.length === 0) {
                filesListContainer.classList.add('hidden');
                fileCountEl.textContent = `0 / ${MAX_FILES} files`;
                totalSizeEl.textContent = '0 MB total';
                return;
            }

            filesListContainer.classList.remove('hidden');
            filesListContainer.innerHTML = '';

            selectedFiles.forEach((file, index) => {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors';
                
                const size = formatFileSize(file.size);
                const icon = getFileIcon(file.type);
                
                fileItem.innerHTML = `
                    <div class="flex items-center gap-3 overflow-hidden">
                        <div class="w-8 h-8 rounded bg-primaryPink/20 flex items-center justify-center flex-shrink-0">
                            <i class="${icon} text-primaryPink text-sm"></i>
                        </div>
                        <div class="min-w-0">
                            <p class="text-sm text-white truncate font-medium" title="${file.name}">${file.name}</p>
                            <p class="text-xs text-gray-400">${size}</p>
                        </div>
                    </div>
                    <button type="button" onclick="removeFile(${index})" class="remove-file-btn w-6 h-6 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all flex-shrink-0 ml-2">
                        <i class="fas fa-times text-xs"></i>
                    </button>
                `;
                
                filesListContainer.appendChild(fileItem);
            });

            const totalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);
            fileCountEl.textContent = `${selectedFiles.length} / ${MAX_FILES} files`;
            totalSizeEl.textContent = `${formatFileSize(totalSize)} total`;
            
            if (selectedFiles.length >= MAX_FILES) {
                fileCountEl.classList.add('text-red-400');
                uploadArea.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                fileCountEl.classList.remove('text-red-400');
                uploadArea.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }

        function removeFile(index) {
            selectedFiles.splice(index, 1);
            updateFileList();
        }

        function removeAllFiles() {
            selectedFiles = [];
            updateFileList();
        }

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        }

        function getFileIcon(mimeType) {
            if (mimeType.startsWith('image/')) return 'fas fa-image';
            if (mimeType.startsWith('video/')) return 'fas fa-video';
            if (mimeType.startsWith('audio/')) return 'fas fa-music';
            if (mimeType.includes('pdf')) return 'fas fa-file-pdf';
            if (mimeType.includes('word') || mimeType.includes('document')) return 'fas fa-file-word';
            if (mimeType.includes('excel') || mimeType.includes('sheet')) return 'fas fa-file-excel';
            if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'fas fa-file-archive';
            return 'fas fa-file';
        }

        function showToast(message) {
            const existing = document.querySelector('.toast-notification');
            if (existing) existing.remove();

            const toast = document.createElement('div');
            toast.className = 'toast-notification fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-full shadow-lg z-50 text-sm font-medium backdrop-blur-sm flex items-center gap-2';
            toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transition = 'opacity 0.3s';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }

        function proceedToNextStep() {
            if (validateStepOne()) {
                document.getElementById('contact-form-step-1').classList.remove('contact-step-active');
                
                setTimeout(() => {
                    document.getElementById('contact-form-step-2').classList.add('contact-step-active');
                }, 50);
                
                updateProgressBar(100);
                
                const stepIndicators = document.querySelectorAll('.contact-step-indicator');
                stepIndicators[0].classList.remove('contact-indicator-active', 'bg-primaryPink', 'shadow-lg', 'shadow-primaryPink/50');
                stepIndicators[0].classList.add('bg-gray-700');
                stepIndicators[0].innerHTML = '<i class="fas fa-check"></i>';
                
                stepIndicators[1].classList.add('contact-indicator-active', 'bg-primaryPink', 'shadow-lg', 'shadow-primaryPink/50');
                stepIndicators[1].classList.remove('bg-gray-700');
            }
        }

        function returnToPreviousStep() {
            document.getElementById('contact-form-step-2').classList.remove('contact-step-active');
            
            setTimeout(() => {
                document.getElementById('contact-form-step-1').classList.add('contact-step-active');
            }, 50);

            updateProgressBar(0);
            
            const stepIndicators = document.querySelectorAll('.contact-step-indicator');
            stepIndicators[1].classList.remove('contact-indicator-active', 'bg-primaryPink', 'shadow-lg', 'shadow-primaryPink/50');
            stepIndicators[1].classList.add('bg-gray-700');
            
            stepIndicators[0].classList.add('contact-indicator-active', 'bg-primaryPink', 'shadow-lg', 'shadow-primaryPink/50');
            stepIndicators[0].classList.remove('bg-gray-700');
            stepIndicators[0].innerHTML = '1';
        }

        function updateProgressBar(percentage) {
            document.getElementById('contact-progress-line').style.width = percentage + '%';
        }

        function validateStepOne() {
            const firstName = document.getElementById('contact-first-name-input').value.trim();
            const lastName = document.getElementById('contact-last-name-input').value.trim();
            const email = document.getElementById('contact-email-input').value.trim();
            const mobile = document.getElementById('contact-mobile-input').value.trim();

            if (!firstName || !lastName || !email || !mobile) {
                showToast("Please fill in all required fields.");
                return false;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showToast("Please enter a valid email address.");
                return false;
            }
            
            const mobileRegex = /^[0-9+\-\s()]+$/;
            if (!mobileRegex.test(mobile)) {
                showToast("Please enter a valid mobile number.");
                return false;
            }
            
            return true;
        }

        function updateMessageCharacterCount(messageValue) {
            const maxLength = 500;
            const currentLength = messageValue.length;
            const counterElement = document.getElementById('contact-character-counter');
            
            if (currentLength > maxLength) {
                document.getElementById('contact-message-textarea').value = messageValue.substring(0, maxLength);
                counterElement.textContent = `${maxLength} / ${maxLength}`;
                counterElement.classList.add('text-red-500');
                return;
            }

            counterElement.textContent = `${currentLength} / ${maxLength}`;
            
            if (currentLength > 450) {
                counterElement.classList.remove('text-primaryPink');
                counterElement.classList.add('text-red-500');
            } else {
                counterElement.classList.remove('text-red-500');
                counterElement.classList.add('text-primaryPink');
            }
        }

        function submitContactForm() {
            const subject = document.getElementById('contact-subject-select').value;
            const message = document.getElementById('contact-message-textarea').value.trim();

            if (!subject) {
                showToast("Please select a subject.");
                document.getElementById('contact-subject-select').focus();
                return;
            }

            if (!message) {
                showToast("Please write a message before submitting.");
                document.getElementById('contact-message-textarea').focus();
                document.getElementById('contact-message-textarea').classList.add('border-red-500');
                setTimeout(() => {
                    document.getElementById('contact-message-textarea').classList.remove('border-red-500');
                }, 2000);
                return;
            }

            const submitButton = document.querySelector('.contact-submit-button');
            
            document.getElementById('contact-loading-overlay').classList.remove('hidden');
            submitButton.disabled = true;

            setTimeout(() => {
                document.getElementById('contact-loading-overlay').classList.add('hidden');
                document.getElementById('contact-success-overlay').classList.remove('hidden');
                triggerConfettiAnimation();
            }, 2000);
        }

        function resetContactForm() {
            document.getElementById('contact-success-overlay').classList.add('hidden');
            document.getElementById('contact-main-form').reset();
            document.getElementById('contact-character-counter').textContent = '0 / 500';
            
            removeAllFiles();
            returnToPreviousStep();
            
            const stepIndicators = document.querySelectorAll('.contact-step-indicator');
            stepIndicators[0].innerHTML = '1';
        }

        function triggerConfettiAnimation() {
            const confettiColors = ['#FF1B8D', '#7209B7', '#ffffff', '#00FFFF', '#F472B6'];
            const confettiCount = 100;
            
            for (let i = 0; i < confettiCount; i++) {
                const confettiPiece = document.createElement('div');
                confettiPiece.classList.add('contact-confetti-piece');
                
                const startLeft = Math.random() * 100;
                const animDuration = Math.random() * 2 + 2;
                
                confettiPiece.style.left = startLeft + 'vw';
                confettiPiece.style.top = '-10px';
                confettiPiece.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                confettiPiece.style.animationDuration = animDuration + 's';
                
                if (Math.random() > 0.5) {
                    confettiPiece.style.borderRadius = '50%';
                } else {
                    confettiPiece.style.width = '8px';
                    confettiPiece.style.height = '12px';
                }

                document.body.appendChild(confettiPiece);

                setTimeout(() => {
                    confettiPiece.remove();
                }, animDuration * 1000);
            }
        }

        // ============================================
        // 5. FORM SUBMISSION (WITH VALIDATION)
        // ============================================

        // function submitContactForm() {
        //     const subject = document.getElementById('contact-subject-select').value;
        //     const message = document.getElementById('contact-message-textarea').value.trim();

        //     // Validation: Check Subject
        //     if (!subject) {
        //         showToast("Please select a subject.");
        //         document.getElementById('contact-subject-select').focus();
        //         return;
        //     }

        //     // Validation: Check Message
        //     if (!message) {
        //         showToast("Please write a message before submitting.");
        //         document.getElementById('contact-message-textarea').focus();
        //         // Highlight textarea
        //         document.getElementById('contact-message-textarea').classList.add('border-red-500');
        //         setTimeout(() => {
        //             document.getElementById('contact-message-textarea').classList.remove('border-red-500');
        //         }, 2000);
        //         return;
        //     }

        //     const submitButton = document.querySelector('.contact-submit-button');
            
        //     // Show Loading State
        //     document.getElementById('contact-loading-overlay').classList.remove('hidden');
        //     submitButton.disabled = true;

        //     // Simulate API call
        //     setTimeout(() => {
        //         // Hide Loading State
        //         document.getElementById('contact-loading-overlay').classList.add('hidden');
                
        //         // Show Success State
        //         document.getElementById('contact-success-overlay').classList.remove('hidden');
                
        //         // Trigger Confetti
        //         triggerConfettiAnimation();
                
        //         // Log data (simulation)
        //         console.log("Form Submitted:");
        //         console.log({
        //             name: document.getElementById('contact-first-name-input').value + " " + document.getElementById('contact-last-name-input').value,
        //             email: document.getElementById('contact-email-input').value,
        //             mobile: document.getElementById('contact-mobile-input').value,
        //             subject: subject,
        //             message: message,
        //             file: fileInput.files[0] ? fileInput.files[0].name : "No file"
        //         });

        //     }, 2000);
        // }

        function submitContactForm() {
            const subject = document.getElementById('contact-subject-select').value;
            const message = document.getElementById('contact-message-textarea').value.trim();

            if (!subject) {
                showToast("Please select a subject.");
                document.getElementById('contact-subject-select').focus();
                return;
            }

            if (!message) {
                showToast("Please write a message before submitting.");
                document.getElementById('contact-message-textarea').focus();
                document.getElementById('contact-message-textarea').classList.add('border-red-500');
                setTimeout(() => {
                    document.getElementById('contact-message-textarea').classList.remove('border-red-500');
                }, 2000);
                return;
            }

            const submitButton = document.querySelector('.contact-submit-button');
            
            document.getElementById('contact-loading-overlay').classList.remove('hidden');
            submitButton.disabled = true;

            setTimeout(() => {
                document.getElementById('contact-loading-overlay').classList.add('hidden');
                document.getElementById('contact-success-overlay').classList.remove('hidden');
                triggerConfettiAnimation();
            }, 2000);
        }

         /**
         * Reset the contact form to initial state
         */
        // function resetContactForm() {
        //     // Hide Success Overlay
        //     document.getElementById('contact-success-overlay').classList.add('hidden');
            
        //     // Reset Form Fields
        //     document.getElementById('contact-main-form').reset();
        //     document.getElementById('contact-character-counter').textContent = '0 / 500';
            
        //     // Reset to Step 1
        //     document.getElementById('contact-form-step-2').classList.remove('contact-step-active');
        //     document.getElementById('contact-form-step-1').classList.add('contact-step-active');
        //     updateProgressBar(0);
            
        //     // Reset Step Indicators
        //     const stepIndicators = document.querySelectorAll('.contact-step-indicator');
        //     stepIndicators.forEach((indicator, index) => {
        //         indicator.classList.remove('contact-indicator-active', 'bg-primaryPink', 'bg-gray-700');
        //         if (index === 0) {
        //             indicator.classList.add('bg-primaryPink', 'contact-indicator-active');
        //         } else {
        //             indicator.classList.add('bg-gray-700');
        //         }
        //     });
        // }

      function resetContactForm() {
    // Hide success overlay
    document.getElementById('contact-success-overlay').classList.add('hidden');

    // Reset form
    const form = document.getElementById('contact-main-form');
    form.reset();

    // Reset counter
    document.getElementById('contact-character-counter').textContent = '0 / 500';

    // IMPORTANT: re-enable submit button
    const submitButton = document.querySelector('.contact-submit-button');
    submitButton.disabled = false;

    // Hide loading overlay just in case
    document.getElementById('contact-loading-overlay').classList.add('hidden');

    // Reset steps
    removeAllFiles();
    returnToPreviousStep();

    const stepIndicators = document.querySelectorAll('.contact-step-indicator');
    stepIndicators.forEach((step, index) => {
        step.innerHTML = index + 1;
    });
}


        function triggerConfettiAnimation() {
            const confettiColors = ['#FF1B8D', '#7209B7', '#ffffff', '#00FFFF', '#F472B6'];
            const confettiCount = 100;
            
            for (let i = 0; i < confettiCount; i++) {
                const confettiPiece = document.createElement('div');
                confettiPiece.classList.add('contact-confetti-piece');
                
                const startLeft = Math.random() * 100;
                const animDuration = Math.random() * 2 + 2;
                
                confettiPiece.style.left = startLeft + 'vw';
                confettiPiece.style.top = '-10px';
                confettiPiece.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                confettiPiece.style.animationDuration = animDuration + 's';
                
                if (Math.random() > 0.5) {
                    confettiPiece.style.borderRadius = '50%';
                } else {
                    confettiPiece.style.width = '8px';
                    confettiPiece.style.height = '12px';
                }

                document.body.appendChild(confettiPiece);

                setTimeout(() => {
                    confettiPiece.remove();
                }, animDuration * 1000);
            }
        }
        // ============================================
        // 6. CONFETTI ANIMATION
        // ============================================
        function triggerConfettiAnimation() {
            const confettiColors = ['#FF1B8D', '#7209B7', '#ffffff', '#00FFFF', '#F472B6'];
            const confettiCount = 100;
            
            for (let i = 0; i < confettiCount; i++) {
                const confettiPiece = document.createElement('div');
                confettiPiece.classList.add('contact-confetti-piece');
                
                // Random positioning and styling
                const startLeft = Math.random() * 100;
                const animDuration = Math.random() * 2 + 2; // 2-4s
                
                confettiPiece.style.left = startLeft + 'vw';
                confettiPiece.style.top = '-10px';
                confettiPiece.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
                confettiPiece.style.animationDuration = animDuration + 's';
                
                // Random shape
                if (Math.random() > 0.5) {
                    confettiPiece.style.borderRadius = '50%';
                } else {
                    confettiPiece.style.width = '8px';
                    confettiPiece.style.height = '12px';
                }

                document.body.appendChild(confettiPiece);

                setTimeout(() => {
                    confettiPiece.remove();
                }, animDuration * 1000);
            }
        }

        // ============================================
        // 7. SCROLL REVEAL ANIMATION
        // ============================================
        
        const contactScrollObserverOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const contactScrollObserver = new IntersectionObserver((observedEntries) => {
            observedEntries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('contact-visible');
                    contactScrollObserver.unobserve(entry.target);
                }
            });
        }, contactScrollObserverOptions);

        document.addEventListener('DOMContentLoaded', () => {
            const revealElements = document.querySelectorAll('.contact-scroll-reveal');
            revealElements.forEach(element => {
                contactScrollObserver.observe(element);
            });
        });

        // ============================================
        // 8. UTILITIES
        // ============================================
        
        function showToast(message) {
            // Create toast element
            const toast = document.createElement('div');
            toast.className = 'fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-full shadow-lg z-50 animate-bounce text-sm font-medium backdrop-blur-sm';
            toast.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i> ${message}`;
            
            document.body.appendChild(toast);
            
            // Remove after 3 seconds
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transition = 'opacity 0.5s';
                setTimeout(() => toast.remove(), 500);
            }, 3000);
        }

        function shakeInput() {
            const formContainer = document.querySelector('.contact-form-container');
            formContainer.style.animation = 'shake 0.5s';
            setTimeout(() => {
                formContainer.style.animation = '';
            }, 500);
        }

        // Add shake animation to styles dynamically
        const styleSheet = document.createElement("style");
        styleSheet.innerText = `
            @keyframes shake {
                0% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                50% { transform: translateX(5px); }
                75% { transform: translateX(-5px); }
                100% { transform: translateX(0); }
            }
        `;
        document.head.appendChild(styleSheet);

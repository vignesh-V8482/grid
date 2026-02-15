// ====================================================================
// Griddezign Website – Optimized & Cleaned JavaScript (Full Version)
// All original features preserved + performance improvements
// Last updated structure: 2025 style
// ====================================================================

// ── 1. DOM Cache Object ─────────────────────────────────────────────
const dom = {
  navbar: null,
  hamburger: null,
  navLinks: null,
  toggleBtn: null,
  submenu: null,
  rotatingText: null,
  carousel: null,
  listItem: null,
  thumbnail: null,
  nextBtn: null,
  prevBtn: null,
  reviewBox: null,
  reviewSlider: null,
  reviewImg: null,
  dotsContainer: null,
  rightContent: null,
  techTrack: null
};

function cacheDomElements() {
  Object.assign(dom, {
    navbar: document.querySelector(".navbar"),
    hamburger: document.getElementById("hamburger"),
    navLinks: document.querySelector(".nav-links"),
    toggleBtn: document.querySelector(".toggle-button"),
    submenu: document.querySelector(".services-submenu"),
    rotatingText: document.getElementById("rotating-text"),
    carousel: document.querySelector(".carousel"),
    listItem: document.querySelector(".carousel .list"),
    thumbnail: document.querySelector(".carousel .thumbnail"),
    nextBtn: document.getElementById("next"),
    prevBtn: document.getElementById("prev"),
    reviewBox: document.querySelector(".box-right"),
    reviewSlider: document.querySelector(".box-content"),
    reviewImg: document.querySelector(".review-img"),
    dotsContainer: document.querySelector(".dotsR"),
    rightContent: document.querySelector(".founder-glass .right-content"),
    techTrack: document.querySelector(".tech-track")
  });
}

// ── 2. Utility Functions ────────────────────────────────────────────
function throttle(fn, delay = 80) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args);
    }
  };
}

function raf(fn) {
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

// ── 3. NAVBAR ───────────────────────────────────────────────────────
function initNavbar() {
  if (!dom.hamburger) return;

  // Hamburger menu toggle
  dom.hamburger.addEventListener("click", () => {
    dom.navLinks.classList.toggle("active");
    dom.hamburger.classList.toggle("active");

    // Close submenu when closing main menu
    if (!dom.navLinks.classList.contains("active")) {
      dom.submenu?.classList.remove("active");
      dom.toggleBtn?.classList.remove("active");
    }
  });

  // Services submenu toggle (mobile only)
  dom.toggleBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    dom.submenu?.classList.toggle("active");
    dom.toggleBtn.classList.toggle("active");
  });

  // Close menu when clicking nav links (except Services on mobile)
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 768 && link.textContent.trim() === "Services") {
        return;
      }
      dom.navLinks.classList.remove("active");
      dom.hamburger.classList.remove("active");
      dom.submenu?.classList.remove("active");
      dom.toggleBtn?.classList.remove("active");
    });
  });

  // Click outside → close menu
  document.addEventListener("click", (e) => {
    if (
      !dom.navLinks?.contains(e.target) &&
      !dom.hamburger?.contains(e.target)
    ) {
      dom.navLinks.classList.remove("active");
      dom.hamburger.classList.remove("active");
      dom.submenu?.classList.remove("active");
      dom.toggleBtn?.classList.remove("active");
    }
  });

  // Reset mobile menu on resize to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      dom.navLinks.classList.remove("active");
      dom.hamburger.classList.remove("active");
      dom.submenu?.classList.remove("active");
      dom.toggleBtn?.classList.remove("active");
    }
  });
}

// ── 4. Active Link Highlighting ─────────────────────────────────────
const activeLinkState = {
  sections: null,
  links: null
};

function prepareActiveLinkCache() {
  activeLinkState.sections = Array.from(document.querySelectorAll("section[id]"));
  activeLinkState.links = Array.from(document.querySelectorAll(".nav-link"));
}

function updateActiveLink() {
  if (!activeLinkState.sections) prepareActiveLinkCache();

  const scrollPos = window.scrollY + 120; // adjustable offset
  let currentId = "";

  for (const section of activeLinkState.sections) {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    if (scrollPos >= top && scrollPos < bottom) {
      currentId = section.id;
      break;
    }
  }

  activeLinkState.links.forEach(link => {
    const hrefId = link.getAttribute("href")?.substring(1);
    link.classList.toggle("active", hrefId === currentId);
  });
}

// ── 5. Navbar Scroll Effect (scrolled class) ────────────────────────
function updateNavbarScrolled() {
  dom.navbar?.classList.toggle("scrolled", window.scrollY > 50);
}

// ── 6. Unified & Throttled Scroll Handler ───────────────────────────
const onScroll = throttle(() => {
  updateNavbarScrolled();
  updateActiveLink();
  // updateProjectAnimations();   // ← add back if you still use this function
}, 60);

// ── 7. Rotating Text Animation ──────────────────────────────────────
function initRotatingText() {
  if (!dom.rotatingText) return;

  const texts = [
    "Brand identity with purpose",
    "Interfaces that feel effortless",
    "Creating memorable experiences",
    "Design that communicates and converts",
    "Bringing ideas to life through designs"
  ];

  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % texts.length;
    dom.rotatingText.textContent = texts[idx];
  }, 3000);
}

// ── 8. Project Carousel ─────────────────────────────────────────────
function initCarousel() {
  if (!dom.nextBtn || !dom.prevBtn) return;

  let timeoutId;
  const transitionTime = 1200;     // match your CSS transition
  const autoNextDelay = 10000;

  function showSlider(type) {
    const items = dom.listItem.querySelectorAll(".item");
    const thumbs = dom.thumbnail.querySelectorAll(".titem");

    if (type === "next") {
      dom.listItem.appendChild(items[0]);
      dom.thumbnail.appendChild(thumbs[0]);
      dom.carousel.classList.add("next");
    } else {
      const lastIdx = items.length - 1;
      dom.listItem.prepend(items[lastIdx]);
      dom.thumbnail.prepend(thumbs[lastIdx]);
      dom.carousel.classList.add("prev");
    }

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      dom.carousel.classList.remove("next", "prev");
    }, transitionTime);

    resetAutoNext();
  }

  function resetAutoNext() {
    clearTimeout(window.carouselAuto);
    window.carouselAuto = setTimeout(() => dom.nextBtn.click(), autoNextDelay);
  }

  dom.nextBtn.onclick = () => showSlider("next");
  dom.prevBtn.onclick  = () => showSlider("prev");

  // Start auto-rotation
  resetAutoNext();
}

// ── 9. Client Reviews Slider ────────────────────────────────────────
const clientReviews = [
  { name: "Murali", role: "Developer", rating: 4, imgSrc: "./assets/MuraliSquare.png", userReview: "Grid services is really impressive, they offer multiple services which solve real world problems.Grid services is really impressive, they offer multiple services which solve real world problems" },
  { name: "Sethu Praveen", role: "UI Designer", rating: 5, imgSrc: "./assets/Sethu.png", userReview: "The design quality and attention to detail from Griddezign is top-notch. Highly recommended." },
  { name: "Vicky", role: "Startup Founder", rating: 5, imgSrc: "./assets/Sethu.png", userReview: "Griddezign helped us shape our brand identity with clarity and strategy. Excellent experience." },
  { name: "Balaji", role: "Product Manager", rating: 4, imgSrc: "./assets/Balaji.jpg", userReview: "Very professional team with strong communication and design thinking skills." },
  { name: "Lakshmi", role: "Marketing Lead", rating: 4, imgSrc: "./assets/Nirosha.jpg", userReview: "Their designs improved our engagement and brand perception across platforms.Grid services is really impressive, they offer multiple services which solve real world problems" },
  { name: "Nirosha", role: "AI Developer", rating: 5, imgSrc: "./assets/Nirosha.jpg", userReview: "Griddezign understands storytelling through design. Clean, purposeful, and effective." },
  { name: "Rahul", role: "Business Consultant", rating: 4, imgSrc: "./assets/Sethu.png", userReview: "Strategic approach to design that aligns well with business goals." },
  { name: "Mohan", role: "Python Developer", rating: 5, imgSrc: "./assets/lokesh.jpg", userReview: "Working with Griddezign felt like a long-term partnership rather than a service." },
  { name: "MohanRaj", role: "Tech Lead", rating: 4, imgSrc: "./assets/MohanRaj.jpg", userReview: "Strong design systems and consistent execution across all deliverables." },
  { name: "Meena", role: "Brand Manager", rating: 5, imgSrc: "./assets/Sethu.png", userReview: "Elegant, minimal, and impactful designs. Exactly what our brand needed.Grid services is really impressive, they offer multiple services which solve real world problems" }
];

let reviewIndex = 0;
let reviewAutoInterval;
const reviewSlideTime = 6000;
let reviewIsAnimating = false;

function getMaxReviewTextLength() {
  if (window.innerWidth <= 480) return 80;
  if (window.innerWidth <= 768) return 120;
  return 160;
}

function truncateReviewText(text) {
  const maxLen = getMaxReviewTextLength();
  return text.length > maxLen ? text.slice(0, maxLen) + "…" : text;
}

function createReviewDots() {
  clientReviews.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "dotR";
    if (i === 0) dot.classList.add("active");
    dot.onclick = () => goToReview(i);
    dom.dotsContainer.appendChild(dot);
  });
}

function goToReview(newIndex) {
  if (reviewIsAnimating) return;
  reviewIsAnimating = true;

  reviewIndex = newIndex;
  dom.reviewBox.classList.add("fade");

  setTimeout(() => {
    const r = clientReviews[reviewIndex];

    document.querySelector(".star").textContent =
      "★".repeat(r.rating) + "☆".repeat(5 - r.rating);

    document.querySelector(".user-review").textContent = truncateReviewText(r.userReview);

    document.querySelector(".user h3").textContent = r.name;
    document.querySelector(".user p").textContent = r.role;

    // Image transition (rely on CSS opacity transition)
    dom.reviewImg.src = r.imgSrc;
    dom.reviewImg.classList.remove("active");
    setTimeout(() => dom.reviewImg.classList.add("active"), 40);

    document.querySelectorAll(".dotR").forEach((dot, i) =>
      dot.classList.toggle("active", i === reviewIndex)
    );

    dom.reviewBox.classList.remove("fade");
    reviewIsAnimating = false;
  }, 350);

  resetReviewAuto();
}

function nextReview() {
  goToReview((reviewIndex + 1) % clientReviews.length);
}

function prevReview() {
  goToReview((reviewIndex - 1 + clientReviews.length) % clientReviews.length);
}

function startReviewAuto() {
  reviewAutoInterval = setInterval(nextReview, reviewSlideTime);
}

function resetReviewAuto() {
  clearInterval(reviewAutoInterval);
  startReviewAuto();
}

// ── 10. Review Interactions (swipe + drag + hover pause) ────────────
function initReviewInteractions() {
  let startX = 0;
  let currentX = 0;
  let dragging = false;
  const minSwipe = 80;

  // Touch events
  dom.reviewSlider.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    dragging = true;
    clearInterval(reviewAutoInterval);
  }, { passive: true });

  dom.reviewSlider.addEventListener("touchmove", e => {
    if (!dragging) return;
    currentX = e.touches[0].clientX;
  }, { passive: true });

  dom.reviewSlider.addEventListener("touchend", () => {
    if (!dragging) return;
    const diff = currentX - startX;
    if (diff > minSwipe) prevReview();
    else if (diff < -minSwipe) nextReview();
    dragging = false;
    resetReviewAuto();
  });

  // Mouse events (desktop)
  dom.reviewSlider.addEventListener("mousedown", e => {
    startX = e.clientX;
    dragging = true;
    clearInterval(reviewAutoInterval);
  });

  dom.reviewSlider.addEventListener("mousemove", e => {
    if (!dragging) return;
    currentX = e.clientX;
  });

  dom.reviewSlider.addEventListener("mouseup", () => {
    if (!dragging) return;
    const diff = currentX - startX;
    if (diff > minSwipe) prevReview();
    else if (diff < -minSwipe) nextReview();
    dragging = false;
    resetReviewAuto();
  });

  dom.reviewSlider.addEventListener("mouseleave", () => {
    dragging = false;
  });

  // Hover pause
  dom.reviewBox.addEventListener("mouseenter", () => clearInterval(reviewAutoInterval));
  dom.reviewBox.addEventListener("mouseleave", resetReviewAuto);
}

// ── 11. Founder Read-more Overlay ───────────────────────────────────
function initReadMoreOverlay() {
  const readMoreBtn = document.querySelector(".read-more");
  const overlay = document.querySelector(".overlay2");
  const closeBtn = document.querySelector(".overlay2 .close");

  if (!readMoreBtn || !overlay || !closeBtn) return;

  readMoreBtn.addEventListener("click", () => {
    overlay.style.display = "flex";
    document.body.classList.add("overlay-open");
  });

  closeBtn.addEventListener("click", () => {
    overlay.style.display = "none";
    document.body.classList.remove("overlay-open");
  });

  overlay.addEventListener("click", e => {
    if (e.target === overlay) {
      overlay.style.display = "none";
      document.body.classList.remove("overlay-open");
    }
  });
}

// ── 12. Founder Right Content Animation (IntersectionObserver) ──────
function initFounderAnimation() {
  if (!dom.rightContent) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  observer.observe(dom.rightContent);
}

// ── 13. Technology Track Pause on Hover ─────────────────────────────
function initTechTrack() {
  if (!dom.techTrack) return;

  dom.techTrack.addEventListener("mouseenter", () => {
    dom.techTrack.style.animationPlayState = "paused";
  });

  dom.techTrack.addEventListener("mouseleave", () => {
    dom.techTrack.style.animationPlayState = "running";
  });
}

// ── 14. Smooth Scrolling for All # Anchors ──────────────────────────
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
}

// ── 15. Main Initialization ─────────────────────────────────────────
async function initialize() {
  try {
    // Load external navbar
    const response = await fetch("navbar.html");
    if (!response.ok) throw new Error("Navbar fetch failed");
    const navbarHTML = await response.text();
    document.getElementById("navbar").innerHTML = navbarHTML;

    // Cache all DOM elements after navbar is inserted
    cacheDomElements();

    // Initialize all features
    initNavbar();
    initSmoothScrolling();
    initRotatingText();
    initCarousel();
    initReadMoreOverlay();
    initFounderAnimation();
    initTechTrack();

    // Reviews initialization
    if (dom.reviewBox && dom.reviewSlider && dom.reviewImg) {
      createReviewDots();
      initReviewInteractions();
      goToReview(0);           // start with first review
      startReviewAuto();
    }

    // Set initial states
    updateNavbarScrolled();
    updateActiveLink();

    // Attach throttled scroll listener
    window.addEventListener("scroll", onScroll);

  } catch (err) {
    console.error("Initialization error:", err);
  }
}

// Start when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}

// Custom Cursor
        const cursor = document.getElementById('cursor');
        const cursorFollower = document.getElementById('cursorFollower');

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            cursor.style.opacity = '1';
            
            setTimeout(() => {
                cursorFollower.style.left = e.clientX + 'px';
                cursorFollower.style.top = e.clientY + 'px';
                cursorFollower.style.opacity = '1';
            }, 100);
        });
        
        //===============grapical-design open model======================//

     // Modal functionality
        const modalOverlay = document.getElementById('modalOverlay');
        const modalImage = document.getElementById('modalImage');
        const modalTitle = document.getElementById('modalTitle');
        const modalDescription = document.getElementById('modalDescription');
        const modalCounter = document.getElementById('modalCounter');
        const modalLoading = document.getElementById('modalLoading');
        const modalInfo = document.getElementById('modalInfo');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const panIndicator = document.getElementById('panIndicator');
        const modalImageSection = document.getElementById('modalImageSection');
        
        let currentProjects = [];
        let currentProjectIndex = 0;
        let currentZoom = 1;
        let translateX = 0;
        let translateY = 0;
        let isDragging = false;
        let startX, startY;
        let lastTranslateX = 0;
        let lastTranslateY = 0;

        // Collect all projects by category
        function collectProjects() {
            const cards = document.querySelectorAll('.project-card');
            const categories = {};
            
            cards.forEach((card, index) => {
                const category = card.dataset.category || 'other';
                if (!categories[category]) {
                    categories[category] = [];
                }
                categories[category].push({
                    element: card,
                    index: index,
                    title: card.dataset.title,
                    description: card.dataset.description,
                    image: card.querySelector('img').src,
                    category: category
                });
            });
            
            return categories;
        }

        const allProjects = collectProjects();

        // Initialize project cards
        function initializeProjectCards() {
            const projectCards = document.querySelectorAll('.project-card');
            
            projectCards.forEach(card => {
                card.addEventListener('click', (e) => {
                    e.preventDefault();
                    const category = card.dataset.category || 'other';
                    currentProjects = allProjects[category] || [];
                    
                    // Find current project index
                    currentProjectIndex = currentProjects.findIndex(p => p.element === card);
                    
                    openModal();
                });
            });
        }

        function openModal() {
            if (currentProjects.length === 0) return;
            
            const project = currentProjects[currentProjectIndex];
            
            // Show loading
            modalLoading.style.display = 'block';
            
            // Update modal content
            modalImage.src = project.image;
            modalTitle.textContent = project.title;
            modalDescription.textContent = project.description;
            
            // Update counter
            updateCounter();
            
            // Show modal
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Hide loading when image loads
            modalImage.onload = () => {
                modalLoading.style.display = 'none';
                resetZoom();
            };
        }

        function closeModal() {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            resetZoom();
        }

        function updateCounter() {
            modalCounter.textContent = `${currentProjectIndex + 1} / ${currentProjects.length}`;
        }

        function previousImage() {
            if (currentProjectIndex > 0) {
                currentProjectIndex--;
                openModal();
            }
        }

        function nextImage() {
            if (currentProjectIndex < currentProjects.length - 1) {
                currentProjectIndex++;
                openModal();
            }
        }

        // Zoom functionality
        function zoomIn() {
            if (currentZoom < 3) {
                currentZoom = Math.min(currentZoom * 1.2, 3);
                applyTransform();
                updateUIState();
                if (currentZoom > 1) {
                    showPanIndicator();
                }
            }
        }

        function zoomOut() {
            if (currentZoom > 1) {
                currentZoom = Math.max(currentZoom / 1.2, 1);
                applyTransform();
                updateUIState();
                if (currentZoom === 1) {
                    resetPan();
                    hidePanIndicator();
                }
            }
        }

        function resetZoom() {
            currentZoom = 1;
            resetPan();
            applyTransform();
            updateUIState();
            hidePanIndicator();
        }

        function resetPan() {
            translateX = 0;
            translateY = 0;
            lastTranslateX = 0;
            lastTranslateY = 0;
        }

        function applyTransform() {
            modalImage.style.transform = `scale(${currentZoom}) translate(${translateX}px, ${translateY}px)`;
        }

        // Update UI state based on zoom
        function updateUIState() {
            if (currentZoom > 1) {
                // Hide all UI elements when zoomed
                modalInfo.classList.add('hidden');
                modalCounter.classList.add('hidden');
                prevBtn.classList.add('hidden');
                nextBtn.classList.add('hidden');
            } else {
                // Show all UI elements when not zoomed
                modalInfo.classList.remove('hidden');
                modalCounter.classList.remove('hidden');
                prevBtn.classList.remove('hidden');
                nextBtn.classList.remove('hidden');
            }
        }

        function showPanIndicator() {
            panIndicator.classList.add('show');
            setTimeout(() => {
                panIndicator.classList.remove('show');
            }, 2000);
        }

        function hidePanIndicator() {
            panIndicator.classList.remove('show');
        }

        // Pan functionality
        modalImageSection.addEventListener('mousedown', (e) => {
            if (currentZoom > 1) {
                isDragging = true;
                startX = e.clientX - lastTranslateX;
                startY = e.clientY - lastTranslateY;
                modalImageSection.classList.add('dragging');
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging && currentZoom > 1) {
                e.preventDefault();
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                applyTransform();
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                lastTranslateX = translateX;
                lastTranslateY = translateY;
                modalImageSection.classList.remove('dragging');
            }
        });

        // Touch support
        let touchStartX, touchStartY;
        
        modalImageSection.addEventListener('touchstart', (e) => {
            if (currentZoom > 1) {
                const touch = e.touches[0];
                touchStartX = touch.clientX - lastTranslateX;
                touchStartY = touch.clientY - lastTranslateY;
                isDragging = true;
            }
        });

        modalImageSection.addEventListener('touchmove', (e) => {
            if (isDragging && currentZoom > 1) {
                e.preventDefault();
                const touch = e.touches[0];
                translateX = touch.clientX - touchStartX;
                translateY = touch.clientY - touchStartY;
                applyTransform();
            }
        });

        modalImageSection.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                lastTranslateX = translateX;
                lastTranslateY = translateY;
            }
        });

        // Mouse wheel zoom
        modalImageSection.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                zoomIn();
            } else {
                zoomOut();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!modalOverlay.classList.contains('active')) return;

            switch(e.key) {
                case 'Escape':
                    closeModal();
                    break;
                case 'ArrowLeft':
                    if (e.shiftKey) {
                        previousImage();
                    } else if (currentZoom > 1) {
                        translateX += 20;
                        applyTransform();
                    }
                    break;
                case 'ArrowRight':
                    if (e.shiftKey) {
                        nextImage();
                    } else if (currentZoom > 1) {
                        translateX -= 20;
                        applyTransform();
                    }
                    break;
                case 'ArrowUp':
                    if (currentZoom > 1) {
                        translateY += 20;
                        applyTransform();
                    }
                    break;
                case 'ArrowDown':
                    if (currentZoom > 1) {
                        translateY -= 20;
                        applyTransform();
                    }
                    break;
                case '+':
                case '=':
                    zoomIn();
                    break;
                case '-':
                case '_':
                    zoomOut();
                    break;
                case '0':
                    resetZoom();
                    break;
            }
        });

        // Click outside to close
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Prevent image drag
        modalImage.addEventListener('dragstart', (e) => {
            e.preventDefault();
        });

        // Initialize on page load
        document.addEventListener('DOMContentLoaded', () => {
            initializeProjectCards();
        });
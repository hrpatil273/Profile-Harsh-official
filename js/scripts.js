// Theme Detection and Management
(function() {
  'use strict';

  const THEME_STORAGE_KEY = 'user-theme-preference';
  const THEME_ATTRIBUTE = 'data-theme';

  // Get stored theme preference or detect system preference
  function getTheme() {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    // Fallback to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  // Apply theme
  function applyTheme(theme) {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
    updateThemeIcon(theme);
  }

  // Update theme toggle icon
  function updateThemeIcon(theme) {
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.className = 'bi bi-sun-fill';
      } else {
        themeIcon.className = 'bi bi-moon-fill';
      }
    }
  }

  // Toggle theme
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute(THEME_ATTRIBUTE) || getTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  }

  // Initialize theme
  function initTheme() {
    const theme = getTheme();
    applyTheme(theme);
  }

  // Initialize theme immediately to prevent flash
  initTheme();

  // Set up theme toggle button
  document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', toggleTheme);
    }
    // Update icon after DOM is ready
    const currentTheme = document.documentElement.getAttribute(THEME_ATTRIBUTE) || getTheme();
    updateThemeIcon(currentTheme);
  });

  // Listen for system theme changes (only if user hasn't set a preference)
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
      // Only apply system preference if user hasn't manually set one
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        const systemTheme = e.matches ? 'dark' : 'light';
        applyTheme(systemTheme);
      }
    });
  }

  // Smooth scroll for anchor links and sidebar navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 0; // No offset needed for full-screen sections
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Update active nav link
          updateActiveNavLink(href.substring(1));
        }
      }
    });
  });

  // Update active navigation link
  function updateActiveNavLink(sectionId) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === sectionId) {
        link.classList.add('active');
      }
    });
  }

  // Intersection Observer for active section highlighting
  document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.fullscreen-section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-10% 0px -10% 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('id');
          updateActiveNavLink(sectionId);
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all cards
  document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.content-card, .profile-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
      observer.observe(card);
    });
  });

  // Add hover effect to skill items
  document.addEventListener('DOMContentLoaded', () => {
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
      item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px) scale(1.02)';
      });
      item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });
  });

  // Parallax effect for profile card (subtle)
  let lastScrollTop = 0;
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const profileCard = document.querySelector('.profile-card');
    
    if (profileCard && scrollTop < 500) {
      const parallaxValue = scrollTop * 0.1;
      profileCard.style.transform = `translateY(${parallaxValue}px)`;
    }
    
    lastScrollTop = scrollTop;
  }, { passive: true });

  // Add ripple effect to social links
  document.addEventListener('DOMContentLoaded', () => {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  });

  // Dynamic gradient animation for profile image border
  document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
      let angle = 0;
      setInterval(() => {
        angle = (angle + 1) % 360;
        profileImage.style.borderImage = `linear-gradient(${angle}deg, var(--blue-primary), var(--purple-primary)) 1`;
      }, 50);
    }
  });

  // Add loading state
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  // View Counter using CountAPI
  document.addEventListener('DOMContentLoaded', () => {
    const viewCountElement = document.getElementById('viewCount');
    if (!viewCountElement) return;

    // Unique namespace for this website (you can change this to your own)
    const namespace = 'harshwardhanpatil';
    const key = 'portfolio-views';
    const apiUrl = `https://api.countapi.xyz`;

    // Function to format number with commas
    function formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Function to update view count display
    function updateViewCount(count) {
      if (viewCountElement) {
        viewCountElement.textContent = formatNumber(count);
        viewCountElement.style.opacity = '0';
        viewCountElement.style.transform = 'scale(0.8)';
        setTimeout(() => {
          viewCountElement.style.transition = 'all 0.3s ease';
          viewCountElement.style.opacity = '1';
          viewCountElement.style.transform = 'scale(1)';
        }, 50);
      }
    }

    // Check if this is a new visit (using sessionStorage to prevent multiple increments per session)
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (!hasVisited) {
      // Increment the count
      fetch(`${apiUrl}/hit/${namespace}/${key}`)
        .then(response => response.json())
        .then(data => {
          if (data.value !== undefined) {
            updateViewCount(data.value);
            sessionStorage.setItem('hasVisited', 'true');
          }
        })
        .catch(error => {
          console.error('Error incrementing view count:', error);
          // Try to get the count anyway
          fetch(`${apiUrl}/get/${namespace}/${key}`)
            .then(response => response.json())
            .then(data => {
              if (data.value !== undefined) {
                updateViewCount(data.value);
              }
            })
            .catch(() => {
              viewCountElement.textContent = '?';
            });
        });
    } else {
      // Just fetch the current count without incrementing
      fetch(`${apiUrl}/get/${namespace}/${key}`)
        .then(response => response.json())
        .then(data => {
          if (data.value !== undefined) {
            updateViewCount(data.value);
          } else {
            // If key doesn't exist, create it
            fetch(`${apiUrl}/hit/${namespace}/${key}`)
              .then(response => response.json())
              .then(data => {
                if (data.value !== undefined) {
                  updateViewCount(data.value);
                }
              });
          }
        })
        .catch(error => {
          console.error('Error fetching view count:', error);
          viewCountElement.textContent = '?';
        });
    }
  });

  // Resume section animations
  document.addEventListener('DOMContentLoaded', () => {
    const resumeSection = document.querySelector('#resume');
    if (resumeSection) {
      const resumeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const resumeItems = entry.target.querySelectorAll('.resume-item');
            resumeItems.forEach((item, index) => {
              setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
              }, index * 100);
            });
          }
        });
      }, { threshold: 0.1 });

      resumeObserver.observe(resumeSection);

      // Initialize resume items with hidden state
      const resumeItems = resumeSection.querySelectorAll('.resume-item');
      resumeItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      });
    }
  });

  // Console message
  console.log('%c👋 Welcome to Harshwardhan Patil\'s Portfolio!', 'color: #7011ff; font-size: 16px; font-weight: bold;');
  console.log('%cBuilt with modern web technologies and attention to detail.', 'color: #ff1170; font-size: 12px;');
})();

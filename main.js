/**
 * JACKVIN PAUL J A - PORTFOLIO INTERACTION ENGINE
 * Vanilla JavaScript (No external framework dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeManager();
  initNavigation();
  initGmailToggle();
  initCopyEmail();
  initTextConverter();
  initResumeBuilder();
  initScrollEffects();
});

/* --------------------------------------------------------------------------
   1. THEME & PALETTE MANAGER (Unique Color System)
   -------------------------------------------------------------------------- */
function initThemeManager() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const paletteDropdown = document.getElementById('paletteDropdown');
  const themeOptions = document.querySelectorAll('[data-set-theme]');
  const body = document.body;

  // Retrieve saved theme or default to sunset
  const savedTheme = localStorage.getItem('jackvin_theme') || 'sunset';
  setTheme(savedTheme);

  // Toggle dropdown on palette button click
  themeToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    paletteDropdown.classList.toggle('show');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!paletteDropdown.contains(e.target) && e.target !== themeToggleBtn) {
      paletteDropdown.classList.remove('show');
    }
  });

  // Select theme
  themeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const selectedTheme = opt.getAttribute('data-set-theme');
      setTheme(selectedTheme);
      paletteDropdown.classList.remove('show');
      showToast(`Mood theme switched to: ${opt.textContent.trim()}`);
    });
  });

  function setTheme(themeName) {
    body.setAttribute('data-theme', themeName);
    localStorage.setItem('jackvin_theme', themeName);

    themeOptions.forEach(btn => {
      if (btn.getAttribute('data-set-theme') === themeName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   2. NAVIGATION & ACTIVE LINK HIGHLIGHTING
   -------------------------------------------------------------------------- */
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Mobile menu toggle
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenuBtn.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('open');
      });
    });
  }

  // Active link on scroll
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. GMAIL TOGGLE & DIRECT CONNECT ENGINE (jackvin151702@gmail.com)
   -------------------------------------------------------------------------- */
function initGmailToggle() {
  const gmailToggleButtons = document.querySelectorAll('.gmail-toggle-btn');
  const contactSection = document.getElementById('contact');
  const directBtn = document.getElementById('toggleDirectMode');
  const composeBtn = document.getElementById('toggleComposeMode');
  const directView = document.getElementById('gmailDirectView');
  const composeView = document.getElementById('gmailComposeView');
  const composeForm = document.getElementById('gmailComposeForm');

  // Toggle buttons across site (Nav, Hero, Mobile) scroll to and focus Gmail card
  gmailToggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Highlight effect on Gmail card
        const gmailCard = document.querySelector('.gmail-card');
        if (gmailCard) {
          gmailCard.style.boxShadow = '0 0 0 4px var(--accent-primary), var(--shadow-lg)';
          setTimeout(() => {
            gmailCard.style.boxShadow = '';
          }, 1800);
        }
      }
    });
  });

  // Switch between Direct mode and Custom Compose mode
  if (directBtn && composeBtn && directView && composeView) {
    directBtn.addEventListener('click', () => {
      directBtn.classList.add('active');
      directBtn.setAttribute('aria-selected', 'true');
      composeBtn.classList.remove('active');
      composeBtn.setAttribute('aria-selected', 'false');

      directView.classList.add('active');
      composeView.classList.remove('active');
    });

    composeBtn.addEventListener('click', () => {
      composeBtn.classList.add('active');
      composeBtn.setAttribute('aria-selected', 'true');
      directBtn.classList.remove('active');
      directBtn.setAttribute('aria-selected', 'false');

      composeView.classList.add('active');
      directView.classList.remove('active');
    });
  }

  // Handle Compose Form Submission to launch Gmail with prefilled parameters
  if (composeForm) {
    composeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const senderName = document.getElementById('senderName').value.trim();
      const subject = document.getElementById('emailSubject').value.trim();
      const message = document.getElementById('emailMessage').value.trim();

      const emailRecipient = 'jackvin151702@gmail.com';
      const fullSubject = encodeURIComponent(subject ? `[Portfolio] ${subject}` : 'Portfolio Inquiry');
      const fullBody = encodeURIComponent(`Hi Jackvin,\n\n${message}\n\nBest regards,\n${senderName}`);

      const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emailRecipient}&su=${fullSubject}&body=${fullBody}`;

      // Open Gmail web client in new tab
      window.open(gmailComposeUrl, '_blank');
      showToast('Opening Gmail Draft with your message!');
    });
  }
}

/* --------------------------------------------------------------------------
   4. QUICK COPY EMAIL WITH TOAST FEEDBACK
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyBtnText = document.getElementById('copyBtnText');
  const emailToCopy = 'jackvin151702@gmail.com';

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(emailToCopy);
        } else {
          // Fallback for non-https or older browsers
          const textArea = document.createElement('textarea');
          textArea.value = emailToCopy;
          textArea.style.position = 'fixed';
          textArea.style.left = '-999999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          textArea.remove();
        }

        if (copyBtnText) copyBtnText.textContent = 'Copied! ✨';
        showToast(`Copied to clipboard: ${emailToCopy}`);

        setTimeout(() => {
          if (copyBtnText) copyBtnText.textContent = 'Copy Email';
        }, 2500);
      } catch (err) {
        showToast(`Email: ${emailToCopy}`);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   5. TOAST NOTIFICATION UTILITY
   -------------------------------------------------------------------------- */
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* --------------------------------------------------------------------------
   6. SCROLL TO TOP & HEADER EFFECTS
   -------------------------------------------------------------------------- */
function initScrollEffects() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   7. MODAL CONTROLS (PROJECT DETAILS & INTERACTIVE DEMOS)
   -------------------------------------------------------------------------- */
window.openProjectModal = function(type) {
  let modalId = '';
  if (type === 'converter') modalId = 'converterModal';
  if (type === 'resume') modalId = 'resumeModal';
  if (type === 'portfolio') modalId = 'portfolioModal';

  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // If opening converter, update its initial live metrics
    if (type === 'converter') {
      updateConverterMetrics();
    }
    // If opening resume, update initial preview
    if (type === 'resume') {
      updateResumePreview();
    }
  }
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
};

// Close modal on backdrop click or ESC key
window.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-backdrop')) {
    e.target.classList.remove('show');
    e.target.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const openModals = document.querySelectorAll('.modal-backdrop.show');
    openModals.forEach(m => {
      m.classList.remove('show');
      m.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
  }
});

/* --------------------------------------------------------------------------
   8. INTERACTIVE PROJECT 1: TEXT CONVERTER ENGINE
   -------------------------------------------------------------------------- */
function initTextConverter() {
  const input = document.getElementById('converterInput');
  if (input) {
    input.addEventListener('input', updateConverterMetrics);
    updateConverterMetrics();
  }
}

function updateConverterMetrics() {
  const input = document.getElementById('converterInput');
  const metricWords = document.getElementById('metricWords');
  const metricChars = document.getElementById('metricChars');
  const metricReading = document.getElementById('metricReading');

  if (!input) return;

  const text = input.value;
  const chars = text.length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  
  // Average reading speed ~ 200 words per minute
  const readingSeconds = Math.ceil((words / 200) * 60);

  if (metricWords) metricWords.textContent = words;
  if (metricChars) metricChars.textContent = chars;
  if (metricReading) metricReading.textContent = readingSeconds < 60 ? `${readingSeconds}s` : `${Math.ceil(readingSeconds / 60)}m`;
}

window.convertText = function(mode) {
  const input = document.getElementById('converterInput');
  if (!input) return;

  let val = input.value;

  switch(mode) {
    case 'upper':
      input.value = val.toUpperCase();
      showToast('Converted to UPPERCASE');
      break;

    case 'lower':
      input.value = val.toLowerCase();
      showToast('Converted to lowercase');
      break;

    case 'title':
      input.value = val.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
      showToast('Converted to Title Case');
      break;

    case 'sentence':
      input.value = val.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, char => char.toUpperCase());
      showToast('Converted to Sentence case');
      break;

    case 'slug':
      input.value = val.toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      showToast('Converted to slug-case');
      break;
  }

  updateConverterMetrics();
};

window.clearConverterText = function() {
  const input = document.getElementById('converterInput');
  if (input) {
    input.value = '';
    updateConverterMetrics();
    showToast('Text cleared');
  }
};

window.copyConverterOutput = async function() {
  const input = document.getElementById('converterInput');
  if (!input || !input.value) {
    showToast('Nothing to copy!');
    return;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(input.value);
    } else {
      input.select();
      document.execCommand('copy');
    }
    showToast('Result copied to clipboard! 📋');
  } catch (e) {
    showToast('Failed to copy');
  }
};

/* --------------------------------------------------------------------------
   9. INTERACTIVE PROJECT 2: RESUME BUILDER ENGINE
   -------------------------------------------------------------------------- */
function initResumeBuilder() {
  updateResumePreview();
}

window.updateResumePreview = function() {
  const nameInp = document.getElementById('resName');
  const roleInp = document.getElementById('resRole');
  const eduInp = document.getElementById('resEdu');
  const skillsInp = document.getElementById('resSkills');
  const summaryInp = document.getElementById('resSummary');

  const prevName = document.getElementById('prevName');
  const prevRole = document.getElementById('prevRole');
  const prevEdu = document.getElementById('prevEdu');
  const prevSkills = document.getElementById('prevSkills');
  const prevSummary = document.getElementById('prevSummary');

  if (nameInp && prevName) prevName.textContent = nameInp.value || 'Your Name';
  if (roleInp && prevRole) prevRole.textContent = roleInp.value || 'Your Title';
  if (eduInp && prevEdu) prevEdu.textContent = eduInp.value ? `🎓 ${eduInp.value}` : '🎓 Education';
  if (summaryInp && prevSummary) prevSummary.textContent = summaryInp.value || 'Add a summary...';

  if (skillsInp && prevSkills) {
    const rawSkills = skillsInp.value.split(',').map(s => s.trim()).filter(Boolean);
    prevSkills.innerHTML = '';
    rawSkills.forEach(skill => {
      const tag = document.createElement('span');
      tag.textContent = skill;
      prevSkills.appendChild(tag);
    });
  }
};

window.printResumePreview = function() {
  window.print();
};

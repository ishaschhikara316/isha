// Enhanced Portfolio Website JavaScript
// Interactive elements, smooth scrolling, and micro-interactions

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeScrollAnimations();
    initializeMicroInteractions();
    initializeContactForm();
    initializeParallaxEffects();
    initializeTypewriterEffect();
});

// ===== NAVIGATION FUNCTIONALITY =====
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.querySelector('.navbar');

    // Mobile menu toggle
    hamburger?.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
    });

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // Navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            navbar.style.background = 'rgba(1, 68, 33, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(1, 68, 33, 0.95)';
            navbar.style.boxShadow = 'none';
        }

        // Active section highlighting
        highlightActiveSection();

        lastScrollTop = scrollTop;
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Highlight active navigation section
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== SCROLL ANIMATIONS =====
function initializeScrollAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Animate children with delay
                const children = entry.target.querySelectorAll('.animate-child');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animateElements = document.querySelectorAll(
        '.portfolio-card, .blog-card, .contact-item, .skill-tag, .about-photo, .hero-text, .section-title'
    );

    animateElements.forEach(el => {
        el.classList.add('animate-element');
        observer.observe(el);
    });

    // Add CSS for animations
    addScrollAnimationStyles();
}

function addScrollAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .animate-element {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-element.animate-in {
            opacity: 1;
            transform: translateY(0);
        }

        .animate-child {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-child.animate-in {
            opacity: 1;
            transform: translateY(0);
        }

        .nav-link.active {
            color: var(--subtle-gold);
        }

        .nav-link.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
}

// ===== MICRO-INTERACTIONS =====
function initializeMicroInteractions() {
    // Enhanced button interactions
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0) scale(0.98)';
        });

        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px) scale(1.02)';
        });
    });

    // Portfolio card interactions
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    portfolioCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add parallax effect to icon
            const icon = this.querySelector('.card-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotateY(15deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });

        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.card-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotateY(0deg)';
            }
        });
    });

    // Social links pulse effect
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.animation = 'socialPulse 0.6s ease-in-out';
        });

        link.addEventListener('animationend', function() {
            this.style.animation = '';
        });
    });

    // Add social pulse animation
    const socialStyle = document.createElement('style');
    socialStyle.textContent = `
        @keyframes socialPulse {
            0% { transform: scale(1) translateY(0); }
            50% { transform: scale(1.1) translateY(-3px); }
            100% { transform: scale(1) translateY(-3px); }
        }
    `;
    document.head.appendChild(socialStyle);

    // Skill tag interactions
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.classList.add('animate-child');

        tag.addEventListener('click', function() {
            // Create ripple effect
            createRippleEffect(this);
        });
    });
}

function createRippleEffect(element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(201, 164, 65, 0.6)';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'ripple 0.6s ease-out';

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => {
        ripple.remove();
    }, 600);

    // Add ripple animation
    if (!document.querySelector('#ripple-style')) {
        const rippleStyle = document.createElement('style');
        rippleStyle.id = 'ripple-style';
        rippleStyle.textContent = `
            @keyframes ripple {
                to {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
    }
}

// ===== CONTACT FORM =====
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

    // Enhanced form validation and submission
    contactForm?.addEventListener('submit', function(e) {
        e.preventDefault();

        // Add loading state
        const submitBtn = this.querySelector('.btn-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            // Show success message
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });

    // Real-time form validation
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('focus', function() {
            this.parentElement.classList.remove('error');
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldGroup = field.parentElement;

    // Remove existing error
    fieldGroup.classList.remove('error');

    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            fieldGroup.classList.add('error');
            return false;
        }
    }

    // Required field validation
    if (field.required && !value) {
        fieldGroup.classList.add('error');
        return false;
    }

    return true;
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'transform 0.3s ease',
        background: type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// ===== PARALLAX EFFECTS =====
function initializeParallaxEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.profile-photo');

        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        // Parallax for hero background
        const hero = document.querySelector('.hero');
        if (hero) {
            const yPos = scrolled * 0.3;
            hero.style.backgroundPosition = `center ${yPos}px`;
        }
    });
}

// ===== TYPEWRITER EFFECT =====
function initializeTypewriterEffect() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';

        let index = 0;
        const typeSpeed = 50;

        function typeWriter() {
            if (index < text.length) {
                heroSubtitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, typeSpeed);
            } else {
                // Add blinking cursor
                const cursor = document.createElement('span');
                cursor.textContent = '|';
                cursor.style.animation = 'blink 1s infinite';
                heroSubtitle.appendChild(cursor);

                // Add blink animation
                if (!document.querySelector('#blink-style')) {
                    const blinkStyle = document.createElement('style');
                    blinkStyle.id = 'blink-style';
                    blinkStyle.textContent = `
                        @keyframes blink {
                            0%, 50% { opacity: 1; }
                            51%, 100% { opacity: 0; }
                        }
                    `;
                    document.head.appendChild(blinkStyle);
                }
            }
        }

        // Start typewriter effect after a delay
        setTimeout(typeWriter, 1000);
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Throttle scroll events for better performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Optimized scroll handler
const optimizedScrollHandler = throttle(function() {
    highlightActiveSection();
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

// ===== ACCESSIBILITY ENHANCEMENTS =====
document.addEventListener('keydown', function(e) {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (navMenu?.classList.contains('active')) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Tab navigation enhancement
    if (e.key === 'Tab') {
        document.body.classList.add('using-keyboard');
    }
});

// Remove keyboard class when using mouse
document.addEventListener('mousedown', function() {
    document.body.classList.remove('using-keyboard');
});

// Add focus styles for keyboard navigation
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    .using-keyboard .btn:focus,
    .using-keyboard .nav-link:focus,
    .using-keyboard .social-link:focus {
        outline: 2px solid var(--subtle-gold);
        outline-offset: 3px;
    }

    .form-group.error input,
    .form-group.error textarea {
        border-color: #ff4444;
        box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.1);
    }
`;
document.head.appendChild(focusStyle);

// ===== LOADING ANIMATIONS =====
window.addEventListener('load', function() {
    // Fade in hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(50px)';

        setTimeout(() => {
            heroContent.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 500);
    }
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could implement user-friendly error reporting here
});

// Service worker registration for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment if you want to add a service worker
        // navigator.serviceWorker.register('/sw.js');
    });
}
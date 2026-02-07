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
    initializeBlogListeners();
    initializeCVModal();
    // Dynamic footer year
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
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

    // Form submission via Formspree
    contactForm?.addEventListener('submit', function(e) {
        const action = this.getAttribute('action');
        // If Formspree is not configured yet, show a message
        if (!action || action.includes('YOUR_FORM_ID')) {
            e.preventDefault();
            showNotification('Contact form is being set up. Please email directly for now.', 'info');
            return;
        }
        // Otherwise let the form submit naturally to Formspree
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

// ===== BLOG CONTENT DATA =====
const blogData = {
    'survival-analysis': {
        title: 'Kaplan-Meier Survival Analysis: Validating Therapeutic Targets',
        image: 'Image/HIF1A_Academic_Survival.png',
        content: `
            <h3>🔍 The "Why": From Wet Lab to Data Science</h3>
            <p>In my thesis (<a href="#" onclick="openBlog('crispr'); return false;">CRISPR-Cas9 Genome Editing</a>), I explored how to target hepatocellular carcinoma (HCC). But identifying a target in the lab is only half the battle. We need to know: <strong>does this gene actually matter in real patients?</strong></p>
            
            <p>To answer this, I stepped out of the wet lab and into bioinformatics. I performed a Survival Analysis using clinical and genomic data sourced from <strong>cBioPortal</strong>, specifically utilizing the <strong>Liver Hepatocellular Carcinoma (TCGA, PanCancer Atlas)</strong> dataset to see if <em>HIF1A</em> expression levels correlate with patient outcomes.</p>

            <div class="modal-section-divider"></div>

            <h3>📊 What is Kaplan-Meier Analysis?</h3>
            <p>Imagine you have two groups of patients. You want to know which group lives longer. You can't just average their lifespans because some patients are still alive (censored data). Kaplan-Meier is the statistical standard for handling this "time-to-event" data.</p>
            
            <p>It calculates the probability of survival at any given time point. It drops the probability curve every time an "event" (death) occurs.</p>

            <div class="modal-section-divider"></div>

            <h3>📈 Result 1: The "Story" Plot</h3>
            <p>First, I created a visualization designed for quick understanding. This plot divides patients into "High" vs "Low" gene expression groups.</p>
            
            <img src="Image/HIF1A_Intuitive_Survival.png" alt="Intuitive Survival Plot" style="width: 100%; border-radius: 8px; margin: 15px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            
            <ul>
                <li><strong>Red Line (Risk Group):</strong> Patients with HIGH levels of the gene.</li>
                <li><strong>Blue Line (Safer Group):</strong> Patients with LOW levels.</li>
                <li><strong>Observation:</strong> The blue line stays higher for longer. This suggests that keeping this gene's levels <em>low</em> is better for survival—validating it as a potential target for downregulation.</li>
            </ul>

            <div class="modal-section-divider"></div>

            <h3>🔬 Result 2: The Academic Standard</h3>
            <p>For scientific rigor, I generated a standard publication-quality plot including confidence intervals (shaded areas) and the Log-rank test p-value.</p>
            
            <img src="Image/HIF1A_Academic_Survival.png" alt="Academic Survival Plot" style="width: 100%; border-radius: 8px; margin: 15px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            
            <p><strong>Statistical Significance:</strong> The p-value is <strong>0.0549</strong>. Our result is on the borderline—a strong "biological signal" suggesting that with a larger patient cohort, this would likely be definitive. It strongly supports the hypothesis that <em>HIF1A</em> drives poor outcomes in Liver Cancer.</p>

            <h3>💻 The Tech Stack & Data Source</h3>
            <p>This analysis was performed using a custom Python pipeline:</p>
            <div class="card-tags" style="justify-content: flex-start; margin-top: 10px;">
                <span class="skill-tag">Python 3.14</span>
                <span class="skill-tag">Pandas</span>
                <span class="skill-tag">Lifelines (Statistics)</span>
                <span class="skill-tag">cBioPortal Data</span>
            </div>
            <p style="font-size: 0.9em; margin-top: 15px; font-style: italic;">Data Source: Liver Hepatocellular Carcinoma (TCGA, PanCancer Atlas) via cBioPortal.</p>

            <div class="modal-section-divider"></div>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <a href="pdfs/survival-analysis.html" target="_blank" class="btn btn-primary" style="color: var(--dark-royal-green); border-color: var(--dark-royal-green);">
                    <i class="fas fa-file-alt" style="margin-right: 8px;"></i> Download 1-Page Summary
                </a>
                <a href="https://github.com/ishaschhikara316/TCGA-Survival-Analysis" target="_blank" class="btn btn-primary" style="color: var(--dark-royal-green); border-color: var(--dark-royal-green);">
                    <i class="fab fa-github" style="margin-right: 8px;"></i> View on GitHub
                </a>
            </div>
        `
    },

    'differential-expression': {
        title: 'Hunting Drug Targets: Differential Expression Analysis',
        image: 'Image/Volcano_Plot.png',
        content: `
            <h3>🎯 The Mission: Finding the Bullseye</h3>
            <p>If we want to cure cancer with precision weapons like CAR-T cells or Antibody-Drug Conjugates (ADCs), we first need a target. We need a protein that is waving a giant flag on the surface of cancer cells but is nowhere to be found on healthy cells.</p>
            
            <p>To find these hidden targets, I dove into the <strong>GSE76427 dataset</strong>—a massive transcriptomic library comparing Hepatocellular Carcinoma (HCC) tumors directly against adjacent healthy liver tissue from 115 patients.</p>

            <div class="modal-section-divider"></div>

            <h3>🎛️ The Concept: The Volume Knob</h3>
            <p>Think of your genome as a giant mixing board with 20,000 volume knobs (genes). In cancer, some knobs are cranked up to 11 (Upregulated), while others are muted.</p>
            <p>I used <strong>R</strong> and the <strong>Limma</strong> statistical package to compare the "volume" of every single gene in the tumor vs. the healthy tissue. We weren't just looking for noise; we were looking for the genes screaming the loudest.</p>

            <div class="modal-section-divider"></div>

            <h3>🌋 The "Volcano" of Discovery</h3>
            <p>This plot is one of the most famous visualizations in bioinformatics. Here is how to read it:</p>
            
            <img src="Image/Volcano_Plot.png" alt="Volcano Plot of DEA" style="width: 100%; border-radius: 8px; margin: 15px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            
            <ul>
                <li><strong>Each Dot:</strong> Represents one unique gene.</li>
                <li><strong>X-Axis (Fold Change):</strong> How much more (Right) or less (Left) the gene is expressed in cancer.</li>
                <li><strong>Y-Axis (Significance):</strong> How confident we are that this isn't just random luck. The higher the dot, the more "real" the result.</li>
                <li><strong>The Red Dots:</strong> The "Hits." These are significantly upregulated genes. That labeled dot at the top right? That is our potential target.</li>
            </ul>

            <div class="modal-section-divider"></div>

            <h3>📦 Validating the Target: PROM1 (CD133)</h3>
            <p>One candidate stood out: <strong>PROM1</strong>, also known as <strong>CD133</strong>. This isn't just any protein; it is a well-known marker for "Cancer Stem Cells"—the nasty, resilient cells often responsible for relapse.</p>
            
            <img src="Image/PROM1_Boxplot.png" alt="Boxplot of PROM1 Expression" style="width: 100%; border-radius: 8px; margin: 15px 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            
            <p>This Boxplot is the "proof of concept."</p>
            <ul>
                <li><strong>Blue Box (Non-Tumor):</strong> Expression is relatively low and consistent.</li>
                <li><strong>Red Box (Tumor):</strong> Expression shifts significantly higher.</li>
            </ul>
            <p>This confirms that CD133 is consistently overexpressed in this patient cohort, making it a viable candidate for targeted therapies that spare healthy liver tissue.</p>

            <h3>💻 The Tech Stack</h3>
            <div class="card-tags" style="justify-content: flex-start; margin-top: 10px;">
                <span class="skill-tag">R Language</span>
                <span class="skill-tag">Limma (Bioconductor)</span>
                <span class="skill-tag">ggplot2</span>
                <span class="skill-tag">Transcriptomics</span>
            </div>

            <div class="modal-section-divider"></div>
            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <a href="pdfs/differential-expression.html" target="_blank" class="btn btn-primary" style="color: var(--dark-royal-green); border-color: var(--dark-royal-green);">
                    <i class="fas fa-file-alt" style="margin-right: 8px;"></i> Download 1-Page Summary
                </a>
                <a href="https://github.com/ishaschhikara316/HCC-Differential-Expression" target="_blank" class="btn btn-primary" style="color: var(--dark-royal-green); border-color: var(--dark-royal-green);">
                    <i class="fab fa-github" style="margin-right: 8px;"></i> View on GitHub
                </a>
            </div>
        `
    },

    'drdo': {
        title: 'Research Trainee @ DIPAS, DRDO: Physiology at the Extremes',
        image: 'Image/Hypoxia.jpg',
        content: `
            <h3>🏔️ Scaling Physiological Peaks</h3>
            <p>At the Defence Institute of Physiology and Allied Sciences (DIPAS), DRDO, I didn't just study biology; I investigated survival. My traineeship focused on the physiological mechanisms that allow organisms to endure the thin air of high altitudes—a critical frontier for our defense forces.</p>
            
            <p>Under expert supervision, I executed rigorous in vivo studies on a cohort of 50+ Wistar rats to model high-altitude stress adaptations. We weren't just observing; we were generating key physiological datasets (blood gas, lactate) that directly validated the institute's acclimatization protocols.</p>

            <div class="modal-section-divider"></div>

            <h3>🧪 Precision in the Lab</h3>
            <p>Science is only as good as its reproducibility. One of my core achievements was the optimization of the Malondialdehyde (MDA) oxidative stress assay.</p>
            <ul>
                <li><strong>The Challenge:</strong> Oxidative stress is a key marker of hypoxic damage, but assays can be fickle.</li>
                <li><strong>The Solution:</strong> I refined the protocol, processing over 100 tissue samples.</li>
                <li><strong>The Result:</strong> A 95% reproducibility rate (CV < 5%) and a 15% reduction in reagent waste. Efficient science is better science.</li>
            </ul>

            <div class="modal-section-divider"></div>

            <h3>🫀 From Tissue to Data</h3>
            <p>My role demanded managing the end-to-end tissue workflow. This meant handling ethical dissections (liver, heart, lung) with precision and processing them all the way to DNA and protein extraction. We achieved high-yield protein recovery (>2 mg/ml), ensuring that our downstream blotting analysis was based on the highest quality samples.</p>

            <h3>🏃‍♂️ The Quantitative Edge</h3>
            <p>Beyond the wet lab, I conducted Cardiopulmonary Exercise Testing (CPET). We recorded over 200 data points for VO2 max and metabolic thresholds. This data helped us quantify the exact impact of hypoxic pre-conditioning, turning "acclimatization" from a vague concept into a measurable physiological advantage.</p>
        `
    },
    'iit-madras': {
        title: 'Research Trainee @ IIT Madras: Scaffolds & Stem Cells',
        image: 'Image/CAD.jpg',
        content: `
            <h3>🧱 Playing LEGO with Life</h3>
            <p>Spent my summer playing high-stakes LEGO with stem cells and CAD software. The goal? To trick biology into building a functional liver.</p>
            
            <p>During my time as a Research Trainee, I authored a 15-page research proposal for a novel stem cell therapy, integrating CRISPR-Cas9 gene editing with custom scaffold designs. We didn't just write about it; we designed the blueprints for the cellular housing.</p>

            <div class="modal-section-divider"></div>

            <h3>📐 The Blueprint (As seen above)</h3>
            <p>The image above summarizes the core of our scaffold design work using Autodesk Fusion 360. Here is the breakdown of our "cellular apartment complex":</p>
            
            <ul>
                <li><strong>Panel A (The Goal):</strong> Defines the "Design Objective" for our hepatic tissue engineering. We needed a structure that mimics the liver's natural environment—optimizing for nutrient diffusion and cell viability.</li>
                <li><strong>Panel B (The Model):</strong> Flaunts the polished isometric render of the lattice. This isn't just a pretty picture; it's a calculated biopolymer scaffold designed to support 3D cell culture.</li>
                <li><strong>Panel C (The Cross-Section):</strong> Cuts to the chase, revealing the internal pore structure. We validated the pore size (100-200 𝜇m) and interconnectivity in silico to ensure that every cell gets its fair share of nutrients (diffusion).</li>
                <li><strong>Panel D (The Specs):</strong> Proves we did our homework. This table details the material choices, intended printing methods, and the constraints we checked—from "porosity estimated from CAD" to "basic diffusion reasoning."</li>
            </ul>

            <div class="modal-section-divider"></div>

            <h3>🧬 Beyond the Scaffold</h3>
            <p>It wasn't just about the structure. I also designed 5 sgRNA constructs targeting liver-specific oncogenes using Benchling (achieving >80% on-target efficiency) and mapped out the full FDA/EMA regulatory pathway for a theoretical cell therapy product. Basically, we engineered the future of liver tissue, keeping it strictly GMP-compliant and regulatory-ready.</p>
        `
    },
    'crispr': {
        title: 'CRISPR-Cas9 Genome Editing: Advancing Therapeutic Strategies for Ameliorating Hepatocellular Carcinoma',
        image: 'Image/Crispr-Cas9.jpg',
        content: `
            <p>This diagram summarizes my 70-page thesis into a single glance. To explain what this figure depicts, one can describe it as follows:</p>
            
            <h3>Delivery bottleneck in cirrhotic HCC</h3>
            <p>This schematic summarizes the core finding of this thesis: in hepatocellular carcinoma arising in fibrotic/cirrhotic liver, the dominant limitation for CRISPR therapeutics is not intrinsic editing performance but payload accessibility to target hepatocytes/tumour cells.</p>
            
            <p>In healthy sinusoids, endothelial fenestrations permit lipid nanoparticle (LNP) transit into the space of Disse and onward delivery to hepatocytes. In fibrotic liver, sinusoidal capillarization/defenestration with basement-membrane formation, dense extracellular-matrix (collagen) deposition, and Kupffer-cell sequestration collectively trap or clear LNPs, leaving fewer particles to reach hepatocytes.</p>
            
            <p>These observations motivate future strategies that prioritize delivery solutions capable of bypassing this barrier (e.g., active targeting ligands and alternative vector platforms) as a prerequisite for effective clinical translation in cirrhotic HCC.</p>
            
            <div class="modal-section-divider"></div>
            
            <p>But if you have time and want to take a deeper dive to understand these concepts—which happen on a miniscule scale—by taking examples from the macroscopic world, here is my fun short story:</p>
            
            <h3>🏙️ Welcome to Liver City</h3>
            <p>Imagine your liver as a bustling metropolis. The main residents are hepatocytes (the hardworking citizens keeping the lights on). But recently, a nasty gang called Hepatocellular Carcinoma (HCC) has moved in, usually thriving in neighborhoods that are already falling apart due to cirrhosis (scarring).</p>
            <p>Enter the cavalry: CRISPR tools. Think of these as superhero delivery trucks loaded with gene-editing gear, sent to wipe out the HCC gang.</p>
            
            <h4>🎬 The Big Plot Twist</h4>
            <p>The superheroes are actually great at their job (the gene editing works fine!). The problem isn't the hero—it's the traffic jam preventing them from getting to the fight. It is a logistics nightmare.</p>
            
            <h3>🟢 The Good Old Days (Healthy Liver)</h3>
            <p>In a healthy city, the infrastructure is a delivery driver’s dream.</p>
            <ul>
                <li><strong>The Roads (Sinusoids):</strong> These blood vessels are lined with specialized endothelial cells.</li>
                <li><strong>The Windows (Fenestrations):</strong> The roads have tiny, convenient "drive-thru windows" that allow the delivery trucks to slide right through.</li>
                <li><strong>The Drop-off Zone (Space of Disse):</strong> The trucks slide through the windows into a chill lounge area right next to the hepatocytes. Delivery is seamless.</li>
            </ul>
            
            <h3>🔴 Urban Decay (The Cirrhotic Liver)</h3>
            <p>In a fibrotic or cirrhotic liver, disaster strikes. The infrastructure collapses, creating a hostile environment for our Lipid Nanoparticle (LNP) delivery trucks.</p>
            
            <h4>1. Road Closures (Defenestration)</h4>
            <p>The sinusoids undergo "capillarization." They lose their drive-thru windows (loss of fenestrations) and slap up thick basement membranes.</p>
            <p><em>The Metaphor:</em> It’s like the city replaced open roads with concrete barriers. The trucks can see the houses (hepatocytes), but they can’t get off the highway.</p>
            
            <h4>2. Construction Debris (Extracellular Matrix)</h4>
            <p>The space between the road and the houses gets filled with dense collagen.</p>
            <p><em>The Metaphor:</em> A massive, unmanaged construction site. Even if a truck hops the barrier, it gets stuck in piles of cement and debris, blocking the path to the front door.</p>
            
            <h4>3. Rogue Security (Kupffer Cells)</h4>
            <p>The liver’s cleanup crew, the Kupffer cells, go into overdrive.</p>
            <p><em>The Metaphor:</em> Security guards who have become paranoid. Instead of waving the delivery trucks through, they snatch them, shred them, and toss the packages before they ever reach the residents.</p>
            
            <h3>🚛 The Result & The Fix</h3>
            <p>Because of this chaos, most LNPs get trapped in the debris or destroyed by security, starving the target cancer cells of their CRISPR payload. This "Delivery Bottleneck" is the #1 hurdle stopping CRISPR from becoming a clinic-ready therapy.</p>
            
            <h4>The Fleet Upgrade</h4>
            <p>To smash through the traffic, we need to upgrade the trucks:</p>
            <ul>
                <li><strong>Active Targeting:</strong> Installing "GPS-guided systems" (ligands) so trucks can find secret shortcuts.</li>
                <li><strong>Alternative Vectors:</strong> Swapping the delivery van for a tank (viral vectors or tougher polymers) that can crash through the construction site.</li>
            </ul>
        `
    },

    'blog-anglerfish': {
        title: 'The Anglerfish Situation: Biology\'s Most Disturbing Love Story',
        readingTime: '4 min read',
        content: `
            <h3>🐟 Meet the Worst Boyfriend in Nature</h3>
            <p>Somewhere in the pitch-black deep sea, roughly 1,000 metres below the surface where sunlight never reaches, one of biology's most unsettling romances is playing out. A tiny male anglerfish, barely the size of your fingernail, bumps into a female fifty times his size. He bites into her belly. And then he never lets go.</p>

            <p>What happens next makes every horror movie look tame. His jaw fuses into her skin. His blood vessels merge with hers. His eyes degenerate, his internal organs dissolve, and he becomes a permanent parasitic lump on her body. His only remaining function? Producing sperm on demand. He is, in the most literal biological sense, absorbed.</p>

            <div class="modal-section-divider"></div>

            <h3>🌊 Why This Happens</h3>
            <p>Before you judge the anglerfish too harshly, consider their real estate. The deep ocean is <strong>enormous</strong> and almost completely empty. Population densities are so low that finding a mate is like finding a specific person in a country the size of Russia, in the dark, with no phone. If you're lucky enough to bump into a compatible partner, evolution says: <em>do not let go</em>.</p>

            <p>So natural selection favoured males who could permanently attach. Over millions of years, males shrank. Females grew. The arrangement became obligate in some species. The male gets a lifetime food supply through her blood; the female gets a built-in sperm bank she never has to search for again. Romantically horrifying. Evolutionarily elegant.</p>

            <div class="modal-section-divider"></div>

            <h3>🔬 The Immunology Plot Twist</h3>
            <p>Here's where it gets genuinely wild from a biomedical perspective. When the male fuses with the female, his tissue becomes <strong>her tissue</strong>. In any other vertebrate on the planet, this would trigger immediate immune rejection. Your body recognises foreign tissue and destroys it. That's why organ transplants require immunosuppressive drugs. That's why skin grafts from strangers don't take.</p>

            <p>So how does the female anglerfish accept what is essentially a permanent tissue graft from a genetically distinct individual?</p>

            <p>In 2020, researchers sequenced the genomes of multiple anglerfish species and found something extraordinary. Species that practise sexual parasitism have <strong>broken adaptive immune systems</strong>. They've lost functional genes for:</p>
            <ul>
                <li><strong>MHC-I and MHC-II molecules</strong> (the "identity cards" that let immune cells distinguish self from non-self)</li>
                <li><strong>T-cell receptors</strong> (the soldiers that would normally attack foreign tissue)</li>
                <li><strong>Antibody genes</strong> (critical components of adaptive immunity)</li>
            </ul>

            <p>They are, as far as we know, the <strong>only vertebrates that have naturally dismantled their own adaptive immune system</strong> and survived. They rely entirely on innate immunity, the older, less specific branch of immune defence.</p>

            <div class="modal-section-divider"></div>

            <h3>🧬 Why This Matters Beyond the Deep Sea</h3>
            <p>Transplant rejection remains one of the biggest challenges in modern medicine. Patients who receive donated organs take immunosuppressive drugs for life, leaving them vulnerable to infections and cancers. If we could understand <em>exactly</em> how anglerfish tolerate foreign tissue without these drugs, without getting infections, without developing tumours, it could reshape transplant immunology.</p>

            <p>It also raises a fascinating evolutionary question: how do you survive without adaptive immunity? Every other vertebrate needs it. Anglerfish apparently don't. What does that tell us about the deep sea as an environment, and about the flexibility of immune systems we thought were non-negotiable?</p>

            <div class="modal-section-divider"></div>

            <h3>💡 The Takeaway</h3>
            <p>Biology's strangest stories often hide its most important lessons. A parasitic mating strategy in a fish most people will never see contains clues to problems that affect millions of transplant patients. The deep sea didn't just produce a disturbing love story. It produced a natural experiment in immune tolerance that no lab could have designed.</p>

            <p>Sometimes the best research questions are hiding in the weirdest organisms.</p>
        `
    },

    'blog-liver-regen': {
        title: 'Your Liver is a Wolverine (And You Didn\'t Even Know)',
        readingTime: '5 min read',
        content: `
            <h3>🦸 The Organ That Refuses to Die</h3>
            <p>If you could pick one superpower for an organ, regeneration would be a solid choice. Your liver already has it. A surgeon can remove up to <strong>70% of a healthy human liver</strong>, and within weeks, the remaining tissue will proliferate and restore the organ to its original mass. Not its original shape, but its original functional capacity. No other solid organ in the human body comes close.</p>

            <p>Your skin heals wounds. Your bones knit fractures. But your liver can lose the majority of itself and just... grow back. It's the closest thing to a biological superpower that mammals have.</p>

            <div class="modal-section-divider"></div>

            <h3>🏛️ The Greeks Knew (Sort Of)</h3>
            <p>The myth of Prometheus is one of the oldest stories in Western literature. Zeus punished Prometheus for giving fire to humanity by chaining him to a rock and sending an eagle to eat his liver every day. Every night, the liver grew back, and the torture repeated.</p>

            <p>Here's the remarkable part: the ancient Greeks had <strong>no formal knowledge of hepatic regeneration</strong>. No microscopes, no cell biology, no concept of mitosis. Yet they chose the liver, specifically, as the organ that regenerates. Whether this was a lucky guess, folk observation from animal butchering, or genuine empirical knowledge passed down through oral tradition, nobody knows for certain. But they were right.</p>

            <div class="modal-section-divider"></div>

            <h3>⚙️ How It Actually Works</h3>
            <p>Liver regeneration is not stem-cell driven, and that surprises most people. Unlike your gut lining or your blood cells, the liver doesn't rely on a reserve population of stem cells waiting to be activated. Instead, mature <strong>hepatocytes</strong>, the fully differentiated workhorse cells of the liver, re-enter the cell cycle and start dividing.</p>

            <p>Think about that. These are adult, specialised cells that have been quietly doing their metabolic jobs (detoxification, bile production, protein synthesis) and suddenly they flip a switch and start behaving like embryonic cells again. The process involves a cascade of signals:</p>
            <ul>
                <li><strong>Cytokines</strong> like TNF-alpha and IL-6 kick-start the "priming" phase</li>
                <li><strong>Growth factors</strong> like HGF (hepatocyte growth factor) and EGF drive proliferation</li>
                <li><strong>Metabolic signals</strong> (bile acids, insulin) regulate the pace</li>
            </ul>

            <p>Within 24 to 72 hours of partial hepatectomy in animal models, hepatocytes are actively dividing. By 7 to 10 days, liver mass is substantially restored.</p>

            <div class="modal-section-divider"></div>

            <h3>🛑 The Stop Signal Mystery</h3>
            <p>Here's what keeps researchers up at night. The liver knows when to <strong>stop</strong> growing. It doesn't just keep proliferating indefinitely. It restores itself to approximately the correct mass for the body it's in, and then the hepatocytes go quiet again. They exit the cell cycle and return to their normal differentiated functions.</p>

            <p>How does it "know" when it's big enough? The leading hypothesis involves a concept called the <strong>"hepatostat"</strong>, a sensing mechanism that monitors the ratio of liver mass to body mass, possibly through the flux of bile acids or portal blood flow. But the precise molecular switch that says "okay, that's enough" remains one of the open questions in regenerative biology.</p>

            <div class="modal-section-divider"></div>

            <h3>🔥 The Cruel Irony: Regeneration Meets Cancer</h3>
            <p>This is where the story takes a dark turn, and it's the reason I study hepatocellular carcinoma.</p>

            <p>The liver's extraordinary regenerative capacity is a <strong>double-edged sword</strong>. In a healthy liver, the regeneration machinery is tightly controlled. But in a chronically damaged liver, one scarred by hepatitis B, hepatitis C, alcohol abuse, or fatty liver disease, the brakes start to fail.</p>

            <p>Chronic inflammation forces hepatocytes into repeated cycles of death and regeneration. Each round of cell division is another opportunity for DNA replication errors. Combine that with an increasingly fibrotic microenvironment, oxidative stress, and epigenetic changes, and you have a recipe for cancer.</p>

            <p><strong>Hepatocellular carcinoma</strong> is the 6th most common cancer worldwide and the 3rd leading cause of cancer death. The organ with the best regeneration in the human body is also one of the most common sites for lethal cancer. The very machinery that makes the liver resilient is co-opted by cancer to fuel its own growth.</p>

            <div class="modal-section-divider"></div>

            <h3>💡 Why This Matters</h3>
            <p>Understanding liver regeneration isn't just an academic exercise. It's the foundation for understanding why liver cancer happens, how to catch it earlier, and potentially how to harness regenerative pathways for therapeutic benefit without tipping into malignancy. The liver's superpower is real. But like every good superpower story, it comes with a cost.</p>
        `
    },

    'blog-apoptosis': {
        title: 'The Kill Switch Inside Every Cell (That Cancer Learns to Disable)',
        readingTime: '5 min read',
        content: `
            <h3>💣 Your Cells Are Designed to Self-Destruct</h3>
            <p>Right now, as you read this, millions of your cells are killing themselves. On purpose. In an orderly, controlled, highly regulated fashion. And that's a good thing.</p>

            <p>This process is called <strong>apoptosis</strong> (pronounced "ay-pop-TOE-sis"), and it is one of the most important biological programs in your body. It's the reason your fingers are separated instead of webbed. It's the reason your immune system doesn't attack you. And when it breaks, it's one of the primary reasons cancer exists.</p>

            <div class="modal-section-divider"></div>

            <h3>🛡️ The Scale of Daily Damage</h3>
            <p>Your DNA is under constant assault. Every single cell in your body experiences an estimated <strong>10,000 to 100,000 DNA damage events per day</strong>. Ultraviolet light, reactive oxygen species from normal metabolism, errors during DNA replication, environmental mutagens. The genome is not sitting in a vault; it's taking hits around the clock.</p>

            <p>Most of this damage gets repaired. You have an entire army of DNA repair enzymes (base excision repair, nucleotide excision repair, mismatch repair, homologous recombination) that work constantly to patch things up. But sometimes the damage is too severe, or it accumulates faster than the repair machinery can handle.</p>

            <p>When that happens, the cell faces a choice: try to limp along with damaged DNA, or activate the kill switch.</p>

            <div class="modal-section-divider"></div>

            <h3>👤 The Guardian: p53</h3>
            <p>Meet <strong>TP53</strong>, the gene that encodes the p53 protein, often called the "Guardian of the Genome." When DNA damage is detected, p53 activates and does a quick assessment. Can this damage be repaired? If yes, p53 pauses the cell cycle to give repair enzymes time to work. If no, p53 triggers apoptosis. The cell dismantles itself from the inside out.</p>

            <p>During apoptosis, the cell doesn't burst open and spill its contents everywhere (that's <strong>necrosis</strong>, and it causes inflammation). Instead, it shrinks. Its chromatin condenses. Its DNA is sliced into neat fragments by enzymes called <strong>caspases</strong>. The cell packages itself into tidy little membrane-bound parcels called "apoptotic bodies," which are quietly consumed by neighbouring cells and macrophages. No mess. No inflammation. Just a clean exit.</p>

            <p>It's cellular seppuku, performed with surgical precision.</p>

            <div class="modal-section-divider"></div>

            <h3>🦠 How Cancer Cuts the Wires</h3>
            <p>Cancer is, at its core, a disease of broken control systems. And disabling apoptosis is one of the first things a developing tumour needs to accomplish. A cancer cell that can still self-destruct is a cancer cell that won't survive long enough to become a tumour.</p>

            <p>Here's how tumours do it:</p>
            <ul>
                <li><strong>p53 mutations:</strong> TP53 is the most commonly mutated gene in human cancer, altered in roughly 50% of all tumours. When p53 is broken, the guardian is blind. Damaged cells that should die keep dividing instead.</li>
                <li><strong>BCL-2 overexpression:</strong> The BCL-2 family of proteins regulate the mitochondrial pathway of apoptosis. Some members (like BCL-2 itself) are anti-apoptotic; they block the death signal. Many cancers crank up BCL-2 production, effectively jamming the kill switch in the "off" position.</li>
                <li><strong>Death receptor downregulation:</strong> Cells have surface receptors (like Fas and TRAIL receptors) that can receive external "kill" signals from immune cells. Some cancers simply stop making these receptors, becoming deaf to outside death orders.</li>
            </ul>

            <div class="modal-section-divider"></div>

            <h3>⏳ The Hayflick Limit: The Other Safety Net</h3>
            <p>Apoptosis isn't the only self-destruct mechanism. Normal cells also have a <strong>built-in expiration date</strong> called the Hayflick Limit. Every time a cell divides, the protective caps on its chromosomes, called <strong>telomeres</strong>, get a little shorter. After roughly 50 to 70 divisions, the telomeres are critically short, and the cell enters senescence (permanent retirement) or triggers apoptosis.</p>

            <p>Cancer bypasses this too. About 85-90% of cancers reactivate an enzyme called <strong>telomerase</strong>, which rebuilds telomeres after each division. The expiration date gets ripped off. The cell becomes, in principle, immortal.</p>

            <div class="modal-section-divider"></div>

            <h3>💊 Re-enabling the Kill Switch</h3>
            <p>Some of the most exciting cancer therapies today aren't trying to kill cancer cells directly. Instead, they're trying to <strong>re-enable the kill switch</strong> that cancer disabled.</p>
            <ul>
                <li><strong>BH3 mimetics</strong> (like Venetoclax): These drugs mimic the pro-apoptotic BH3 proteins and block BCL-2, forcing cancer cells to re-engage their apoptotic machinery. Venetoclax has been transformative for certain blood cancers.</li>
                <li><strong>MDM2 inhibitors:</strong> In cancers where p53 is intact but suppressed by its negative regulator MDM2, these drugs free p53 to do its job again.</li>
                <li><strong>TRAIL receptor agonists:</strong> Synthetic molecules that activate death receptors on cancer cells, bypassing the internal wiring entirely.</li>
            </ul>

            <p>The logic is elegant: you don't need to invent a new way to kill cancer. The cell already knows how to kill itself. You just need to remind it.</p>

            <div class="modal-section-divider"></div>

            <h3>💡 The Takeaway</h3>
            <p>Every cell in your body is one broken safety check away from becoming cancerous. The fact that cancer is relatively rare, given the number of cells and the rate of DNA damage, is a testament to how robust these self-destruct systems are. And when they fail, understanding exactly <em>how</em> they fail is the key to fixing them.</p>
        `
    },

    'blog-common-cold': {
        title: 'Why Scientists Still Can\'t Cure the Common Cold (But Can Edit Genes)',
        readingTime: '4 min read',
        content: `
            <h3>🤧 The Embarrassing Gap in Modern Medicine</h3>
            <p>Consider the state of biomedical science in 2025. We can edit specific letters in the human genome using CRISPR. We developed mRNA vaccines against a novel coronavirus in under a year. We can grow miniature organs from stem cells in a dish. We have immunotherapies that cure previously terminal cancers.</p>

            <p>And yet, rhinovirus, the most common cause of the common cold, still makes billions of people miserable every single year. No cure. No vaccine. Not even a particularly good treatment beyond "rest, fluids, and wait."</p>

            <p>How is that possible?</p>

            <div class="modal-section-divider"></div>

            <h3>🎭 The Problem of 160 Faces</h3>
            <p>The first and biggest obstacle is <strong>antigenic diversity</strong>. When we say "the common cold," we're not talking about one virus. Rhinovirus alone has over <strong>160 known serotypes</strong>, and that's before you count the coronaviruses (yes, some cause colds), adenoviruses, parainfluenza viruses, and respiratory syncytial virus that also produce cold-like symptoms.</p>

            <p>Each serotype has a slightly different surface protein profile. An antibody that neutralises rhinovirus serotype 14 does essentially nothing against serotype 72. Immunity to one cold doesn't protect you from the next one, because the next one is likely a different serotype entirely.</p>

            <p>Compare this to measles. Measles virus has <strong>one serotype</strong>. One vaccine covers all of it. One infection gives lifelong immunity. That's why we can vaccinate against measles and not against the common cold.</p>

            <div class="modal-section-divider"></div>

            <h3>📍 The Location Problem</h3>
            <p>Rhinovirus infects the <strong>upper respiratory tract</strong>: your nose, sinuses, and throat. This creates a pharmacological headache. Systemic drugs (pills, injections) are designed to reach the bloodstream, but the upper respiratory mucosa isn't richly perfused in a way that makes drug delivery easy. Nasal sprays can reach the surface, but penetrating the mucus layer and maintaining therapeutic concentrations is harder than it sounds.</p>

            <p>The virus also replicates <strong>fast</strong>. By the time you feel symptoms, the viral load is already near its peak. Antiviral drugs work best when given early, ideally before symptoms appear. But nobody takes medicine for a cold they don't have yet.</p>

            <div class="modal-section-divider"></div>

            <h3>🔥 The Plot Twist: You're Doing It to Yourself</h3>
            <p>Here's the part that surprises most people. The runny nose, the sore throat, the congestion, the sneezing? <strong>That's not the virus.</strong> That's your immune system.</p>

            <p>Rhinovirus itself causes relatively little direct tissue damage. The symptoms you experience are almost entirely the result of your inflammatory immune response: histamine release, cytokine production, vasodilation, increased mucus secretion. Your body is waging war, and you're caught in the crossfire.</p>

            <p>This is why antihistamines and anti-inflammatory drugs provide some symptomatic relief. They're not fighting the virus; they're dampening your own immune overreaction. It also explains why immunocompromised patients sometimes have <em>milder</em> cold symptoms. Fewer immune soldiers means less collateral damage.</p>

            <div class="modal-section-divider"></div>

            <h3>💉 Why Not Just Make a Vaccine?</h3>
            <p>People ask this constantly, and the answer comes down to a cost-benefit calculation. A rhinovirus vaccine would need to cover dozens of serotypes to be useful (a monovalent vaccine covering one serotype would prevent maybe 1-2% of colds). Multivalent vaccines exist, but a 160-valent vaccine is a manufacturing and regulatory nightmare.</p>

            <p>More importantly, the common cold is <strong>mild</strong>. It lasts a week. It almost never kills healthy adults. The risk-benefit ratio for an aggressive vaccination program against a self-limiting illness doesn't add up, especially when the side effects of the vaccine might be comparable to the disease itself.</p>

            <p>Contrast this with COVID-19, which had a significant mortality rate, overwhelmed hospitals, and caused long-term complications. The urgency justified the investment. Rhinovirus simply doesn't generate that urgency, even though its cumulative economic impact (missed work, healthcare visits, over-the-counter spending) runs into billions annually.</p>

            <div class="modal-section-divider"></div>

            <h3>🧩 The Broader Lesson</h3>
            <p>The common cold teaches us something important about how we think about disease. We assume that "simple" diseases should be easy to solve and "complex" ones should be hard. But complexity and difficulty don't always correlate.</p>

            <p>Editing a gene with CRISPR is conceptually complex but technically tractable: one target, one mechanism, one outcome to measure. Curing the common cold requires simultaneously solving antigenic diversity, mucosal drug delivery, rapid viral replication, immune-mediated symptoms, and the economics of treating a non-lethal illness. The "simple" cold is actually a harder problem than gene editing, because it's not one problem. It's five problems stacked on top of each other.</p>

            <div class="modal-section-divider"></div>

            <h3>💡 The Takeaway</h3>
            <p>Next time you're sniffling through a box of tissues and wondering why we can split atoms but can't fix this, remember: the cold isn't unsolved because scientists aren't smart enough. It's unsolved because it's a problem where biology, pharmacology, immunology, virology, and economics all collide, and none of them are on your side. Some of the most "everyday" problems in medicine are the hardest ones to crack.</p>
        `
    }
}

// ===== CV MODAL FUNCTIONALITY =====
function initializeCVModal() {
    const cvModal = document.getElementById('cv-modal');
    const viewCvBtn = document.getElementById('view-cv-btn');
    const closeCvBtn = document.querySelector('.close-cv');

    if (viewCvBtn && cvModal) {
        viewCvBtn.addEventListener('click', function(e) {
            e.preventDefault();
            cvModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeCvBtn) {
        closeCvBtn.addEventListener('click', function() {
            cvModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }

    // Close when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === cvModal) {
            cvModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cvModal.classList.contains('show')) {
            cvModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });
}

// ===== MODAL FUNCTIONALITY =====
function openBlog(blogId) {
    const modal = document.getElementById('blog-modal');
    const modalBody = document.getElementById('modal-body');
    const data = blogData[blogId];
    
    if (data) {
        const headerImage = data.image ? `<img src="${data.image}" alt="${data.title}" class="modal-header-image">` : '';
        const readingTime = data.readingTime ? `<div class="modal-reading-time"><i class="fas fa-clock"></i> ${data.readingTime}</div>` : '';
        modalBody.innerHTML = `
            ${headerImage}
            <h2 class="modal-title">${data.title}</h2>
            ${readingTime}
            <div class="modal-text">
                ${data.content}
            </div>
        `;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

// Close modal functionality
document.addEventListener('click', function(e) {
    const modal = document.getElementById('blog-modal');
    if (e.target.classList.contains('close-modal') || e.target === modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
});

// Close with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('blog-modal');
        if (modal && modal.classList.contains('show')) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }
});

// Initialize blog card listeners
function initializeBlogListeners() {
    const blogCards = document.querySelectorAll('.portfolio-card[data-blog-id]');
    blogCards.forEach(card => {
        card.addEventListener('click', function() {
            const blogId = this.getAttribute('data-blog-id');
            openBlog(blogId);
        });
    });
}
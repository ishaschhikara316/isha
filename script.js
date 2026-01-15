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
        const emailRegex = /^[^S@]+@[^S@]+\.[^S@]+$/;
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
    'drdo': {
        title: 'Research Trainee @ DIPAS, DRDO: Physiology at the Extremes',
        image: 'Image/Hypoxia.png',
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
        image: 'Image/CAD.png',
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
        image: 'Image/Crispr-Cas9.png',
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
    }
};

// ===== MODAL FUNCTIONALITY =====
function openBlog(blogId) {
    const modal = document.getElementById('blog-modal');
    const modalBody = document.getElementById('modal-body');
    const data = blogData[blogId];
    
    if (data) {
        const headerImage = data.image ? `<img src="${data.image}" alt="${data.title}" class="modal-header-image">` : '';
        modalBody.innerHTML = `
            ${headerImage}
            <h2 class="modal-title">${data.title}</h2>
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
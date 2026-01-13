/**
 * CODE CRAFT - Main JavaScript File
 * Handles animations, mobile menu, form submissions, and UI interactions
 */

// Defer non-critical initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Intersection Observer
    initIntersectionObserver();
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Initialize form handling
    initFormHandling();
    
    // Initialize popup handling
    initPopupHandling();
});

// Intersection Observer for animations
function initIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    let observer;
    try {
        observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
    } catch (error) {
        console.error('Intersection Observer not supported:', error);
        return;
    }

    // Observe elements with error handling
    function observeElements(selector) {
        try {
            document.querySelectorAll(selector).forEach(element => {
                if (observer) observer.observe(element);
            });
        } catch (error) {
            console.error(`Error observing ${selector}:`, error);
        }
    }

    // Observe all sections, titles, and cards
    observeElements('.section');
    observeElements('.section-title');
    observeElements('.member-card, .workshop-card, .testimonial-card');
}

// Mobile menu functionality
function initMobileMenu() {
    const toggleButton = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (toggleButton && navLinks) {
        toggleButton.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            toggleButton.classList.toggle('active');
        });
    }
    
    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (toggleButton) toggleButton.classList.remove('active');
            }
        });
    });
    
    // Back to top button functionality
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(function() {
                backToTopButton.classList.toggle('show', window.pageYOffset > 300);
            });
        });
    }
}

// Form handling
function initFormHandling() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            try {
                const formData = new FormData(this);
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    const popup = document.getElementById('thankYouPopup');
                    if (popup) {
                        popup.classList.add('active');
                        this.reset();
                    }
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                // Show error message to user
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = 'Sorry, there was an error submitting the form. Please try again.';
                contactForm.appendChild(errorMessage);
                setTimeout(() => errorMessage.remove(), 5000);
            }
        });
    }
}

// Popup handling
function initPopupHandling() {
    const popup = document.getElementById('thankYouPopup');
    if (popup) {
        const popupContent = popup.querySelector('.popup-content');
        
        // Close popup when clicking outside
        document.addEventListener('click', function(e) {
            if (popup.classList.contains('active') && popupContent && !popupContent.contains(e.target)) {
                popup.classList.remove('active');
            }
        });
        
        // Close popup when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && popup.classList.contains('active')) {
                popup.classList.remove('active');
            }
        });
    }
}

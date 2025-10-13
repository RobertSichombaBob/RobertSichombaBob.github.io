// assets/js/animations.js
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupParallaxEffects();
    }

    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, options);

        // Observe all animate-on-scroll elements
        document.querySelectorAll('[data-animate]').forEach(el => {
            this.observer.observe(el);
        });
    }

    animateElement(element) {
        const animationType = element.getAttribute('data-animate');
        
        switch (animationType) {
            case 'fade-in':
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                break;
            case 'slide-left':
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                break;
            case 'slide-right':
                element.style.opacity = '1';
                element.style.transform = 'translateX(0)';
                break;
            case 'scale':
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';
                break;
        }

        // Remove the attribute to prevent re-animation
        element.removeAttribute('data-animate');
    }

    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;

            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }
}

// Typing animation for hero text
class TypeWriter {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.textIndex % this.texts.length;
        const fullText = this.texts[current];

        if (this.isDeleting) {
            this.currentText = fullText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.currentText = fullText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        this.element.innerHTML = this.currentText;

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === fullText.length) {
            typeSpeed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex++;
            typeSpeed = 500; // Pause before start
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize scroll animations
    window.scrollAnimations = new ScrollAnimations();

    // Initialize typewriter effect if element exists
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const texts = JSON.parse(typewriterElement.getAttribute('data-texts') || '["Data Scientist", "Geophysicist", "Materials Engineer"]');
        new TypeWriter(typewriterElement, texts, 100);
    }

    // Add animation classes to elements
    document.querySelectorAll('.card-hover').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease-out ${index * 0.1}s`;
    });
});
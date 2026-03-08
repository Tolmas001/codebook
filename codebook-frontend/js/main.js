// ========================================
// CODEBOOK - MAIN JAVASCRIPT
// ========================================

// API Base URL (use relative path when served from same server)
const API_BASE_URL = '/api';

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
const navbar = document.querySelector('.navbar');
const scrollToTopBtn = document.getElementById('scrollToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
        scrollToTopBtn.style.display = 'block';
    } else {
        navbar.classList.remove('scrolled');
        scrollToTopBtn.style.display = 'none';
    }
});

// ========================================
// SCROLL TO TOP
// ========================================
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// MOBILE MENU TOGGLE
// ========================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========================================
// PORTFOLIO FILTER
// ========================================
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// ========================================
// CONTACT FORM SUBMISSION
// ========================================
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    try {
        submitBtn.textContent = 'Yuborilmoqda...';
        submitBtn.disabled = true;

        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Xabaringiz muvaffaqiyatli yuborildi! Tez orada siz bilan bog\'lanamiz.');
            contactForm.reset();
        } else {
            const error = await response.json();
            alert('Xatolik yuz berdi: ' + error.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Server bilan bog\'lanishda xatolik yuz berdi. Iltimos, keyinroq urinib ko\'ring.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});

// ========================================
// LOAD DATA FROM API (Optional - for dynamic content)
// ========================================
async function loadServices() {
    try {
        const response = await fetch(`${API_BASE_URL}/services`);
        if (response.ok) {
            const services = await response.json();
            renderServices(services);
        }
    } catch (error) {
        console.log('Using static services data');
    }
}

async function loadPortfolio() {
    try {
        const response = await fetch(`${API_BASE_URL}/portfolio`);
        if (response.ok) {
            const portfolio = await response.json();
            renderPortfolio(portfolio);
        }
    } catch (error) {
        console.log('Using static portfolio data');
    }
}

async function loadTeam() {
    try {
        const response = await fetch(`${API_BASE_URL}/team`);
        if (response.ok) {
            const team = await response.json();
            renderTeam(team);
        }
    } catch (error) {
        console.log('Using static team data');
    }
}

function renderServices(services) {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;

    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="service-icon">
                <i class="fas fa-${service.icon || 'code'}"></i>
            </div>
            <h3>${service.title}</h3>
            <p>${service.description}</p>
        </div>
    `).join('');
}

function renderPortfolio(portfolio) {
    const portfolioGrid = document.getElementById('portfolio-grid');
    if (!portfolioGrid) return;

    portfolioGrid.innerHTML = portfolio.map(item => `
        <div class="portfolio-item" data-category="${item.category}">
            <img src="${item.image}" alt="${item.title}">
            <div class="portfolio-overlay">
                <h3>${item.title}</h3>
                <p>${item.category}</p>
            </div>
        </div>
    `).join('');
}

function renderTeam(team) {
    const teamGrid = document.getElementById('team-grid');
    if (!teamGrid) return;

    teamGrid.innerHTML = team.map(member => `
        <div class="team-card">
            <div class="team-image">
                <img src="${member.image}" alt="${member.name}">
                <div class="team-social">
                    ${member.socialLinks?.linkedin ? `<a href="${member.socialLinks.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                    ${member.socialLinks?.github ? `<a href="${member.socialLinks.github}" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                    ${member.socialLinks?.twitter ? `<a href="${member.socialLinks.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
                </div>
            </div>
            <div class="team-info">
                <h3>${member.name}</h3>
                <p>${member.position}</p>
            </div>
        </div>
    `).join('');
}

// ========================================
// ANIMATION ON SCROLL
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Add animation class to elements
document.querySelectorAll('.service-card, .portfolio-item, .team-card, .why-choose-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Apply animation
const animateElements = () => {
    document.querySelectorAll('.service-card, .portfolio-item, .team-card, .why-choose-card').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    });
};

// Trigger animation on load
setTimeout(animateElements, 100);

// ========================================
// NEWSLETTER FORM
// ========================================
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        if (email) {
            alert('Rahmat! Email manzilingiz ro\'yxatga qo\'shildi.');
            newsletterForm.reset();
        }
    });
}

// ========================================
// INITIALIZE
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Try to load data from API
    loadServices();
    loadPortfolio();
    loadTeam();
});

// ===================================
// DOM Elements
// ===================================
const themeToggle = document.getElementById('themeToggle');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const simForm = document.getElementById('simForm');
const cnicForm = document.getElementById('cnicForm');
const loadingState = document.getElementById('loadingState');
const resultState = document.getElementById('resultState');
const cnicResultState = document.getElementById('cnicResultState');
const captchaQuestion = document.getElementById('captchaQuestion');
const captchaInput = document.getElementById('captchaInput');
const toast = document.getElementById('toast');
const tabBtns = document.querySelectorAll('.tab-btn');
const faqItems = document.querySelectorAll('.faq-item');

// ===================================
// Theme Toggle
// ===================================
let currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (currentTheme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// ===================================
// Mobile Menu Toggle
// ===================================
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===================================
// Captcha System
// ===================================
let captchaAnswer = 0;

function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    captchaAnswer = num1 + num2;
    captchaQuestion.textContent = `${num1} + ${num2} = ?`;
}

generateCaptcha();

// ===================================
// SIM Form Submission
// ===================================
simForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const phoneNumber = document.getElementById('phoneNumber').value.trim();
    const captchaValue = parseInt(captchaInput.value);
    const phoneError = document.getElementById('phoneError');
    
    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
        phoneError.textContent = 'Please enter a valid 10-digit Pakistani mobile number';
        return;
    }
    
    // Validate captcha
    if (captchaValue !== captchaAnswer) {
        showToast('Incorrect captcha! Please try again.');
        generateCaptcha();
        captchaInput.value = '';
        return;
    }
    
    // Hide form, show loading
    simForm.style.display = 'none';
    resultState.style.display = 'none';
    loadingState.style.display = 'block';
    
    // Simulate API call
    setTimeout(() => {
        loadingState.style.display = 'none';
        displaySIMResult(phoneNumber);
        resultState.style.display = 'block';
        generateCaptcha();
        captchaInput.value = '';
    }, 2000);
});

function validatePhoneNumber(number) {
    // Pakistani mobile numbers start with 3 and are 10 digits
    const pattern = /^3\d{9}$/;
    return pattern.test(number);
}

function getNetworkOperator(number) {
    const prefix = number.substring(0, 4);
    const networks = {
        '30': 'Jazz',
        '31': 'Jazz',
        '32': 'Jazz',
        '33': 'Jazz',
        '34': 'Jazz',
        '35': 'Telenor',
        '36': 'Zong',
        '37': 'Zong',
        '38': 'Ufone',
        '39': 'Ufone',
        '300': 'SCO',
        '301': 'SCO'
    };
    
    for (let key in networks) {
        if (prefix.startsWith(key)) {
            return networks[key];
        }
    }
    return 'Unknown';
}

function displaySIMResult(phoneNumber) {
    const formattedNumber = `0${phoneNumber}`;
    const network = getNetworkOperator(phoneNumber);
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    // Mock data - in real app this would come from API
    const mockNames = ['Muhammad Ahmed', 'Ali Khan', 'Fatima Bibi', 'Hassan Raza', 'Ayesha Malik'];
    const locations = ['Punjab, Pakistan', 'Sindh, Pakistan', 'KPK, Pakistan', 'Balochistan, Pakistan', 'Islamabad, Pakistan'];
    
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    
    document.getElementById('resName').textContent = randomName;
    document.getElementById('resNumber').textContent = formattedNumber.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
    document.getElementById('resNetwork').textContent = network;
    document.getElementById('resLocation').textContent = randomLocation;
    document.getElementById('resDate').textContent = dateStr;
    
    showToast('Record found successfully!');
}

// ===================================
// CNIC Form Submission
// ===================================
cnicForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const cnicNumber = document.getElementById('cnicNumber').value.trim();
    const terms = document.getElementById('terms').checked;
    const cnicError = document.getElementById('cnicError');
    
    // Validate CNIC
    if (!validateCNIC(cnicNumber)) {
        cnicError.textContent = 'Please enter a valid 13-digit CNIC number';
        return;
    }
    
    if (!terms) {
        showToast('Please agree to the terms and conditions');
        return;
    }
    
    // Hide form, show loading
    cnicForm.style.display = 'none';
    cnicResultState.style.display = 'none';
    loadingState.style.display = 'block';
    
    // Simulate API call
    setTimeout(() => {
        loadingState.style.display = 'none';
        displayCNICResult(cnicNumber);
        cnicResultState.style.display = 'block';
    }, 2000);
});

function validateCNIC(cnic) {
    // CNIC should be 13 digits
    const pattern = /^\d{13}$/;
    return pattern.test(cnic);
}

function displayCNICResult(cnicNumber) {
    // Format CNIC: XXXXX-XXXXXXX-X
    const formatted = `${cnicNumber.substring(0,5)}-${cnicNumber.substring(5,12)}-${cnicNumber.substring(12)}`;
    
    // Mock data
    document.getElementById('cnicResName').textContent = 'Ali Khan';
    document.getElementById('cnicResFather').textContent = 'Usman Khan';
    document.getElementById('cnicResDob').textContent = '01-01-1990';
    document.getElementById('cnicResAddress').textContent = `House ${cnicNumber.substring(0,2)}, Street ${cnicNumber.substring(2,4)}, Islamabad`;
    
    showToast('CNIC verified successfully!');
}

// ===================================
// Tab Switching (SIM/CNIC)
// ===================================
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Reset forms
        simForm.style.display = 'flex';
        cnicForm.style.display = 'flex';
        resultState.style.display = 'none';
        cnicResultState.style.display = 'none';
        
        if (btn.dataset.tab === 'sim') {
            simForm.style.display = 'flex';
            cnicForm.style.display = 'none';
        } else {
            simForm.style.display = 'none';
            cnicForm.style.display = 'flex';
        }
    });
});

// ===================================
// FAQ Accordion
// ===================================
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close all items
        faqItems.forEach(i => i.classList.remove('active'));
        
        // Open clicked item if it wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// ===================================
// Stats Counter Animation
// ===================================
const statItems = document.querySelectorAll('.stat-item h3');
let statsAnimated = false;

function animateStats() {
    statItems.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 50;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (current > target) current = target;
                
                if (target === 24) {
                    stat.textContent = Math.ceil(current);
                } else if (target === 99) {
                    stat.textContent = Math.ceil(current);
                } else {
                    stat.textContent = Math.ceil(current).toLocaleString();
                }
                
                setTimeout(updateCounter, 30);
            } else {
                if (target === 99) {
                    stat.textContent = target + '%';
                } else if (target === 24) {
                    stat.textContent = target + '/7';
                } else {
                    stat.textContent = target.toLocaleString() + '+';
                }
            }
        };
        
        updateCounter();
    });
}

// Trigger animation when stats are visible
const statsSection = document.querySelector('.stats');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            animateStats();
            statsAnimated = true;
        }
    });
}, { threshold: 0.5 });

if (statsSection) {
    observer.observe(statsSection);
}

// ===================================
// Toast Notification
// ===================================
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===================================
// Smooth Scroll for Navigation
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// Active Navigation Link on Scroll
// ===================================
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            current = sectionId;
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===================================
// Input Formatting
// ===================================
const phoneNumberInput = document.getElementById('phoneNumber');
const cnicNumberInput = document.getElementById('cnicNumber');

phoneNumberInput.addEventListener('input', (e) => {
    // Remove any non-digit characters
    e.target.value = e.target.value.replace(/\D/g, '');
    
    // Clear error when user starts typing
    document.getElementById('phoneError').textContent = '';
});

cnicNumberInput.addEventListener('input', (e) => {
    // Remove any non-digit characters
    e.target.value = e.target.value.replace(/\D/g, '');
    
    // Clear error when user starts typing
    document.getElementById('cnicError').textContent = '';
});

// ===================================
// Header Shadow on Scroll
// ===================================
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.boxShadow = 'var(--shadow-md)';
    } else {
        header.style.boxShadow = 'var(--shadow-sm)';
    }
});

// ===================================
// Initialize
// ===================================
console.log('PakSimInfo initialized successfully!');

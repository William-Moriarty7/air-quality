// Main JavaScript file for the Air Quality Dashboard
document.addEventListener("DOMContentLoaded", function() {
    // Initialize modules
    window.mapModule.initMap();
    window.chartsModule.initCharts();
    window.mindmapModule.initMindMap();
    window.regionalMindmapModule.initRegionalMindMap();
    
    // Setup navigation and scrolling
    setupNavigation();
    
    // Setup animations and interactions
    setupAnimations();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Setup resize handler
    handleResize();
});

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // Add click event to navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            // Scroll to section smoothly
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
            
            // Update active link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
            
            // Close mobile menu if open
            document.querySelector('.nav-links').classList.remove('active');
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Setup animations for elements
function setupAnimations() {
    // Detect elements to animate on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    // Initial check for elements in viewport
    checkAnimatedElements();
    
    // Check elements on scroll
    window.addEventListener('scroll', checkAnimatedElements);
    
    // Function to check if elements are in viewport
    function checkAnimatedElements() {
        const windowHeight = window.innerHeight;
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    }
}

// Setup mobile menu
function setupMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.mobile-menu-btn') && !e.target.closest('.nav-links')) {
            navLinks.classList.remove('active');
        }
    });
}

// Handle window resize events
function handleResize() {
    let resizeTimer;
    
    window.addEventListener('resize', function() {
        // Clear previous timeout
        clearTimeout(resizeTimer);
        
        // Set new timeout to prevent multiple resize events
        resizeTimer = setTimeout(function() {
            // Refresh charts on resize
            window.chartsModule.updateCharts();
            
            // Other resize-related actions can be added here
        }, 250);
    });
}

// Utility function for scroll-to actions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        window.scrollTo({
            top: section.offsetTop - 70,
            behavior: 'smooth'
        });
        
        // Update active nav link
        const navLinks = document.querySelectorAll('.nav-links a');
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector(`.nav-links a[href="#${sectionId}"]`).classList.add('active');
    }
}
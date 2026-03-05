/**
 * LearnOnline Interactive Portal
 * Enhanced JavaScript for Swayam-like experience
 */

(function() {
    'use strict';

    // ============================================
    // DOM Elements
    // ============================================
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');
    const heroSearch = document.getElementById('heroSearch');
    const heroSearchBtn = document.getElementById('heroSearchBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');
    const coursePreviewBtns = document.querySelectorAll('.course-preview-btn');
    const courseModal = document.getElementById('courseModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    const modalIcon = document.getElementById('modalIcon');
    const prevTestimonial = document.getElementById('prevTestimonial');
    const nextTestimonial = document.getElementById('nextTestimonial');
    const testimonialsTrack = document.getElementById('testimonialsTrack');
    const testimonialDots = document.getElementById('testimonialDots');
    const statNumbers = document.querySelectorAll('.stat-number');

    // Course Data
    const courseData = {
        cs: {
            title: 'Computer Science',
            description: 'Master programming, algorithms, data structures, and software development fundamentals.',
            icon: '💻',
            duration: '12 weeks',
            videos: '50+ Video Lectures',
            projects: '25+ Projects',
            curriculum: [
                'Programming Fundamentals',
                'Data Structures & Algorithms',
                'Web Development Basics',
                'Database Management',
                'Software Engineering Principles'
            ]
        },
        business: {
            title: 'Business Management',
            description: 'Learn strategic marketing, finance, leadership, and organizational management skills.',
            icon: '📊',
            duration: '10 weeks',
            videos: '40+ Video Lectures',
            projects: '20+ Projects',
            curriculum: [
                'Business Fundamentals',
                'Marketing Strategy',
                'Financial Management',
                'Leadership Skills',
                'Project Management'
            ]
        },
        engineering: {
            title: 'Engineering',
            description: 'Explore mechanical, electrical, and civil engineering concepts and practical applications.',
            icon: '⚙️',
            duration: '14 weeks',
            videos: '60+ Video Lectures',
            projects: '30+ Projects',
            curriculum: [
                'Engineering Fundamentals',
                'Mechanical Systems',
                'Electrical Circuits',
                'Structural Analysis',
                'CAD Software'
            ]
        },
        datascience: {
            title: 'Data Science',
            description: 'Dive into Python, machine learning, data analysis, and visualization techniques.',
            icon: '📈',
            duration: '16 weeks',
            videos: '70+ Video Lectures',
            projects: '35+ Projects',
            curriculum: [
                'Python Programming',
                'Data Analysis',
                'Machine Learning',
                'Data Visualization',
                'Deep Learning'
            ]
        },
        webdev: {
            title: 'Web Development',
            description: 'Learn HTML, CSS, JavaScript, React and modern web development frameworks.',
            icon: '🎨',
            duration: '12 weeks',
            videos: '55+ Video Lectures',
            projects: '28+ Projects',
            curriculum: [
                'HTML & CSS',
                'JavaScript Fundamentals',
                'React Framework',
                'Backend Development',
                'Deploy & Maintain'
            ]
        },
        marketing: {
            title: 'Digital Marketing',
            description: 'Master SEO, social media marketing, content strategy, and online advertising.',
            icon: '📱',
            duration: '8 weeks',
            videos: '35+ Video Lectures',
            projects: '15+ Projects',
            curriculum: [
                'SEO Basics',
                'Social Media Marketing',
                'Content Strategy',
                'PPC Advertising',
                'Analytics'
            ]
        }
    };

    // ============================================
    // Mobile Menu Toggle
    // ============================================
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
            });
        });
    }

    // ============================================
    // Active Navigation on Scroll
    // ============================================
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();

    // ============================================
    // Animated Counter
    // ============================================
    function animateCounter(element, target) {
        const duration = 2000; // 2 seconds
        const start = 0;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * (target - start) + start);
            
            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(update);
    }

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => counterObserver.observe(stat));

    // ============================================
    // Course Filtering
    // ============================================
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter courses
            courseCards.forEach(card => {
                const category = card.dataset.category;
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ============================================
    // Search Functionality
    // ============================================
    function performSearch(query) {
        const searchTerm = query.toLowerCase().trim();
        
        if (searchTerm === '') {
            // Show all courses
            courseCards.forEach(card => {
                card.classList.remove('hidden');
            });
            // Reset filter buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            document.querySelector('[data-filter="all"]').classList.add('active');
            return;
        }

        // Hide filter buttons active state
        filterBtns.forEach(btn => btn.classList.remove('active'));

        // Search in course titles and descriptions
        courseCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const category = card.dataset.category;

            if (title.includes(searchTerm) || description.includes(searchTerm) || category.includes(searchTerm)) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    }

    if (heroSearch) {
        heroSearch.addEventListener('input', function() {
            performSearch(this.value);
        });

        heroSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
                // Scroll to courses section
                document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    if (heroSearchBtn) {
        heroSearchBtn.addEventListener('click', function() {
            performSearch(heroSearch.value);
            document.getElementById('courses').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // ============================================
    // Course Preview Modal
    // ============================================
    function openModal(courseKey) {
        const course = courseData[courseKey];
        if (!course) return;

        modalTitle.textContent = course.title;
        modalDescription.textContent = course.description;
        modalIcon.textContent = course.icon;

        // Update modal details
        const modalDetails = document.querySelector('.modal-details');
        modalDetails.innerHTML = `
            <div class="modal-detail">
                <i class="fas fa-clock"></i>
                <span>Duration: ${course.duration}</span>
            </div>
            <div class="modal-detail">
                <i class="fas fa-video"></i>
                <span>${course.videos}</span>
            </div>
            <div class="modal-detail">
                <i class="fas fa-file-code"></i>
                <span>${course.projects}</span>
            </div>
            <div class="modal-detail">
                <i class="fas fa-certificate"></i>
                <span>Certificate Included</span>
            </div>
        `;

        // Update curriculum
        const curriculumList = document.querySelector('.modal-curriculum ul');
        curriculumList.innerHTML = course.curriculum.map(item => 
            `<li><i class="fas fa-check"></i> ${item}</li>`
        ).join('');

        courseModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        courseModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    coursePreviewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const courseKey = this.dataset.course;
            openModal(courseKey);
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && courseModal.classList.contains('active')) {
            closeModal();
        }
    });

    // ============================================
    // Testimonials Carousel
    // ============================================
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial-card');
    const totalTestimonials = testimonials.length;

    // Create dots
    for (let i = 0; i < totalTestimonials; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToTestimonial(i));
        testimonialDots.appendChild(dot);
    }

    const dots = document.querySelectorAll('.dot');

    function updateTestimonial() {
        testimonialsTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentTestimonial);
        });
    }

    function goToTestimonial(index) {
        currentTestimonial = index;
        updateTestimonial();
    }

    function nextSlide() {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        updateTestimonial();
    }

    function prevSlide() {
        currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
        updateTestimonial();
    }

    if (nextTestimonial) {
        nextTestimonial.addEventListener('click', nextSlide);
    }

    if (prevTestimonial) {
        prevTestimonial.addEventListener('click', prevSlide);
    }

    // Auto-rotate testimonials
    let testimonialInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    const testimonialsCarousel = document.querySelector('.testimonials-carousel');
    if (testimonialsCarousel) {
        testimonialsCarousel.addEventListener('mouseenter', () => {
            clearInterval(testimonialInterval);
        });
        
        testimonialsCarousel.addEventListener('mouseleave', () => {
            testimonialInterval = setInterval(nextSlide, 5000);
        });
    }

    // ============================================
    // Smooth Scroll for Navigation
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // ============================================
    // Form Validation (from original script)
    // ============================================
    const form = document.getElementById('studentForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const courseSelect = document.getElementById('course');

    if (form) {
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const phoneError = document.getElementById('phoneError');
        const courseError = document.getElementById('courseError');

        function showError(input, errorElement, message) {
            input.classList.add('input-error');
            input.classList.remove('input-success');
            errorElement.textContent = message;
            return false;
        }

        function showSuccess(input, errorElement) {
            input.classList.remove('input-error');
            input.classList.add('input-success');
            errorElement.textContent = '';
            return true;
        }

        function clearValidation(input, errorElement) {
            input.classList.remove('input-error', 'input-success');
            errorElement.textContent = '';
        }

        function validateName() {
            const name = fullNameInput.value.trim();
            if (name === '') {
                return showError(fullNameInput, nameError, 'Full name is required');
            }
            if (name.length < 2) {
                return showError(fullNameInput, nameError, 'Name must be at least 2 characters');
            }
            if (!/^[a-zA-Z\s'-]+$/.test(name)) {
                return showError(fullNameInput, nameError, 'Name can only contain letters, spaces, hyphens, and apostrophes');
            }
            return showSuccess(fullNameInput, nameError);
        }

        function validateEmail() {
            const email = emailInput.value.trim();
            if (email === '') {
                return showError(emailInput, emailError, 'Email address is required');
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                return showError(emailInput, emailError, 'Please enter a valid email address');
            }
            return showSuccess(emailInput, emailError);
        }

        function validatePhone() {
            const phone = phoneInput.value.trim();
            if (phone === '') {
                return showError(phoneInput, phoneError, 'Phone number is required');
            }
            const phonePattern = /^[\d\s\-\+\(\)]{10,}$/;
            if (!phonePattern.test(phone)) {
                return showError(phoneInput, phoneError, 'Please enter a valid phone number (at least 10 digits)');
            }
            const digitsOnly = phone.replace(/\D/g, '');
            if (digitsOnly.length < 10) {
                return showError(phoneInput, phoneError, 'Phone number must have at least 10 digits');
            }
            return showSuccess(phoneInput, phoneError);
        }

        function validateCourse() {
            const course = courseSelect.value;
            if (course === '') {
                return showError(courseSelect, courseError, 'Please select a course');
            }
            return showSuccess(courseSelect, courseError);
        }

        fullNameInput.addEventListener('blur', validateName);
        emailInput.addEventListener('blur', validateEmail);
        phoneInput.addEventListener('blur', validatePhone);
        courseSelect.addEventListener('blur', validateCourse);

        fullNameInput.addEventListener('input', () => clearValidation(fullNameInput, nameError));
        emailInput.addEventListener('input', () => clearValidation(emailInput, emailError));
        phoneInput.addEventListener('input', () => clearValidation(phoneInput, phoneError));
        courseSelect.addEventListener('change', () => clearValidation(courseSelect, courseError));

        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isPhoneValid = validatePhone();
            const isCourseValid = validateCourse();

            if (isNameValid && isEmailValid && isCourseValid && isPhoneValid) {
                const formData = {
                    fullName: fullNameInput.value.trim(),
                    email: emailInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    course: courseSelect.value
                };

                console.log('Registration Successful!');
                console.log('Form Data:', formData);

                showSuccessMessage();
                form.reset();
                
                [fullNameInput, emailInput, phoneInput, courseSelect].forEach(input => {
                    input.classList.remove('input-success');
                });
            } else {
                if (!isNameValid) {
                    fullNameInput.focus();
                } else if (!isEmailValid) {
                    emailInput.focus();
                } else if (!isPhoneValid) {
                    phoneInput.focus();
                } else if (!isCourseValid) {
                    courseSelect.focus();
                }
            }
        });

        function showSuccessMessage() {
            const successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.setAttribute('role', 'alert');
            successDiv.textContent = 'Registration Successful! Welcome to the course.';
            
            successDiv.style.cssText = `
                background: #d4edda;
                color: #155724;
                padding: 15px 20px;
                border-radius: 5px;
                border: 1px solid #c3e6cb;
                margin: 20px auto;
                max-width: 450px;
                text-align: center;
                animation: slideIn 0.3s ease;
            `;

            form.parentNode.insertBefore(successDiv, form);

            setTimeout(() => {
                successDiv.remove();
            }, 5000);
        }
    }

    // ============================================
    // Add CSS Animations Dynamically
    // ============================================
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // Initialize
    // ============================================
    console.log('LearnOnline Interactive Portal initialized!');
    
})();


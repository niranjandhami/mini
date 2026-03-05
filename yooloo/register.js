/**
 * Registration Form Handler
 * Professional validation with user-friendly feedback
 */

(function() {
    'use strict';

    // DOM Elements
    const registerForm = document.getElementById('registerForm');
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const courseSelect = document.getElementById('courseSelect');
    const registerPassword = document.getElementById('registerPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const courseError = document.getElementById('courseError');
    const successAlert = document.getElementById('successAlert');
    const passwordToggle = document.getElementById('passwordToggle');

    // Password Toggle
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('registerPassword');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }

    // Utility: Show error
    function showError(input, errorEl, message) {
        if (input) {
            input.classList.add('error');
            input.classList.remove('success');
        }
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('visible');
        }
    }

    // Utility: Show success
    function showSuccess(input, errorEl) {
        if (input) {
            input.classList.remove('error');
            input.classList.add('success');
        }
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('visible');
        }
    }

    // Utility: Clear validation
    function clearValidation(input, errorEl) {
        if (input) {
            input.classList.remove('error', 'success');
        }
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('visible');
        }
    }

    // Validate name
    function validateName() {
        const name = fullName.value.trim();
        if (name === '') {
            showError(fullName, nameError, 'Full name is required');
            return false;
        }
        if (name.length < 2) {
            showError(fullName, nameError, 'Name must be at least 2 characters');
            return false;
        }
        if (!/^[a-zA-Z\s'-]+$/.test(name)) {
            showError(fullName, nameError, 'Name can only contain letters, spaces, hyphens, and apostrophes');
            return false;
        }
        showSuccess(fullName, nameError);
        return true;
    }

    // Validate email
    function validateEmail() {
        const emailValue = email.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailValue === '') {
            showError(email, emailError, 'Email is required');
            return false;
        }
        if (!emailRegex.test(emailValue)) {
            showError(email, emailError, 'Please enter a valid email');
            return false;
        }
        showSuccess(email, emailError);
        return true;
    }

    // Validate phone
    function validatePhone() {
        const phoneValue = phone.value.trim();
        const phonePattern = /^[\d\s\-\+\(\)]{10,}$/;

        if (phoneValue === '') {
            showError(phone, phoneError, 'Phone number is required');
            return false;
        }
        if (!phonePattern.test(phoneValue)) {
            showError(phone, phoneError, 'Please enter a valid phone number');
            return false;
        }
        const digitsOnly = phoneValue.replace(/\D/g, '');
        if (digitsOnly.length < 10) {
            showError(phone, phoneError, 'Phone number must have at least 10 digits');
            return false;
        }
        showSuccess(phone, phoneError);
        return true;
    }

    // Validate course
    function validateCourse() {
        const course = courseSelect.value;
        if (course === '') {
            showError(courseSelect, courseError, 'Please select a course');
            return false;
        }
        showSuccess(courseSelect, courseError);
        return true;
    }

    // Validate password
    function validatePassword() {
        const password = registerPassword.value;
        
        if (password === '') {
            showError(registerPassword, null, 'Password is required');
            return false;
        }
        if (password.length < 6) {
            showError(registerPassword, null, 'Password must be at least 6 characters');
            return false;
        }
        registerPassword.classList.remove('error');
        registerPassword.classList.add('success');
        return true;
    }

    // Validate confirm password
    function validateConfirmPassword() {
        const password = registerPassword.value;
        const confirm = confirmPassword.value;
        
        if (confirm === '') {
            showError(confirmPassword, null, 'Please confirm your password');
            return false;
        }
        if (password !== confirm) {
            showError(confirmPassword, null, 'Passwords do not match');
            return false;
        }
        confirmPassword.classList.remove('error');
        confirmPassword.classList.add('success');
        return true;
    }

    // Event Listeners - Real-time validation
    if (fullName) {
        fullName.addEventListener('blur', validateName);
        fullName.addEventListener('input', () => clearValidation(fullName, nameError));
    }

    if (email) {
        email.addEventListener('blur', validateEmail);
        email.addEventListener('input', () => clearValidation(email, emailError));
    }

    if (phone) {
        phone.addEventListener('blur', validatePhone);
        phone.addEventListener('input', () => clearValidation(phone, phoneError));
    }

    if (courseSelect) {
        courseSelect.addEventListener('blur', validateCourse);
        courseSelect.addEventListener('change', () => clearValidation(courseSelect, courseError));
    }

    if (registerPassword) {
        registerPassword.addEventListener('blur', validatePassword);
        registerPassword.addEventListener('input', () => {
            registerPassword.classList.remove('error', 'success');
        });
    }

    if (confirmPassword) {
        confirmPassword.addEventListener('blur', validateConfirmPassword);
        confirmPassword.addEventListener('input', () => {
            confirmPassword.classList.remove('error', 'success');
        });
    }

    // Form Submission
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const isNameValid = validateName();
            const isEmailValid = validateEmail();
            const isPhoneValid = validatePhone();
            const isCourseValid = validateCourse();
            const isPasswordValid = validatePassword();
            const isConfirmValid = validateConfirmPassword();

            if (isNameValid && isEmailValid && isPhoneValid && isCourseValid && isPasswordValid && isConfirmValid) {
                // Show success message
                if (successAlert) {
                    successAlert.classList.add('visible');
                }

                // Simulate registration delay
                setTimeout(() => {
                    console.log('Registration data:', {
                        fullName: fullName.value.trim(),
                        email: email.value.trim(),
                        phone: phone.value.trim(),
                        course: courseSelect.value,
                        password: registerPassword.value
                    });
                    
                    // Reset form
                    registerForm.reset();
                    [fullName, email, phone, courseSelect, registerPassword, confirmPassword].forEach(input => {
                        if (input) input.classList.remove('success');
                    });
                    
                    // Hide alert
                    if (successAlert) {
                        successAlert.classList.remove('visible');
                    }
                    
                    // Redirect to login
                    alert('Registration successful! Please login to continue.');
                    window.location.href = 'login.html';
                }, 500);
            } else {
                // Focus first invalid field
                if (!isNameValid && fullName) {
                    fullName.focus();
                } else if (!isEmailValid && email) {
                    email.focus();
                } else if (!isPhoneValid && phone) {
                    phone.focus();
                } else if (!isCourseValid && courseSelect) {
                    courseSelect.focus();
                } else if (!isPasswordValid && registerPassword) {
                    registerPassword.focus();
                } else if (!isConfirmValid && confirmPassword) {
                    confirmPassword.focus();
                }
            }
        });
    }
})();


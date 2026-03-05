/**
 * Login Form Handler
 * Professional validation with user-friendly feedback
 */

(function() {
    'use strict';

    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const loginEmail = document.getElementById('loginEmail');
    const loginPassword = document.getElementById('loginPassword');
    const loginEmailError = document.getElementById('loginEmailError');
    const loginPasswordError = document.getElementById('loginPasswordError');
    const successAlert = document.getElementById('successAlert');
    const passwordToggle = document.getElementById('passwordToggle');

    // Password Toggle
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('loginPassword');
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
        input.classList.add('error');
        input.classList.remove('success');
        errorEl.textContent = message;
        errorEl.classList.add('visible');
    }

    // Utility: Show success
    function showSuccess(input, errorEl) {
        input.classList.remove('error');
        input.classList.add('success');
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
    }

    // Utility: Clear validation
    function clearValidation(input, errorEl) {
        input.classList.remove('error', 'success');
        errorEl.textContent = '';
        errorEl.classList.remove('visible');
    }

    // Validate email
    function validateEmail() {
        const email = loginEmail.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === '') {
            showError(loginEmail, loginEmailError, 'Email is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            showError(loginEmail, loginEmailError, 'Please enter a valid email');
            return false;
        }
        showSuccess(loginEmail, loginEmailError);
        return true;
    }

    // Validate password
    function validatePassword() {
        const password = loginPassword.value;

        if (password === '') {
            showError(loginPassword, loginPasswordError, 'Password is required');
            return false;
        }
        if (password.length < 6) {
            showError(loginPassword, loginPasswordError, 'Password must be at least 6 characters');
            return false;
        }
        showSuccess(loginPassword, loginPasswordError);
        return true;
    }

    // Event Listeners - Real-time validation
    if (loginEmail) {
        loginEmail.addEventListener('blur', validateEmail);
        loginEmail.addEventListener('input', () => clearValidation(loginEmail, loginEmailError));
    }

    if (loginPassword) {
        loginPassword.addEventListener('blur', validatePassword);
        loginPassword.addEventListener('input', () => clearValidation(loginPassword, loginPasswordError));
    }

    // Form Submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const isEmailValid = validateEmail();
            const isPasswordValid = validatePassword();

            if (isEmailValid && isPasswordValid) {
                // Show success message
                if (successAlert) {
                    successAlert.classList.add('visible');
                }

                // Simulate login delay
                setTimeout(() => {
                    console.log('Login data:', {
                        email: loginEmail.value.trim(),
                        password: loginPassword.value
                    });
                    
                    // Reset form
                    loginForm.reset();
                    [loginEmail, loginPassword].forEach(input => {
                        input.classList.remove('success');
                    });
                    
                    // Hide alert
                    if (successAlert) {
                        successAlert.classList.remove('visible');
                    }
                    
                    // Show final message
                    alert('Login successful! Welcome back.');
                }, 500);
            } else {
                // Focus first invalid field
                if (!isEmailValid && loginEmail) {
                    loginEmail.focus();
                } else if (!isPasswordValid && loginPassword) {
                    loginPassword.focus();
                }
            }
        });
    }
})();


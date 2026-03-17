// Clean script - simplified login/register for reliable flow
function showMessage(el, message, type = 'success') {
  const msg = document.getElementById(el);
  if (msg) {
    msg.className = `alert alert-${type}`;
    msg.textContent = message;
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 5000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Register
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.onsubmit = (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(registerForm));
      if (formData.password !== formData.confirmPassword) {
        showMessage('message', 'Passwords do not match!', 'error');
        return;
      }
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.email === formData.email)) {
        showMessage('message', 'Email already registered! Use different email or reset.', 'error');
        return;
      }
      users.push({...formData, id: Date.now()});
      localStorage.setItem('users', JSON.stringify(users));
      showMessage('message', 'Registered! Redirecting to login...', 'success');
      setTimeout(() => location.href = 'login.html', 1500);
    };
  }

  // Login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.onsubmit = (e) => {
      e.preventDefault();
      const formData = Object.fromEntries(new FormData(loginForm));
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        showMessage('message', 'Login successful!', 'success');
        setTimeout(() => location.href = 'dashboard.html', 1000);
      } else {
        showMessage('message', 'Invalid email/password!', 'error');
      }
    };
  }

  // Demo bypass
  if (loginForm) {
    const demoBtn = document.createElement('button');
    demoBtn.textContent = 'Demo Login (test@example.com / 123)';
    demoBtn.type = 'button';
    demoBtn.className = 'btn btn-secondary';
    demoBtn.style.marginTop = '1rem';
    demoBtn.onclick = () => {
      const demoUser = {id: 1, email: 'test@example.com', fullName: 'Demo User'};
      localStorage.setItem('users', JSON.stringify([demoUser]));
      localStorage.setItem('currentUser', JSON.stringify(demoUser));
      location.href = 'dashboard.html';
    };
    loginForm.parentNode.appendChild(demoBtn);
  }

// Dashboard - load courses
  if (location.pathname.includes('dashboard.html')) {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!user.id) location.href = 'login.html';

    async function loadCourses() {
      try {
        const response = await fetch('courses.json');
        return await response.json();
      } catch {
        return []; // fallback empty
      }
    }

    async function initDashboard() {
      const courses = await loadCourses();
      const categoriesEl = document.getElementById('categories') || document.createElement('div');
      const courseListEl = document.getElementById('courseList') || document.createElement('div');
      const datesList = document.getElementById('courseDatesList');
      const registeredEl = document.getElementById('registeredCourses');

      // My registrations
      const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
      if (registrations.length) {
        const userRegs = registrations.filter(r => r.userId == user.id);
        if (userRegs.length) registeredEl.innerHTML = '<h3>My Registrations</h3>' + userRegs.map(r => `<div>${r.course}</div>`).join('');
      }

      if (courses.length === 0) {
        categoriesEl.innerHTML = '<p>No courses available.</p>';
        return;
      }

      // Categories
      courses.forEach(category => {
        const catEl = document.createElement('div');
        catEl.className = 'course-card';
        catEl.innerHTML = `<h4>${category.category}</h4>`;
        catEl.onclick = () => showCourses(category.courses, category.category);
        categoriesEl.appendChild(catEl);
      });
      document.getElementById('courseSelection').appendChild(categoriesEl);

      // All courses list
      courses.forEach(category => {
        const catDiv = document.createElement('div');
        catDiv.innerHTML = `<h4>${category.category}</h4>`;
        category.courses.forEach(course => {
          const li = document.createElement('li');
          li.innerHTML = `<strong>${course.name}</strong> (${course.examDate})`;
          catDiv.appendChild(li);
        });
        datesList.appendChild(catDiv);
      });

      document.getElementById('logout').onclick = () => {
        localStorage.removeItem('currentUser');
        location.href = 'index.html';
      };
    }

    function showCourses(courses, name) {
      const el = document.getElementById('courseList');
      el.innerHTML = `<h4>${name}</h4>`;
      courses.forEach(course => {
        const div = document.createElement('div');
        div.className = 'course-card';
        div.style.display = 'flex';
        div.style.gap = '1rem';
        div.style.alignItems = 'center';
        div.innerHTML = `
          <div>
            <h5>${course.name}</h5>
            <small>Exam: ${course.examDate}</small>
          </div>
          <button class="btn btn-success" onclick="window.startCourse('${course.id}')">Start</button>
        `;
        el.appendChild(div);
      });
    }

    window.startCourse = (id) => {
      localStorage.setItem('selectedCourse', id);
      location.href = 'exam-personal.html';
    };

    initDashboard();
  }

  // Exam forms (personal, education, documents)
  ['personalForm', 'educationForm'].forEach(id => {
    const form = document.getElementById(id);
    if (form) form.onsubmit = (e) => {
      e.preventDefault();
      localStorage.setItem(`exam${id.slice(0,-4)}Data`, JSON.stringify(Object.fromEntries(new FormData(form))));
      location.href = id === 'personalForm' ? 'exam-education.html' : 'exam-documents.html';
    };
  });

  // Documents
  const docsForm = document.getElementById('documentsForm');
  if (docsForm) docsForm.onsubmit = (e) => {
    e.preventDefault();
    showMessage('message', 'Success! Registration complete.', 'success');
    setTimeout(() => location.href = 'confirmation.html', 1500);
  };
});

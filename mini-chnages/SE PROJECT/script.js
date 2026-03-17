// Core functionality for Online Exam Registration System

// Show message helper
function showMessage(el, message, type = 'success') {
  const msg = document.getElementById(el);
  msg.className = `alert alert-${type}`;
  msg.textContent = message;
  msg.style.display = 'block';
  setTimeout(() => msg.style.display = 'none', 5000);
}

// User registration
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));
  
  if (formData.password !== formData.confirmPassword) {
    showMessage('message', 'Passwords do not match!', 'error');
    return;
  }
  
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      showMessage('message', 'Registration successful! Please login.', 'success');
      setTimeout(() => window.location.href = 'login.html', 1500);
    } else {
      showMessage('message', 'Registration failed. Email may already exist.', 'error');
    }
  } catch {
    // Fallback localStorage (for demo)
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === formData.email)) {
      showMessage('message', 'Email already registered!', 'error');
      return;
    }
    users.push({...formData, id: Date.now()});
    localStorage.setItem('users', JSON.stringify(users));
    showMessage('message', 'Registration successful! Please login.', 'success');
    setTimeout(() => window.location.href = 'login.html', 1500);
  }
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));
  
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      const user = await response.json();
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = 'dashboard.html';
    }
  } catch {
    // Fallback localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === formData.email && u.password === formData.password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      window.location.href = 'dashboard.html';
    } else {
      showMessage('message', 'Invalid credentials!', 'error');
    }
  }
});

// Dashboard functionality
if (window.location.pathname.includes('dashboard.html')) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  if (!currentUser.id) window.location.href = 'login.html';

  // Load courses
  async function loadCourses() {
    const response = await fetch('courses.json');
    return await response.json();
  }

  // Load exam data
  async function loadExamData() {
    const response = await fetch('exam-data.json');
    return await response.json();
  }

  // Initialize dashboard
  async function initDashboard() {
    // Show registered courses
    const registrations = JSON.parse(localStorage.getItem('registrations') || '[]');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const registeredCoursesEl = document.getElementById('registeredCourses');
    
    if (registrations.length > 0) {
      const userRegs = registrations.filter(r => r.userId == currentUser.id);
      if (userRegs.length > 0) {
        registeredCoursesEl.innerHTML = `
          <h3 style="color: var(--secondary); margin-bottom: 1rem;">My Registrations</h3>
          <div style="display: grid; gap: 1rem;">
            ${userRegs.map(reg => `<div class="course-card"><strong>REG${reg.id.slice(-6)}</strong> - ${reg.course}</div>`).join('')}
          </div>
        `;
      }
    }
    
    const courses = await loadCourses();
    const categoriesEl = document.getElementById('categories');
    const datesList = document.getElementById('courseDatesList');
    
    courses.forEach((category, catIndex) => {
      const catEl = document.createElement('div');
      catEl.className = 'course-card';
      catEl.innerHTML = `<h4>${category.category}</h4>`;
      catEl.onclick = () => showCourses(category.courses, category.category);
      categoriesEl.appendChild(catEl);
      
      // Add to course list with dates
      const catDiv = document.createElement('div');
      catDiv.style.marginBottom = '2rem';
      catDiv.innerHTML = `<h4 style="margin-bottom: 1rem;">${category.category}</h4>`;
      const courseUl = document.createElement('ul');
      courseUl.style.listStyle = 'none';
      
      category.courses.forEach(course => {
        const li = document.createElement('li');
        li.style.padding = '0.5rem 0';
        li.style.fontSize = '0.95rem';
        li.innerHTML = `<strong>${course.name}</strong> <small style="color: #6b7280;">(${course.examDate})</small>`;
        courseUl.appendChild(li);
      });
      
      catDiv.appendChild(courseUl);
      datesList.appendChild(catDiv);
    });
  }

  // Show courses in category
  function showCourses(courses, categoryName) {
    const courseList = document.getElementById('courseList');
    if (!courseList) return;
    courseList.innerHTML = `<h4>${categoryName} Courses</h4><div style="display: grid; gap: 1rem; margin-top: 1rem;">`;
    
    courses.forEach(course => {
      const courseEl = document.createElement('div');
      courseEl.className = 'course-card';
      courseEl.innerHTML = `
        <div style="flex: 1;">
          <h5>${course.name}</h5>
          <p><small>Exam Date: ${course.examDate}</small></p>
        </div>
        <button onclick="startExamRegistration('${course.id}')" class="btn btn-success" style="width: auto; padding: 0.5rem 1rem;">Start Registration</button>
      `;
      courseList.appendChild(courseEl);
    });
    courseList.innerHTML += '</div>';
  }

  window.startExamRegistration = function(courseId) {
    localStorage.setItem('selectedCourse', courseId);
    window.location.href = 'exam-personal.html';
  };

  // Logout
  document.getElementById('logout').onclick = () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  };

  initDashboard();
}

// Multi-step exam registration handlers
// Personal form
document.getElementById('personalForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));
  localStorage.setItem('examPersonalData', JSON.stringify(formData));
  window.location.href = 'exam-education.html';
});

// Education form
document.getElementById('educationForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));
  localStorage.setItem('examEducationData', JSON.stringify(formData));
  window.location.href = 'exam-documents.html';
});

// Documents form  
document.getElementById('documentsForm')?.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Validate files exist (demo)
  const photo = document.getElementById('photo').files[0];
  const signature = document.getElementById('signature').files[0];
  const idProof = document.getElementById('idProof').files[0];
  
  if (!photo || !signature || !idProof) {
    showMessage('message', 'Please upload all required documents!', 'error');
    return;
  }
  
  // Simulate upload success
  showMessage('message', 'Documents uploaded successfully!', 'success');
  setTimeout(() => window.location.href = 'confirmation.html', 1500);
});

// File preview
function previewFile(inputId, previewId) {
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  input.onchange = () => {
    const file = input.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        preview.innerHTML = `<img src="${e.target.result}" style="max-width: 150px; max-height: 150px; border-radius: 8px;">`;
      };
      reader.readAsDataURL(file);
    }
  };
}

previewFile('photo', 'photoPreview');
previewFile('signature', 'signaturePreview');

// Page guards
document.addEventListener('DOMContentLoaded', function() {
  // Login form handler (ensure it runs after DOM loaded)
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const formData = Object.fromEntries(new FormData(loginForm));
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'dashboard.html';
      } else {
        showMessage('message', 'Invalid email or password!', 'error');
      }
    });
  }
  
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const formData = Object.fromEntries(new FormData(registerForm));
      
      if (formData.password !== formData.confirmPassword) {
        showMessage('message', 'Passwords do not match!', 'error');
        return;
      }
      
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.email === formData.email)) {
        showMessage('message', 'Email already registered!', 'error');
        return;
      }
      
      users.push({...formData, id: Date.now()});
      localStorage.setItem('users', JSON.stringify(users));
      showMessage('message', 'Registration successful! Redirecting to login...', 'success');
      setTimeout(() => window.location.href = 'login.html', 1500);
    });
  }
  
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
  if (window.location.pathname.includes('dashboard.html') && !user.id) {
    window.location.href = 'login.html';
  }
  if ((window.location.pathname.includes('register-user.html') || window.location.pathname.includes('login.html')) && user.id) {
    window.location.href = 'dashboard.html';
  }
  if (window.location.pathname.includes('exam-') && !user.id) {
    window.location.href = 'login.html';
  }
});

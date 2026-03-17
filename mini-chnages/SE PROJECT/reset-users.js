<html>
<body>
<script>
localStorage.removeItem('users');
localStorage.removeItem('currentUser');
localStorage.removeItem('registrations');
alert('Cleared all localStorage data. Now try register/login again.');
window.location.href = 'index.html';
</script>
</body>
</html>

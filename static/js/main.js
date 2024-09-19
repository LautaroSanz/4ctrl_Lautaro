document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', function(event) {
            event.preventDefault();
            login();
        });
    }

    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', function(event) {
            event.preventDefault();
            register();
        });
    }

    if (document.getElementById('logoutButton')) {
        document.getElementById('logoutButton').addEventListener('click', function() {
            logout();
        });
    }

    checkAuthStatus();
});

function login() {
    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.redirect_url) {
            window.location.href = data.redirect_url;  // Redirige al usuario a la URL proporcionada
        } else {
            document.getElementById('message').innerText = data.message;
        }
    })
    .catch(error => console.error('Error logging in:', error));
}

function register() {
    fetch('/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: document.getElementById('username').value,
            password: document.getElementById('password').value
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('message').innerText = data.message;
        if (data.message === 'User registered successfully') {
            window.location.href = '/login';  // Redirige al login después del registro exitoso
        }
    })
    .catch(error => console.error('Error registering:', error));
}

function logout() {
    fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include'  // Asegúrate de incluir cookies en las solicitudes
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Logged out successfully') {
            window.location.href = '/login';  // Redirige al login después de cerrar sesión
        }
    })
    .catch(error => console.error('Error logging out:', error));
}

function checkAuthStatus() {
    fetch('/auth/status', {
        method: 'GET',
        credentials: 'include'  // Asegúrate de incluir cookies en las solicitudes
    })
    .then(response => response.json())
    .then(data => {
        if (data.isAuthenticated) {
            // El usuario está autenticado
            if (window.location.pathname === '/login' || window.location.pathname === '/register') {
                window.location.href = '/';  // Redirige a la página principal si ya está autenticado
            }
        } else {
            // El usuario no está autenticado
            if (window.location.pathname === '/') {
                window.location.href = '/login';  // Redirige al login si no está autenticado
            }
        }
    })
    .catch(error => console.error('Error checking auth status:', error));
}

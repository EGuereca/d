document.getElementById('registerForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evitar recargar la página

    const name = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const registerError = document.getElementById('registerError');

    try {
        const response = await fetch('http://localhost/ApiRepartidor/api/register', { // Cambia esta URL si es necesario
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            window.location.href = 'Login.html'; // Redirigir al login
        } else {
            registerError.textContent = data.message || 'Error en el registro.';
            registerError.style.display = 'block';
        }
    } catch (error) {
        console.error('Error en la petición:', error);
        registerError.textContent = 'Error de conexión con el servidor.';
        registerError.style.display = 'block';
    }
});

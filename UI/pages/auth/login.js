document.getElementById('login').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Prepare URL-encoded form data
    const formData = new URLSearchParams();
    formData.append('username', event.target.username.value); // Map to form field 'username'
    formData.append('password', event.target.password.value); // Map to form field 'password'

    try {
        const response = await fetch('http://localhost:8000/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            console.log('User login:', result);
            window.location.href = './homepage/homepage.html'; // Redirect on successful login
        } else {
            const error = await response.json();
            console.error('Error:', error.detail);
            document.querySelector('.form__message--error').textContent = error.detail || 'Invalid input.';
        }
    } catch (error) {
        console.error('Network error:', error);
        document.querySelector('.form__message--error').textContent = 'Network error. Please try again later.';
    }
});

document.getElementById('login').addEventListener('submit', async (event) => {
    event.preventDefault();

    // use a regular object
    const loginData = {
        username: event.target.username.value,
        password: event.target.password.value
    };

    try {
        const response = await fetch('http://localhost:8000/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log('User login:', result);
            window.location.href = '../home/index.html'; 
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

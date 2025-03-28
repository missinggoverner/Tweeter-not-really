document.getElementById('createAccount').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    // Get form data
    const formData = new FormData(event.target);
    const data = {
        email: formData.get('email'),
        user_name: formData.get('username'),
        password: formData.get('password'),
        conform_password: formData.get('confirm_password'),
    };
    
    try {
        const response = await fetch('http://localhost:8000/users/', { // Adjust the URL as needed
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const result = await response.json();
            console.log('User created:', result);
            // Optionally redirect or show a success message
            window.location.href = '../login.html'; // Redirect to login page after successful signup
        } else {
            const error = await response.json();
            console.error('Error:', error.detail);
            // Show error message to the user
            document.querySelector('.form__message--error').textContent = error.detail;
        }
    } catch (error) {
        console.error('Network error:', error);
        document.querySelector('.form__message--error').textContent = 'Network error. Please try again later.';
    }
});

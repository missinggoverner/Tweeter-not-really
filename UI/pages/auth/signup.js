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
        const response = await fetch('http://localhost:8000/users/', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if(!response.ok){
            const error = await response.json();
            if(response.status === 422){
                document.querySelector('.form__message--error').textContent = 'Missing required fields or Wrong Data type';
            }
            else if(response.status === 400){
                document.querySelector('.form__message--error').textContent = error.detail;
            }
        }
        else if (response.ok) {
            const result = await response.json();
            console.log('User created:', result);
            window.location.href = 'login.html'; 
        }
    } catch (error) {
        console.error('Network error:', error);
        document.querySelector('.form__message--error').textContent = 'Network error. Please try again later.';
    }
});

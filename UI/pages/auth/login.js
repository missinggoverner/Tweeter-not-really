const username = document.getElementById('username');
const password = document.getElementById('password');

document.querySelector('#loginButton').addEventListener('click', async (event) => {
    event.preventDefault();

    if (!username.value || !password.value) {
        document.querySelector('.form__message--error').textContent = 'Username and password are required';
        return;
    }


    try {
        const response = await fetch('http://localhost:8000/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `username=${username.value}&password=${password.value}`
        });

        if (response.ok) {
            const result = await response.json();
            console.log('User login:', result);
            let twtToken = result.access_token;
            let user = result.user_name;
            console.log(user);
            localStorage.setItem('token', twtToken);
            localStorage.setItem('user', user);
            console.log(localStorage.getItem('token'));
            window.location.href = '../home/index.html'; 
        } else if (response.status === 422) {
            const error = await response.json();
            console.error('Full error response:', error); 
            document.querySelector('.form__message--error').textContent = 
            error.detail?.[0]?.msg || error.detail?.[0]?.type || JSON.stringify(error);
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
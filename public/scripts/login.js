const login = async (email, password) => {
    try {
        const res = await axios.post(
            'http://127.0.0.1:8000/api/v1/users/login',
            { email, password },
            { withCredentials: true }
        );

        // if (res.data.status === 'success') {
        //     alert('Logged in successfully!');
        //     window.setTimeout(() => {
        //         location.assign('/');
        //     }, 500);
        // }
    } catch (error) {
        console.log(error.response.data.message);
    }
};

document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
});

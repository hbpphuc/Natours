import axios from 'axios';
import { showAlert } from './alerts';

export const login = async (email, password) => {
    try {
        const res = await axios.post(
            '/api/v1/users/login',
            { email, password },
            { withCredentials: true }
        );

        if (res.data.status === 'success') {
            showAlert('success', 'Logged in successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1000);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios.get('/api/v1/users/logout');

        if (res.data.status === 'success') {
            showAlert('success', 'Logged out successfully!');
            location.reload();
        }
    } catch (error) {
        showAlert('error', 'Error logging out! Try again.');
    }
};

import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
    try {
        const url =
            type === 'password'
                ? '/api/v1/users/updateMyPassword'
                : '/api/v1/users/updateMe';

        const res = await axios.patch(url, data, { withCredentials: true });

        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} update successfully!`);
            window.setTimeout(() => {
                location.reload();
            }, 1000);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};

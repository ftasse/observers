import axios from 'axios';
import { showAlert } from './alert';
import { hideLoader, showLoader } from './loader';

export const login = async (email, password) => {
  try {
    showLoader();
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signin',
      data: {
        email,
        password
      }
    });
    hideLoader();
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    hideLoader();
    showAlert('failed', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    showLoader();
    const res = await axios({
      method: 'GET',
      url: 'http://127.0.0.1:3000/api/v1/users/signout'
    });

    if (res.data.status === 'success') location.reload();
  } catch (err) {
    showAlert('failed', 'Error logging out. Please try again!');
  }
};

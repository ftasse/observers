import axios from 'axios';
import { showAlert } from './alert';
import { hideLoader, showLoader } from './loader';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    showLoader();
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data: {
        name,
        email,
        password,
        passwordConfirm
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

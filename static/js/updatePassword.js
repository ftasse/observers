import axios from 'axios';
import { showConfirm, showAlert, hideAlert } from './alert';
import { hideLoader, showLoader } from './loader';

const updateUserPassword = async (
  currentPassword,
  password,
  passwordConfirm
) => {
  try {
    showLoader();
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/updatepassword',
      data: {
        currentPassword,
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      hideAlert('.confirm__container');
      showAlert('success', 'Password successfully updated');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    hideLoader();
    showAlert('failed', err.response.data.message);
  }
};

export const updatePassword = form => {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const currentPassword = form.querySelector('#current-password');
    const password = form.querySelector('#password');
    const passwordConfirm = form.querySelector('#password-confirm');

    showConfirm('Are you sure you want to update your password?', () => {
      updateUserPassword(
        currentPassword.value,
        password.value,
        passwordConfirm.value
      );
    });
  });
};

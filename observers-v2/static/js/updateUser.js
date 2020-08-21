import axios from 'axios';
import { showConfirm, showAlert, hideAlert } from './alert';
import { hideLoader, showLoader } from './loader';

const updateUserInfo = async (username, email) => {
  try {
    showLoader();
    const res = await axios({
      method: 'PATCH',
      url: 'http://127.0.0.1:3000/api/v1/users/updateme',
      data: {
        name: username,
        email
      }
    });

    if (res.data.status === 'success') {
      hideAlert('.confirm__container');
      showAlert('success', 'Information successfully updated');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    hideLoader();
    showAlert('failed', err.response.data.message);
  }
};

export const updateUser = form => {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const username = form.querySelector('#username');
    const email = form.querySelector('#email');

    showConfirm('Are you sure you want to update your information?', () => {
      updateUserInfo(username.value, email.value);
    });
  });
};

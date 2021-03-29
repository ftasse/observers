import axios from 'axios';
import { showConfirm, showAlert, hideAlert } from './alert';
import { hideLoader, showLoader } from './loader';

const updateUserInfo = async data => {
  try {
    showLoader();
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateme',
      data
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

    const photoForm = new FormData();
    photoForm.append('name', document.getElementById('username').value);
    photoForm.append('email', document.getElementById('email').value);
    photoForm.append('photo', document.getElementById('photo').files[0]);
    console.log(photoForm);

    showConfirm('Are you sure you want to update your information?', () => {
      updateUserInfo(photoForm);
    });
  });
};

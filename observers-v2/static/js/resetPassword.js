import { hideLoader, showLoader } from './loader';
import axios from 'axios';
import { showAlert } from './alert';

export const forgotPassword = async email => {
  try {
    showLoader();
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email
      }
    });

    if (res.data.status === 'success') {
      hideLoader();
      showAlert(
        'success',
        'Please check your email, a reset token has been sent.'
      );
    }
    hideLoader();
  } catch (err) {
    hideLoader();
    console.log(res);
    showAlert('failed', err.response.data.message);
  }
};

export const resetPassword = async (token, password, passwordConfirm) => {
  try {
    showLoader();
    const res = await axios({
      method: 'POST',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Your password has been reset successfully');
      window.setTimeout(() => {
        location.assign('/');
        hideLoader();
      }, 1500);
    }
    hideLoader();
  } catch (err) {
    hideLoader();
    showAlert('failed', err.response.data.message);
  }
};

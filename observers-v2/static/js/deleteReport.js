import axios from 'axios';
import { hideAlert, showAlert, showConfirm } from './alert';
import { hideLoader, showLoader } from './loader';

export const deleteReport = async reportId => {
  try {
    showLoader();
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/reports/${reportId}`
    });
    if (res.status === 204) {
      showAlert('success', 'Report successfully deleted');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
    hideLoader();
  } catch (err) {
    hideLoader();
    showAlert('failed', err.response.data.message);
  }
};

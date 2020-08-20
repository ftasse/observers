import axios from 'axios';
import { hideAlert, showAlert, showConfirm } from './alert';
import { hideLoader, showLoader } from './loader';

const deleteBtns = document.querySelectorAll('.delete-topic__btn');

const deleteTopic = async topicId => {
  try {
    showLoader();
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:3000/api/v1/topics/${topicId}`
    });
    if (res.status === 204) {
      showAlert('success', 'Topic successfully deleted');
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

deleteBtns.forEach(b => {
  b.addEventListener('click', e => {
    showConfirm('Are you sure you want to delete this topic?', () => {
      deleteTopic(b.dataset.topic);
    });
  });
});

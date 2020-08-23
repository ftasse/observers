import axios from 'axios';
import { showAlert } from './alert';
import { showLoader, hideLoader } from './loader';

const voteBtns = document.querySelectorAll('.report__feel');

const getReport = async report => {
  try {
    const res = await axios({
      method: 'GET',
      url: `/api/v1/reports/${report}`
    });
    if (res.data.status === 'success') {
      return res.data;
    }
  } catch (err) {
    showAlert('failed', 'Something went wrong. Please reload the page');
    return null;
  }
};

const vote = async (op, associatedBtnOp, associatedBtn, btn, report, value) => {
  try {
    showLoader();
    const res = await axios({
      method: 'POST',
      url: '/api/v1/votes',
      data: {
        report,
        value
      }
    });
    if (res.data.status === 'success') {
      window.setTimeout(async () => {
        const updatedReport = await getReport(report);

        btn.classList.toggle('report__feel-btn--active');
        associatedBtn.classList.remove('report__feel-btn--active');
        associatedBtn.querySelector('.report__count').innerText =
          updatedReport.data.data[associatedBtnOp];
        btn.querySelector('.report__count').innerText =
          updatedReport.data.data[op];
        console.log(updatedReport);
        hideLoader();
      }, 1000);
    }
  } catch (err) {
    hideLoader();
    console.log(err);
    showAlert('failed', err.response.data.message);
  }
};

voteBtns.forEach(g => {
  const likeBtn = g.querySelector('.report__feel-btn--like');
  const dislikeBtn = g.querySelector('.report__feel-btn--dislike');

  likeBtn.addEventListener('click', e => {
    let value;
    if (likeBtn.classList.contains('report__feel-btn--active')) value = 0;
    else value = 1;
    vote(
      'numLikes',
      'numDisLikes',
      dislikeBtn,
      likeBtn,
      likeBtn.dataset.report,
      value
    );
  });

  dislikeBtn.addEventListener('click', e => {
    let value;
    if (dislikeBtn.classList.contains('report__feel-btn--active')) value = 0;
    else value = -1;
    vote(
      'numDisLikes',
      'numLikes',
      likeBtn,
      dislikeBtn,
      dislikeBtn.dataset.report,
      value
    );
  });
});

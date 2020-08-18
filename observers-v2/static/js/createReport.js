import axios from 'axios';
import { showLoader, hideLoader } from './loader';
import { showAlert } from './alert';
import { getLocation, geoLocate } from './geolocation';

const submitReport = async (topicId, reportContent, reportMediaUrls) => {
  let position;
  try {
    position = await geoLocate();
  } catch (err) {
    showAlert(
      'warning',
      `${err.message}. Default location of latitude 0 and longitude 0 will be used`
    );
    position = { coords: { latitude: 0, longitude: 0 } };
  }
  try {
    showLoader();
    const reportLocation = await getLocation({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });

    if (!reportLocation) {
      hideLoader();
      return showAlert(
        'failed',
        'Location address not found. Please try again'
      );
    } else {
      const report = {
        topic: topicId,
        content: reportContent,
        location: reportLocation
      };
      if (reportMediaUrls) {
        report.mediaUrls = reportMediaUrls.split(',');
      }

      const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/reports',
        data: report
      });
      if (res.data.status === 'success') {
        showAlert('success', 'Report successfully submitted');
        window.setTimeout(() => {
          location.reload();
        }, 1500);
      }
    }
    hideLoader();
  } catch (err) {
    hideLoader();
    console.log(err);
    showAlert('failed', err.response.data.message);
  }
};

export const createReport = (
  createReportForm,
  reportContentEl,
  reportMediaUrlsEl
) => {
  createReportForm.addEventListener('submit', e => {
    e.preventDefault();
    submitReport(
      createReportForm.dataset.topic,
      reportContentEl.value,
      reportMediaUrlsEl.value
    );
  });
};

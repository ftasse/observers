import axios from 'axios';
import { showLoader, hideLoader } from './loader';
import { showAlert } from './alert';
import { getLocation, geoLocate } from './geolocation';

const submitReport = async (
  topicId,
  reportContent,
  reportMediaUrls,
  operation,
  url,
  msg
) => {
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
      reportLocation.description = reportLocation.address;
      reportLocation.type = 'Point';
      delete reportLocation.address;
      const report = {
        content: reportContent,
        location: reportLocation
      };
      if (operation === 'POST') {
        report.topic = topicId;
      }
      if (reportMediaUrls) {
        report.mediaUrls = reportMediaUrls.split(',');
      }

      const res = await axios({
        method: operation,
        url: url,
        data: report
      });
      if (res.data.status === 'success') {
        showAlert('success', msg);
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
  reportMediaUrlsEl,
  op,
  report,
  mediaUrls
) => {
  createReportForm.addEventListener('submit', e => {
    let url, msg, operation;
    if (op === 'update') {
      url = `/api/v1/reports/${report.value}`;
      msg = 'Report successfully updated';
      operation = 'PATCH';
    } else {
      url = '/api/v1/reports';
      msg = 'Report successfully submitted';
      operation = 'POST';
    }

    e.preventDefault();
    submitReport(
      createReportForm.dataset.topic,
      reportContentEl.value,
      reportMediaUrlsEl.value,
      operation,
      url,
      msg
    );
  });
  createReportForm.addEventListener('reset', e => {
    e.preventDefault();
    reportContentEl.value = report.report.content;
    mediaUrls.removeActiveItems(0).setValue(report.report.mediaUrls);
  });
};

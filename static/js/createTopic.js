import axios from 'axios';

import { showAlert } from './alert';
import { showLoader, hideLoader } from './loader';
import { getLocation } from './geolocation';

const submitTopic = async (topic, operation, url, msg) => {
  try {
    const topicLocation = await getLocation(topic.locationLatLng);

    if (!topic.category) {
      return showAlert(
        'failed',
        'Please pick a category for your topic from the dropdown.'
      );
    } else if (topic.description.text.trim().split(' ').length < 70) {
      return showAlert(
        'failed',
        "Your topic's description is too short.(< 70 words)"
      );
    } else if (!topicLocation) {
      return showAlert(
        'failed',
        'Location address not found. Please try again'
      );
    } else {
      showLoader();

      topic.description = JSON.stringify(topic.description);

      topicLocation.type = 'Point';
      delete topic.locationLatLng;

      const data = new FormData();
      Object.keys(topic).forEach(k => data.append(k, topic[k]));
      data.append('location', JSON.stringify(topicLocation));
      data.append('imageCover', document.getElementById('imageCover').files[0]);

      const res = await axios({
        method: operation,
        url: `${url}`,
        data
      });
      hideLoader();
      if (res.data.status === 'success') {
        showAlert('success', `${msg}`);
        window.setTimeout(() => {
          location.reload();
        }, 1500);
      }
    }
    hideLoader();
  } catch (err) {
    hideLoader();
    showAlert('failed', err.response.data.message);
  }
};

export const createTopic = (
  form,
  title,
  category,
  tags,
  mediaUrls,
  marker,
  editor,
  op,
  topicId = { value: '' },
  menus = []
) => {
  form.addEventListener('submit', async e => {
    let url, msg, operation;
    if (op === 'update') {
      url = `/api/v1/topics/${topicId.value}`;
      msg = 'Topic successfully updated';
      operation = 'PATCH';
    } else {
      url = '/api/v1/topics';
      msg = 'Topic successfully created';
      operation = 'POST';
    }

    e.preventDefault();
    const topic = {
      title: title.value,
      category: category.value,
      description: {
        text: editor
          .getText()
          .split('\n\n')
          .join(),
        deltaOps: editor.getContents()
      },
      locationLatLng: marker.getLatLng()
    };
    if (tags.value) {
      topic.tags = tags.value.split(',');
    }
    if (mediaUrls.value) {
      topic.mediaUrls = mediaUrls.value.split(',');
    }
    try {
      await submitTopic(topic, operation, url, msg);
    } catch (err) {
      console.log(err);
    }
  });
  form.addEventListener('reset', e => {
    e.preventDefault();
    const topic = topicId.topic;
    editor.setText('');

    try {
      const descriptionDelta = JSON.parse(topic.description);
      editor.setContents(descriptionDelta.deltaOps);
    } catch {
      editor.setText(topic.description);
    }

    title.value = topic.title;
    menus[0].setChoiceByValue(topic.category);
    menus[0].unhighlightAll();
    menus[1].removeActiveItems(0).setValue(topic.tags);
    menus[2].removeActiveItems(0).setValue(topic.mediaUrls);

    marker.setLatLng(
      new L.LatLng(topic.location.coordinates[1], topic.location.coordinates[0])
    );
  });
};

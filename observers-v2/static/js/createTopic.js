import axios from 'axios';
import { showAlert } from './alert';
import { showLoader, hideLoader } from './loader';

const getLocation = async locationLatLng => {
  try {
    const res = await axios({
      method: 'GET',

      url: `https://www.mapquestapi.com/geocoding/v1/reverse?key=qGF0GOYsNSQ0PFJAdJBIhVglHRYkdLy1&inFormat=kvp&outFormat=json&location=${locationLatLng.lat},${locationLatLng.lng}&maxResults=1`
    });
    console.log(res);
    if (res.status === 200) {
      const name = [
        res.data.results[0].locations[0].adminArea1,
        res.data.results[0].locations[0].adminArea3,
        res.data.results[0].locations[0].adminArea5
      ];
      return {
        coordinates: [locationLatLng.lng, locationLatLng.lat],
        address: name.join('|')
      };
    }
  } catch (err) {
    showAlert('failed', 'Please provide a valid location');
  }
};

const submitTopic = async topic => {
  try {
    const topicLocation = await getLocation(topic.locationLatLng);

    console.log(topic);
    if (!topic.category) {
      return showAlert(
        'failed',
        'Please pick a category for your topic from the dropdown.'
      );
    } else if (topic.description.text.trim().length < 30) {
      return showAlert(
        'failed',
        "Your topic's description is too short.(< 30 characters)"
      );
    } else if (!topicLocation) {
      return showAlert(
        'failed',
        'Location address not found. Please try again'
      );
    } else {
      showLoader();

      topic.description = JSON.stringify(topic.description);
      topic.location = topicLocation;
      delete topic.locationLatLng;

      const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/topics',
        data: topic
      });
      hideLoader();
      if (res.data.status === 'success') {
        showAlert('success', 'Topic successfully created');
        window.setTimeout(() => {
          location.assign('/');
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
  editor
) => {
  form.addEventListener('submit', async e => {
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
      await submitTopic(topic);
    } catch (err) {
      console.log(err);
    }
  });
};

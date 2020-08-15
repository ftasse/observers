import axios from 'axios';
import { showAlert } from './alert';

const getLocation = async locationStr => {
  try {
    const res = await axios({
      method: 'GET',
      url: `https://www.mapquestapi.com/geocoding/v1/address?key=qGF0GOYsNSQ0PFJAdJBIhVglHRYkdLy1&inFormat=kvp&outFormat=json&location=${locationStr}&maxResults=1`
    });
    console.log(res);
    if (res.status === 200) {
      const name = [
        res.data.results[0].locations[0].adminArea1,
        res.data.results[0].locations[0].adminArea3,
        res.data.results[0].locations[0].adminArea5
      ];
      return {
        coordinates: [
          res.data.results[0].locations[0].latLng.lng,
          res.data.results[0].locations[0].latLng.lat
        ],
        address: name.join('|')
      };
    }
  } catch (err) {
    showAlert('failed', 'Please provide a valid location');
  }
};

const submitTopic = async topic => {
  try {
    console.log(topic);
    const topicLocation = await getLocation(topic.locationStr);
    if (topicLocation) {
      console.log(topicLocation);
      const res = await axios({
        method: 'POST',
        url: 'http://127.0.0.1:3000/api/v1/topics',
        data: {
          title: topic.title,
          tags: topic.tags,
          mediaUrls: topic.mediaUrls,
          category: topic.category,
          description: topic.description,
          location: topicLocation
        }
      });

      if (res.data.status === 'success') {
        showAlert('success', 'Topic successfully created');
        window.setTimeout(() => {
          location.assign('/');
        }, 1500);
      }
    }
  } catch (err) {
    console.log(err.response.data.message);
    showAlert('failed', err.response.data.message);
  }
};

export const createTopic = editor => {
  const title = document.querySelector('#title');
  const category = document.querySelector('#select-category-create-topic-form');
  const tags = document.querySelector('#select-tags-create-topic-form');
  const mediaUrls = document.querySelector(
    '#select-mediaUrls-create-topic-form'
  );
  const locationStr = document.querySelector('#location');

  const form = document.querySelector('.form--create-topic');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const topic = {
      title: title.value,
      category: category.value,
      description: JSON.stringify({
        text: editor.getText(),
        deltaOps: editor.getContents()
      }),
      locationStr: locationStr.value
    };
    if (tags.value) {
      topic.tags = tags.value.split(',');
    }
    if (mediaUrls.value) {
      topic.mediaUrls = mediaUrls.value.split(',');
    }
    submitTopic(topic);
  });
};

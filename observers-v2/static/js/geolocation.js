import axios from 'axios';
import { showAlert } from './alert';
import { dataQuestToken } from './apiKeys';

export const geoLocate = async () => {
  const getPosition = function(options) {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };
  return await getPosition();
};

export const getLocation = async locationLatLng => {
  try {
    console.log(locationLatLng);
    const res = await axios({
      method: 'GET',
      url: `https://www.mapquestapi.com/geocoding/v1/reverse?key=${dataQuestToken}&inFormat=kvp&outFormat=json&location=${locationLatLng.lat},${locationLatLng.lng}&maxResults=1`
    });
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

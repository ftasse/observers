const getPopupHTML = data => {
  const imageTag = data.imageCover
    ? `<img src="/img/${data.imageCover}" alt="" class="sm-card__img">`
    : '';
  return `
    <div class="sm-card">
        ${imageTag}
        <div class="sm-card__info">
            <div class="sm-card__main">
                <a href="/topics/${
                  data.slug
                }" class="link-info link-info--normal">${data.title}</a>
            </div>
            <div class="sm-card__sub">
                <a href="/?category=${encodeURIComponent(
                  data.category
                )}#topics" class="sm-card__category sm-card__link link-info link-info--category link-info--category--small">
                    ${data.category}
                 </a>
                <a href="/?createdAt=${
                  new Date(data.createdAt).toISOString().split('T')[0]
                }#topics" class="sm-card__link link-info link-info--small link-info--small--sm">
                    Created on ${new Date(data.createdAt).toLocaleString(
                      'en-us',
                      {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }
                    )}
                 </a>
            </div>
        </div>
    </div>`;
};

export const displayMap = (mapObj, data) => {
  L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
    {
      maxZoom: 17,
      id: 'asnelchristian/ckawh4dvvehmi1io10tvsjvtk',
      tileSize: 512,
      zoomOffset: -1,
      accessToken:
        'pk.eyJ1IjoiYXNuZWxjaHJpc3RpYW4iLCJhIjoiY2thd2Z0aXJ1MDdteTJ0bXU5NDU2bHZ4MCJ9.kChV328HGtNtda8XQQc4tA'
    }
  ).addTo(mapObj);

  const markers = L.markerClusterGroup({
    polygonOptions: { color: '#ba9545' }
  });

  data.map(d => {
    const markerIcon = L.divIcon({ className: 'marker marker--default' });
    const marker = L.marker(d.location.coordinates.reverse(), {
      icon: markerIcon
    }).bindPopup(getPopupHTML(d));
    markers.addLayer(marker);
  });

  mapObj.addLayer(markers);
};

export const initializeCreateTopicMap = topicMap => {
  const popup = L.popup({ closeOnClick: false }).setContent(
    "Default topic's location"
  );

  const markerIcon = L.divIcon({ className: 'marker marker--default' });
  const marker = L.marker([0, 0], {
    icon: markerIcon
  })
    .bindPopup(popup)
    .addTo(topicMap)
    .openPopup();

  topicMap.on('click', function(e) {
    popup.setContent('Pick this location');
    marker.setLatLng(new L.LatLng(e.latlng.lat, e.latlng.lng));
  });

  return marker;
};

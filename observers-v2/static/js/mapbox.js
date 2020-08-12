const getPopupHTML = topic => {
  return `
    <div class="sm-card">
        <img src="img/politics.jpg" alt="" class="sm-card__img">
        <div class="sm-card__info">
            <div class="sm-card__main">
                <a href="#" class="link-info link-info--normal">${topic.title}</a>
            </div>
            <div class="sm-card__sub">
                <a href="#" class="sm-card__category sm-card__link link-info link-info--category link-info--category--small">
                    ${topic.category}
                 </a>
                <a href="#" class="sm-card__link link-info link-info--small link-info--small--sm">
                    Last update on ${topic.createdAt}
                 </a>
            </div>
        </div>
    </div>`;
};
const getClusterElementClass = size => {
  let min, max;
  const classMap = {
    'marker--cluster--20': [2, 20],
    'marker--cluster--50': [20, 50],
    'marker--cluster--100': [50, 100],
    'marker--cluster--500': [100, 500],
    'marker--cluster--1000': [500, 1000],
    'marker--cluster--10000': [1000, 10000],
    'marker--cluster--inf': [10000, Infinity]
  };
  const between = (val, min, max) => val >= min && val < max;

  for (let klass of Object.keys(classMap)) {
    [min, max] = classMap[klass];
    if (between(size, min, max)) {
      return klass;
    }
  }
  return '';
};

const data = JSON.parse(document.querySelector('.map').dataset.mapdata);
console.log(data);

mapboxgl.accessToken =
  'pk.eyJ1IjoiYXNuZWxjaHJpc3RpYW4iLCJhIjoiY2thd2Z0aXJ1MDdteTJ0bXU5NDU2bHZ4MCJ9.kChV328HGtNtda8XQQc4tA';

const map = new mapboxgl.Map({
  container: 'mapbox-topics',
  style: 'mapbox://styles/asnelchristian/ckawh4dvvehmi1io10tvsjvtk',
  maxZoom: 7
});

const bounds = new mapboxgl.LngLatBounds();
data.forEach(d => {
  bounds.extend(d.geometry.coordinates);
});

const index = new Supercluster({
  log: true,
  radius: 20,
  extent: 256,
  maxZoom: 7
}).load(data);

console.log(index);
let markers = [];

const update = zoom => {
  // Remove all markers currently on the map
  markers.forEach(marker => marker.remove());
  markers = [];

  // Compute the new clusters based on zoom level
  let zoomLevel = zoom || parseInt(map.getZoom());
  const { _sw, _ne } = bounds;
  const bbox = [_sw.lng, _sw.lat, _ne.lng, _ne.lat];
  let clusters = [];

  if (bbox[0] > bbox[2]) {
    // here we need to get clusters two times:
    // when there are negative values
    bbox[0] = _sw.lng - 360;
    clusters = index.getClusters(bbox, zoomLevel);
    // ...and positive ones.
    bbox[0] = _sw.lng;
    bbox[2] = _ne.lng + 360;
    clusters = clusters.concat(index.getClusters(bbox, zoomLevel));
  } else {
    clusters = index.getClusters(bbox, zoomLevel);
  }

  console.log(clusters);
  // Create appropriate markers for each clusters
  clusters.forEach(cluster => {
    let popupHtml = '';
    const el = document.createElement('div');
    el.classList.add('marker');

    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'center'
    }).setLngLat(cluster.geometry.coordinates);

    if (cluster.properties && cluster.properties.cluster) {
      el.classList.add('marker--cluster');
      el.classList.add(getClusterElementClass(cluster.properties.point_count));
      el.innerHTML = `<span>${cluster.properties.point_count_abbreviated}</span>`;

      const expansionZoom = index.getClusterExpansionZoom(
        cluster.properties.cluster_id
      );
      if (zoomLevel >= index.options.maxZoom) {
        const leaves = index.getChildren(cluster.properties.cluster_id);
        leaves.forEach(leave => {
          popupHtml = `${popupHtml}${getPopupHTML(leave)}`;
        });

        el.removeEventListener('click', function() {});
        el.addEventListener('click', function() {
          clusterList.innerHTML = popupHtml;
          clusterListContainer.classList.remove('hide');
        });
      } else {
        el.addEventListener('click', function(e) {
          flyTo(cluster.geometry.coordinates, expansionZoom);
        });
      }
    } else {
      if (cluster.rank && cluster.rank <= 5) {
        el.classList.add('marker--trending');
      } else {
        el.classList.add('marker--default');
      }
      popupHtml = getPopupHTML(cluster);
      addPopup(marker, popupHtml, 'topic-popup');
    }
    markers.push(marker);
  });
  // Add all newly created markers to map
  markers.forEach(marker => marker.addTo(map));
};

const addPopup = (marker, popupHtml, className) => {
  marker.setPopup(
    new mapboxgl.Popup({ className }).setHTML(popupHtml).setMaxWidth('34rem')
  );
};

let ready = false;

map.on('load', () => {
  ready = false;
  update(4);
  ready = true;
});

map.on('moveend', async () => {
  if (!ready) return;
  ready = false;
  update();
  ready = true;
});

const flyTo = (center, zoom) => {
  if (!ready) return;
  ready = false;
  map.flyTo({ center, zoom });
  ready = true;
};

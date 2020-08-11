const topicsListViewToggle = document.querySelector('#view-switch--list');
const topicsMapViewToggle = document.querySelector('#view-switch--map');
const topicsList = document.querySelector('.topic-cards');
const topicsMap = document.querySelector('.topic-map');
const topicsPagination = document.querySelector('.pagination');

const clusterListClose = document.querySelector(
  '.topic-map__cluster-list--close'
);
const clusterListContainer = document.querySelector('.topic-map__cluster-list');
const clusterList = document.querySelector(
  '.topic-map__cluster-list--elements'
);

clusterListClose.addEventListener('click', function() {
  clusterListContainer.classList.add('hide');
});

topicsListViewToggle.addEventListener('click', e => {
  topicsMap.classList.add('hide');
  topicsList.classList.remove('hide');
  topicsPagination.classList.remove('hide');
});

topicsMapViewToggle.addEventListener('click', e => {
  topicsList.classList.add('hide');
  topicsPagination.classList.add('hide');
  topicsMap.classList.remove('hide');

  map.resize();
  map.fitBounds(bounds, {
    padding: {
      top: 25,
      bottom: 35,
      right: 25,
      left: 25
    }
  });
});

const createTopicButtons = document.querySelectorAll('.add-topic__btn');
const createTopicFormContainer = document.querySelector('.create-topic-form');
const createTopicClose = document.querySelector('.create-topic-close');

createTopicButtons.forEach(b => {
  b.addEventListener('click', function() {
    createTopicFormContainer.style.transform = 'translateX(-50%) scaleX(1)';
    createTopicFormContainer.style.opacity = '1';
  });
});

createTopicClose.addEventListener('click', function() {
  createTopicFormContainer.style.transform = 'translateX(-50%) scaleX(0)';
  createTopicFormContainer.style.opacity = '0';
});

const selectGroups = document.querySelectorAll('.select-group');

document.onclick = function(e) {
  if (
    !e.target.classList.contains('option-container') &&
    !e.target.classList.contains('option__label') &&
    !e.target.classList.contains('option__radio') &&
    !e.target.classList.contains('selected')
  ) {
    const options = document.querySelectorAll('.option-container');
    options.forEach(el => {
      el.classList.remove('option-container--active');
    });
  }
};
selectGroups.forEach(g => {
  const selected = g.querySelector('.selected');
  const optionListContainer = g.querySelector('.option-container');
  const optionList = optionListContainer.querySelectorAll('input');

  let selectedOptions = new Set();

  selected.addEventListener('click', () => {
    // Close all other select list
    const selects = document.querySelectorAll('.option-container');
    selects.forEach(el => {
      el.classList.remove('option-container--active');
    });
    optionListContainer.classList.add('option-container--active');
  });

  optionList.forEach(o => {
    o.addEventListener('click', () => {
      if (!g.classList.contains('multi-select')) {
        selectedOptions = new Set();
      }
      if (o.checked) {
        selectedOptions.add(o.value);
      } else {
        selectedOptions.delete(o.value);
      }

      selected.innerHTML = `(${
        Array.from(selectedOptions).length
      }) ${g.getAttribute('data-select')}`;
    });
  });
});

const menuSidebarToggle = document.querySelector('.menu__checkbox');
const menuSidebarLinks = document.querySelectorAll('.menu__link');

menuSidebarLinks.forEach(m => {
  m.addEventListener('click', () => {
    menuSidebarToggle.checked = false;
  });
});

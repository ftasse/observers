import '@babel/polyfill';
import 'simplebar';
import { login } from './login';
import { signup } from './signup';
import { displayMap } from './mapbox';
import { createMultiSelectMenus } from './choice';
import { createEditors } from './quill';

// DOM elements
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

const createTopicButtons = document.querySelectorAll('.add-topic__btn');
const createTopicFormContainer = document.querySelector('.create-topic-form');
const createTopicClose = document.querySelector('.create-topic-close');
const selectGroups = document.querySelectorAll('.select-group');

const menuSidebarToggle = document.querySelector('.menu__checkbox');
const menuSidebarLinks = document.querySelectorAll('.menu__link');

const loginForm = document.querySelector('.form--signin');
const signUpForm = document.querySelector('.form--signup');

const email = document.getElementById('email');
const username = document.getElementById('username');
const password = document.getElementById('password');
const passwordConfirm = document.getElementById('passwordConfirm');

const topics = document.querySelector('.map');

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    login(email.value, password.value);
  });
}

if (signUpForm) {
  signUpForm.addEventListener('submit', e => {
    e.preventDefault();
    signup(username.value, email.value, password.value, passwordConfirm.value);
  });
}

let mapObj, bounds;
if (topics) {
  mapObj = new mapboxgl.Map({
    container: 'mapbox-topics',
    style: 'mapbox://styles/asnelchristian/ckawh4dvvehmi1io10tvsjvtk',
    maxZoom: 7
  });
  bounds = new mapboxgl.LngLatBounds();
  displayMap(mapObj, bounds, JSON.parse(topics.dataset.mapdata));
}

if (clusterListClose) {
  clusterListClose.addEventListener('click', function() {
    clusterListContainer.classList.add('hide');
  });
}

if (topicsListViewToggle) {
  topicsListViewToggle.addEventListener('click', e => {
    topicsMap.classList.add('hide');
    topicsList.classList.remove('hide');
    topicsPagination.classList.remove('hide');
  });

  topicsMapViewToggle.addEventListener('click', e => {
    topicsList.classList.add('hide');
    topicsPagination.classList.add('hide');
    topicsMap.classList.remove('hide');

    mapObj.resize();
    mapObj.fitBounds(bounds, {
      padding: {
        top: 25,
        bottom: 35,
        right: 25,
        left: 25
      }
    });
  });
}

if (createTopicButtons) {
  createTopicButtons.forEach(b => {
    b.addEventListener('click', function() {
      createTopicFormContainer.style.transform = 'translateX(-50%) scaleX(1)';
      createTopicFormContainer.style.opacity = '1';
    });
  });
}
if (createTopicClose) {
  createTopicClose.addEventListener('click', function() {
    createTopicFormContainer.style.transform = 'translateX(-50%) scaleX(0)';
    createTopicFormContainer.style.opacity = '0';
  });
}

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
if (selectGroups) {
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
}

if (menuSidebarLinks) {
  menuSidebarLinks.forEach(m => {
    m.addEventListener('click', () => {
      menuSidebarToggle.checked = false;
    });
  });
}

// Create Multiselect menus
try {
  createMultiSelectMenus();
  createEditors();
} catch (err) {
  console.log();
}

// Create rich text editors

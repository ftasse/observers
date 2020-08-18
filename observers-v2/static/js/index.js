import '@babel/polyfill';
import 'simplebar';
import { login, logout } from './login';
import { signup } from './signup';
import { displayMap, initializeCreateTopicMap } from './mapbox';
import { createMultiSelectMenus } from './choice';
import { createEditors } from './quill';
import { filter } from './filter';
import { createTopic } from './createTopic';
import { createReport } from './createReport';
import { showLoader } from './loader';
import { searchTopics } from './search';
import { reportCharts } from './echarts';

// DOM elements
const listViewToggle = document.querySelector('#view-switch--list');
const mapViewToggle = document.querySelector('#view-switch--map');
const listContainer = document.querySelector('.list-view-container');
const mapContainer = document.querySelector('.map-container');
const paginationDiv = document.querySelector('.pagination');
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
const createTopicForm = document.querySelector('.form--create-topic');
const searchTopicForm = document.querySelector('#searchTopicForm');
const searchTopicPattern = document.querySelector('#searchTopicPattern');
const newTopicTitle = document.querySelector('#title');
const newTopicCategory = document.querySelector(
  '#select-category-create-topic-form'
);
const newTopicTags = document.querySelector('#select-tags-create-topic-form');
const newTopicMediaUrls = document.querySelector(
  '#select-mediaUrls-create-topic-form'
);

const createReportButtons = document.querySelectorAll('.add-report__btn');
const createReportFormContainer = document.querySelector('.create-report-form');
const createReportClose = document.querySelector('.create-report-close');
const createReportForm = document.querySelector('.form--create-report');
const newReportContent = document.querySelector('#report-content');
const newReportMediaUrls = document.querySelector(
  '#select-mediaUrls-create-report-form'
);

const selectGroupsNormal = document.querySelectorAll('.select-group--normal');
const selectGroupsRespond = document.querySelectorAll('.select-group--respond');

const menuSidebarToggle = document.querySelector('.menu__checkbox');
const menuSidebarLinks = document.querySelectorAll('.menu__link');

const loginForm = document.querySelector('.form--signin');
const signUpForm = document.querySelector('.form--signup');
const logoutBtn = document.querySelectorAll('.sign-out');

const email = document.getElementById('email');
const username = document.getElementById('username');
const password = document.getElementById('password');
const passwordConfirm = document.getElementById('passwordConfirm');

const mapDivEl = document.querySelector('#mapbox');
const filterTopicsBtn = document.querySelector('#filter-topics');
const filterTopicsBtnRespond = document.querySelector(
  '#filter-topics--respond'
);

const sentimentChartContainers = document.querySelectorAll('.sentiment-pie');
const reportChartContainers = document.querySelectorAll('.report-freq');

const configureSelectGroups = selectGroup => {
  selectGroup.forEach(g => {
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
        g.dataset.selected = Array.from(selectedOptions).join(`|`);
        selected.innerHTML = `(${
          Array.from(selectedOptions).length
        }) ${g.getAttribute('data-select')}`;
      });
    });
  });
};

const filterTopics = (btn, btnSelectGroups) => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const filters = Array.from(btnSelectGroups)
      .filter(g => g.dataset.selected !== undefined)
      .map(g => `${g.dataset.select}=${encodeURIComponent(g.dataset.selected)}`)
      .join('&');
    showLoader();
    filter(filters.replace(/categories/g, 'category'));
  });
};

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

if (filterTopicsBtn) {
  configureSelectGroups(selectGroupsNormal);
  filterTopics(filterTopicsBtn, selectGroupsNormal);
}

if (filterTopicsBtnRespond) {
  configureSelectGroups(selectGroupsRespond);
  filterTopics(filterTopicsBtnRespond, selectGroupsRespond);
}

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
if (logoutBtn) {
  logoutBtn.forEach(btn => {
    btn.addEventListener('click', e => {
      logout();
    });
  });
}

let map;
if (mapDivEl) {
  map = L.map('mapbox').setView([0, 0], 2);
  displayMap(map, JSON.parse(mapDivEl.dataset.mapdata));
}

if (clusterListClose) {
  clusterListClose.addEventListener('click', function() {
    clusterListContainer.classList.add('hide');
  });
}

if (searchTopicForm) {
  searchTopics(searchTopicForm, searchTopicPattern);
}

const switchListView = (mapView, listView, paginationDiv) => {
  mapView.classList.add('hide');
  listView.classList.remove('hide');
  paginationDiv.classList.remove('hide');
};

const switchMapView = (mapView, listView, paginationDiv) => {
  mapView.classList.remove('hide');
  listView.classList.add('hide');
  paginationDiv.classList.add('hide');
};

if (listViewToggle) {
  listViewToggle.addEventListener('click', e => {
    switchListView(mapContainer, listContainer, paginationDiv);
  });

  mapViewToggle.addEventListener('click', e => {
    switchMapView(mapContainer, listContainer, paginationDiv);

    map.invalidateSize();
  });
}

if (createTopicButtons) {
  createTopicButtons.forEach(b => {
    b.addEventListener('click', function() {
      createTopicFormContainer.style.transform = 'translateX(-50%) scaleX(1)';
      createTopicFormContainer.style.opacity = '1';
    });
  });

  createMultiSelectMenus();
  const editor = createEditors();

  const createTopicMap = L.map('createTopicMap').setView([0, 0], 2);
  displayMap(createTopicMap, []);
  const newTopicMarker = initializeCreateTopicMap(createTopicMap);

  createTopic(
    createTopicForm,
    newTopicTitle,
    newTopicCategory,
    newTopicTags,
    newTopicMediaUrls,
    newTopicMarker,
    editor
  );

  createTopicClose.addEventListener('click', function() {
    createTopicFormContainer.style.transform = 'translateX(-50%) scaleX(0)';
    createTopicFormContainer.style.opacity = '0';
  });
}

if (createReportButtons) {
  createReportButtons.forEach(b => {
    b.addEventListener('click', function() {
      createReportFormContainer.style.transform = 'translateX(-50%) scaleX(1)';
      createReportFormContainer.style.opacity = '1';
    });
  });

  createMultiSelectMenus(true);

  createReport(createReportForm, newReportContent, newReportMediaUrls);

  createReportClose.addEventListener('click', function() {
    createReportFormContainer.style.transform = 'translateX(-50%) scaleX(0)';
    createReportFormContainer.style.opacity = '0';
  });
}

if (menuSidebarLinks) {
  menuSidebarLinks.forEach(m => {
    m.addEventListener('click', () => {
      menuSidebarToggle.checked = false;
    });
  });
}

if (reportChartContainers || sentimentChartContainers) {
  reportCharts(sentimentChartContainers, reportChartContainers);
}

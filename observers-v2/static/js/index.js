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
import './vote';
import './deleteTopic';
import './deleteReport';

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

const userSettingsToggle = document.querySelector('.user-view__menu--item--1');
const userTopicsToggle = document.querySelector('.user-view__menu--item--2');
const userReportsToggle = document.querySelector('.user-view__menu--item--3');

const userSettings = document.querySelector('.user-view__info--settings');
const userTopics = document.querySelector('.user-view__info--topics');
const userReports = document.querySelector('.user-view__info--reports');

const userTopicsEls = document.querySelectorAll('.user-view__topic');
const userReportEls = document.querySelectorAll('.user-view__report');

const tabulate = (tab, tabs) => {
  tabs.forEach(t => {
    t.classList.add('hide');
  });
  tab.classList.remove('hide');
};
const setActiveTabs = (item, items) => {
  items.forEach(t => {
    t.classList.remove('user-view__menu--item--active');
  });
  item.classList.add('user-view__menu--item--active');
};

if (userSettingsToggle) {
  console.log('adding the event listeners');
  userSettingsToggle.addEventListener('click', e => {
    tabulate(userSettings, [userSettings, userTopics, userReports]);
    setActiveTabs(userSettingsToggle, [
      userSettingsToggle,
      userTopicsToggle,
      userReportsToggle
    ]);
  });
  userTopicsToggle.addEventListener('click', e => {
    tabulate(userTopics, [userSettings, userTopics, userReports]);
    setActiveTabs(userTopicsToggle, [
      userSettingsToggle,
      userTopicsToggle,
      userReportsToggle
    ]);
  });
  userReportsToggle.addEventListener('click', e => {
    tabulate(userReports, [userSettings, userTopics, userReports]);
    setActiveTabs(userReportsToggle, [
      userSettingsToggle,
      userTopicsToggle,
      userReportsToggle
    ]);
  });
}

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
  map = L.map('mapbox', {
    maxBounds: L.latLngBounds([-90, -180], [90, 180]),
    minZoom: 2,
    maxZoom: 14
  }).setView([0, 0], 2);
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

const processTopicForm = (op = 'create', topics) => {
  if (createTopicButtons) {
    const menus = createMultiSelectMenus();
    const editor = createEditors();

    const createTopicMap = L.map('createTopicMap', {
      maxBounds: L.latLngBounds([-90, -180], [90, 180]),
      minZoom: 2,
      maxZoom: 14
    }).setView([0, 0], 2);
    displayMap(createTopicMap, []);
    const newTopicMarker = initializeCreateTopicMap(createTopicMap);

    let topicId = { value: '', topic: '' };

    if (op === 'update') {
      topics.forEach(el => {
        const updateBtn = el.querySelector('.add-topic__btn');
        updateBtn.addEventListener('click', e => {
          createTopicFormContainer.style.transform =
            'translateX(-50%) scaleX(1)';
          createTopicFormContainer.style.opacity = '1';

          const topic = JSON.parse(el.dataset.topic);

          console.log(topic);

          topicId.value = topic.id;
          topicId.topic = topic;

          editor.setText('');

          try {
            const descriptionDelta = JSON.parse(topic.description);
            editor.setContents(descriptionDelta.deltaOps);
          } catch {
            editor.setText(topic.description);
          }

          newTopicTitle.value = topic.title;

          menus[0].setChoiceByValue(topic.category);
          menus[0].unhighlightAll();
          menus[1].removeActiveItems(0).setValue(topic.tags);
          menus[2].removeActiveItems(0).setValue(topic.mediaUrls);

          newTopicMarker.setLatLng(
            new L.LatLng(
              topic.location.coordinates[1],
              topic.location.coordinates[0]
            )
          );
        });
      });
    } else {
      createTopicButtons.forEach(b => {
        b.addEventListener('click', function() {
          createTopicFormContainer.style.transform =
            'translateX(-50%) scaleX(1)';
          createTopicFormContainer.style.opacity = '1';
        });
      });
    }

    createTopic(
      createTopicForm,
      newTopicTitle,
      newTopicCategory,
      newTopicTags,
      newTopicMediaUrls,
      newTopicMarker,
      editor,
      op,
      topicId,
      menus
    );
    createTopicClose.addEventListener('click', function() {
      createTopicFormContainer.style.transform = 'translateX(-50%) scaleX(0)';
      createTopicFormContainer.style.opacity = '0';
    });
  }
};

if (userTopicsEls.length > 0) {
  processTopicForm('update', userTopicsEls);
} else {
  processTopicForm('create');
}

const processReportForm = (op = 'create', reports) => {
  if (createReportButtons) {
    const menus = createMultiSelectMenus(true);

    let reportId = { value: '', report: '' };

    if (op === 'update') {
      reports.forEach(el => {
        const updateBtn = el.querySelector('.add-report__btn');
        updateBtn.addEventListener('click', e => {
          createReportFormContainer.style.transform =
            'translateX(-50%) scaleX(1)';
          createReportFormContainer.style.opacity = '1';

          const report = JSON.parse(el.dataset.report);

          reportId.value = report.id;
          reportId.report = report;

          newReportContent.value = report.content;
          menus.removeActiveItems(0).setValue(report.mediaUrls);
        });
      });
    } else {
      createReportButtons.forEach(b => {
        b.addEventListener('click', function() {
          createReportFormContainer.style.transform =
            'translateX(-50%) scaleX(1)';
          createReportFormContainer.style.opacity = '1';
        });
      });
    }

    createReport(
      createReportForm,
      newReportContent,
      newReportMediaUrls,
      op,
      reportId,
      menus
    );

    createReportClose.addEventListener('click', function() {
      createReportFormContainer.style.transform = 'translateX(-50%) scaleX(0)';
      createReportFormContainer.style.opacity = '0';
    });
  }
};

if (userReportEls.length > 0) {
  processReportForm('update', userReportEls);
} else {
  processReportForm('create', []);
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

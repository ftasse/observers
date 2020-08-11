const sentimentData = [
  { name: 'negative', value: 55, itemStyle: { color: '#000' } },
  { name: 'neutral', value: 30, itemStyle: { color: '#ddd' } },
  { name: 'positive', value: 75, itemStyle: { color: '#ba9545' } }
];

const sentimentChartOption = {
  title: {
    text: 'Sentiment analysis',
    textStyle: {
      fontFamily: 'Frank Ruhl Libre',
      fontSize: 16,
      fontWeight: 400
    },
    subtext: 'Most people feel positive about this',
    subtextStyle: {
      fontFamily: 'PT serif',
      fontSize: 13,
      fontWeight: 400,
      color: '#ba9545'
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  series: [
    {
      name: 'Sentiment',
      type: 'pie',
      center: ['50%', '58%'],
      radius: '60%',
      data: sentimentData,
      emphasis: {
        itemStyle: {
          shadowBlur: 5,
          shadowOffsetX: 0,
          shadowColor: 'rgba(122, 122, 122, .5)'
        }
      }
    }
  ]
};

document.querySelectorAll('.sentiment-pie').forEach(c => {
  let sentimentChart = echarts.init(c);
  sentimentChart.setOption(sentimentChartOption);
});

let base = +new Date(2020, 9, 3);
const oneDay = 24 * 3600 * 1000;
let date = [];
const data = [Math.random() * 300];

for (let i = 1; i < 200; i++) {
  const now = new Date((base += oneDay));
  date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
  data.push(Math.abs(Math.round((Math.random() - 0.5) * 20 + data[i - 1])));
}

reportChartoption = {
  tooltip: {
    trigger: 'axis',
    position: function(pt) {
      return [pt[0], '10%'];
    }
  },
  title: {
    text: 'Report graph',
    textStyle: {
      fontFamily: 'Frank Ruhl Libre',
      fontSize: 16,
      fontWeight: 400
    },
    subtext: 'There is a total of 200 reports',
    subtextStyle: {
      fontFamily: 'PT serif',
      fontSize: 13,
      fontWeight: 400,
      color: '#ba9545',
      paddingBottom: 15
    }
  },
  toolbox: {
    show: true,
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      magicType: { type: ['line', 'bar'] }
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: date,
    axisLine: {
      lineStyle: {
        color: 'rgba(186, 149, 69, 1)'
      }
    },
    axisLabel: {
      fontFamily: 'PT serif',
      margin: 10
    }
  },
  yAxis: {
    type: 'value',
    boundaryGap: [0, '100%'],
    axisLine: {
      lineStyle: {
        color: 'rgba(186, 149, 69, 1)'
      }
    },
    axisLabel: {
      fontFamily: 'PT serif',
      margin: 10
    },
    splitLine: {
      lineStyle: {
        type: 'dotted'
      }
    }
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 10
    },
    {
      start: 0,
      end: 10,
      handleIcon:
        'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '75%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2
      }
    }
  ],
  series: [
    {
      name: 'Reports',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      sampling: 'average',
      itemStyle: {
        color: 'rgba(186, 149, 69, 1)'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(186, 149, 69, .9)'
          },
          {
            offset: 1,
            color: 'rgba(186, 149, 69, .9)'
          }
        ])
      },
      data: data
    }
  ]
};

document.querySelectorAll('.report-freq').forEach(r => {
  let reportChart = echarts.init(r);
  reportChart.setOption(reportChartoption);
});

// Todo: Refactor js code

const toolbarOptions = [
  [{ header: [3, 4, false] }],

  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['link', 'blockquote'],

  [{ list: 'ordered' }, { list: 'bullet' }],

  ['clean'] // remove formatting button
];

const editor = new Quill('.editor', {
  modules: {
    toolbar: toolbarOptions
  },
  theme: 'snow',
  placeholder: 'Describe your topic in details...'
});

const createTopicButtons = document.querySelectorAll('.add-topic__btn');
const createTopicForm = document.querySelector('.create-topic-form');
const createTopicClose = document.querySelector('.create-topic-close');

createTopicButtons.forEach(b => {
  b.addEventListener('click', function() {
    createTopicForm.style.transform = 'translateX(-50%) scaleX(1)';
    createTopicForm.style.opacity = '1';
  });
});

createTopicClose.addEventListener('click', function() {
  createTopicForm.style.transform = 'translateX(-50%) scaleX(0)';
  createTopicForm.style.opacity = '0';
});

const createReportButtons = document.querySelectorAll('.add-report__btn');
const createReportForm = document.querySelector('.create-report-form');
const createReportClose = document.querySelector('.create-report-close');

createReportButtons.forEach(b => {
  b.addEventListener('click', function() {
    createReportForm.style.transform = 'translateX(-50%) scaleX(1)';
    createReportForm.style.opacity = '1';
  });
});

createReportClose.addEventListener('click', function() {
  createReportForm.style.transform = 'translateX(-50%) scaleX(0)';
  createReportForm.style.opacity = '0';
});

const selectCategoryCreateTopicForm = new Choices(
  '#select-category-create-topic-form'
);
const selectTagsCreateTopicForm = new Choices(
  '#select-tags-create-topic-form',
  {
    delimiter: ',',
    editItems: true,
    duplicateItemsAllowed: false,
    maxItemCount: 5,
    placeholderValue: 'add tag',
    removeItemButton: true,
    maxItemText: function(maxItemCount) {
      return String(maxItemCount) + ' tags can be defined at most';
    },
    uniqueItemText: 'This is tag has already been added'
  }
);

const selectMediaUrlsCreateTopicForm = new Choices(
  '#select-mediaUrls-create-topic-form',
  {
    delimiter: ',',
    editItems: true,
    addItemFilter: function(value) {
      if (!value) {
        return false;
      }

      const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
      const expression = new RegExp(regex.source, 'i');
      return expression.test(value);
    },
    duplicateItemsAllowed: false,
    maxItemCount: 5,
    placeholderValue: 'add source',
    removeItemButton: true,
    maxItemText: function(maxItemCount) {
      return String(maxItemCount) + ' sources can be defined at most';
    },
    uniqueItemText: 'This source has already been provided'
  }
);

const selectMediaUrlsCreateReportForm = new Choices(
  '#select-mediaUrls-create-report-form',
  {
    delimiter: ',',
    editItems: true,
    addItemFilter: function(value) {
      if (!value) {
        return false;
      }

      const regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
      const expression = new RegExp(regex.source, 'i');
      return expression.test(value);
    },
    customAddItemText: 'Only valid links are allowed.',
    duplicateItemsAllowed: false,
    maxItemCount: 5,
    placeholderValue: 'add source',
    removeItemButton: true,
    maxItemText: function(maxItemCount) {
      return String(maxItemCount) + ' sources can be defined at most';
    },
    uniqueItemText: 'This source has already been provided'
  }
);

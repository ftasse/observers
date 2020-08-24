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
      data: [],
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
const reportChartOption = {
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
    subtext: '',
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
    data: [],
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
      data: []
    }
  ]
};

const charts = [];

export const reportCharts = (
  sentimentChartContainers,
  reportsChartContainers
) => {
  reportsChartContainers.forEach(c => {
    let reportChart = echarts.init(c);

    const data = JSON.parse(c.dataset.reports);
    reportChartOption.xAxis.data = data[0];
    reportChartOption.series[0].data = data[1];

    reportChartOption.title.subtext = `There is a total of ${reportChartOption.series[0].data.length} reports on this topic:`;

    reportChart.setOption(reportChartOption);
    charts.push(reportChart);
  });

  sentimentChartContainers.forEach(c => {
    let sentimentChart = echarts.init(c);

    sentimentChartOption.series[0].data = JSON.parse(c.dataset.sentiments);

    sentimentChart.setOption(sentimentChartOption);
    charts.push(sentimentChart);
  });
};

window.addEventListener('resize', e => {
  charts.forEach(c => c.resize());
});

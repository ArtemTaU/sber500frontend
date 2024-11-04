import { reactive } from 'vue';

export function createChartOptions(titleText = '', graphMin = 0, graphMax = 120) {
  return reactive({
    responsive: true,
    aspectRatio: 1 | 4, 
    layout: {
      padding: {
        left: 0
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: titleText,
        position: 'top',
        fullSize: true,
        align: 'start',
        padding: {
          top: 10,
          bottom: 50
        },
        font: {
          size: 40,
          family: 'Arial, sans-serif',
          weight: '400', 
        },
        color: '#ffffff',
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: true,
        suggestedMin: graphMin,
        suggestedMax: graphMax,
        ticks: {
          color: '#fff',
          font: {
            size: 30,
            family: 'Arial, sans-serif',
            weight: '400',
          },
          padding: 0,
          callback: function(value) {
            return value % 40 === 0 ? value : '';
          },
          beginAtZero: true,
        },
        grid: {
          color: function(context) {
            if (context.tick && (context.tick.value === 0 || context.tick.value % 40 === 0)) {
              return 'rgba(255, 255, 255, 1)';
            }
            return 'rgba(0, 0, 0, 0)';
          },    
          lineWidth: 2
        },      
        border: {
          display: false,
          dash: [15, 10],
        },
      },
    },
    datasets: {
      line: {
        pointRadius: 0
      }
    },
  });
}

export function createChartData(borderColor = '#FF1A88') {
  return reactive({
    labels: [],
    datasets: [
      {
        borderColor: borderColor,
        borderWidth: 15,
        data: [],
        tension: 0.4,
      },
    ],
  });
}

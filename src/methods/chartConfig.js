import { reactive } from 'vue';

export function createChartOptions(titleText = '', graphMin = 0, graphMax = 120, grid = 40) {
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
          top: 5,
          bottom: 20,
        },
        font: {
          size: 22,
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
            size: 18,
            family: 'Arial, sans-serif',
            weight: '400',
          },
          padding: 5,
          callback: function(value) {
            return value % grid === 0 ? value : '';
          },
          beginAtZero: true,
        },
        grid: {
          color: function(context) {
            if (context.tick && (context.tick.value === 0 || context.tick.value % grid === 0)) {
              return 'rgba(255, 255, 255, 1)';
            }
            return 'rgba(0, 0, 0, 0)';
          },    
          lineWidth: 2
        },      
        border: {
          display: false,
          dash: [7, 7],
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
        borderWidth: 6,
        data: [],
        tension: 0.4,
      },
    ],
  });
}

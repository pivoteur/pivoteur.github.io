const drawLineChart = (dates, lines, canvas='lineChart', reversed=false) => {

   const ctx = document.getElementById(canvas).getContext('2d');

   new Chart(ctx, {
      type: 'line',
      data: { labels: dates, datasets: lines },
      options: { 
         responsive: true,
         maintainAspectRatio: false,
         scales: {
            y: {
               reverse: reversed,
               grid: { color: 'rgba(255,255,255,0.05)' },
               ticks: { color: 'rgba(200,216,232,0.5)', font: { size: 10 } }
            },
            x: {
               grid: { color: 'rgba(255,255,255,0.05)' },
               ticks: {
                  color: 'rgba(200,216,232,0.5)',
                  font: { size: 10 },
                  maxTicksLimit: 12,
                  autoSkip: true,
                  maxRotation: 45,
                  minRotation: 45
               }
            }
         },
         plugins: { 
            legend: { labels: { color: 'white' } },
            customCanvasBackgroundColor: { color: '#0F1422' } } },
      plugins: [plugin]
   });
};

const line = (label, data, color) => {
   return {
      label: label,
      data: data,
      borderColor: color,
      fill: false,
      borderWidth: 2,
      pointRadius: 2,
      pointHoverRadius: 4
   }
};

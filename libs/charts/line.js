const drawLineChart = (dates, lines, canvas='lineChart', reversed=false) => {

   const ctx = document.getElementById(canvas).getContext('2d');

   new Chart(ctx, {
      type: 'line',
      data: { labels: dates, datasets: lines },
      options: { 
         scales: { y: { reverse: reversed } },
         plugins: { 
            legend: { labels: { color: 'white' } },
            customCanvasBackgroundColor: { color: 'black' } } },
      plugins: [plugin]
   });
};

const line = (label, data, color) => {
   return { label: label, data: data, borderColor: color, fill: false } 
};

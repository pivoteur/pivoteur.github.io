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
                  // Caps how many date labels render regardless of how many data
                  // points are on screen — without this, every single date tries
                  // to render and they overlap into unreadable rotated clutter.
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
      // Smaller, consistent point markers — Chart.js's default radius (3px)
      // overlaps into a solid "beaded" blob once more than ~50-60 points are
      // on screen at once, which is common here at 3-9 month ranges.
      borderWidth: 2,
      pointRadius: 2,
      pointHoverRadius: 4
   }
};

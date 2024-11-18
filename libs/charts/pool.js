// assume EMA-20s chart is a canvas called 'poolChart'
// assume deltas chart is a canvas called 'deltaChart'

const poolCharts = (primary, secondary, data) => {
   let [table, idx] = pivotTable(data);
   let prims = row(table, idx, primary);
   let secs = row(table, idx, secondary);
   let dates = row(table, idx, 'date').slice(-100);
   let ratio0 = ratios(prims, secs);
   let ema20s0 = emas(ratio0, 20);

   drawDeltas(dates, ratio0, ema20s0);
   drawPoolChart(primary + '/' + secondary, dates, ratio0, ema20s0);
};

// helper functions to draw each chart

const drawPoolChart = (title, dates, ratio0, ema20s0) => {
   const line = (label, data, color) => {
      return { label: label, data: data, borderColor: color, fill: false } 
   };

   const ratios = line(title, ratio0.slice(-100), 'blue');
   const sma100s = line('SMA-100', smas(ratio0, 100).slice(-100), 'green');
   const ema20s = line('EMA-20', ema20s0.slice(-100), 'red');
                
   const ctx = document.getElementById('poolChart').getContext('2d');

   new Chart(ctx, {
      type: 'line',
      data: { labels: dates, datasets: [ratios, sma100s, ema20s] },
      options: { plugins: { customCanvasBackgroundColor: { color: 'black' } } },
      plugins: [plugin]
   });
};

const drawDeltas = (dates, ratio0, ema20s0) => {
   const ctx1 = document.getElementById('deltaChart').getContext('2d');

   let [ds, mins, maxs] = deltas(ratio0, ema20s0, 100);

   const rgba = (r, g, b, a) =>
      'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
   const line = (label, d, r, g, b) => {
      return {
         label: label + ' δ',
         data: d.slice(-100).slice(1),
         borderColor: rgba(r, g, b, '1'),
         backgroundColor: rgba(r, g, b, '0.2'),
         fill: false,
         type: 'line'
      };
   };
      
   new Chart(ctx1, {
      type: 'bar',
      data: {
         labels: dates,
         datasets: [ {
               label: 'δ',
               data: ds.slice(-100),
               backgroundColor: 'rgba(255, 159, 64, 0.6)',
               type: 'bar'
            },
            line('Max', maxs, '75', '192', '192'),
            line('Min', mins, '153', '102', '255')
         ]
      },
      options: {
         responsive: true,
         plugins: { customCanvasBackgroundColor: { color: 'black' } },
         scales: { y: { beginAtZero: false } }
      },
      plugins: [plugin]
   });
};


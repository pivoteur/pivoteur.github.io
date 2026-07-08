const pivotCharts = (primary, secondary, data, days = 100) => {
   let [table, idx] = pivotTable(data);
   pivotChartsTbl(primary, secondary, table, idx, days);
}

const pivotChartsTbl = (primary, secondary, table, idx, days = 100) => {
   let prims = row(table, idx, primary);
   let secs = row(table, idx, secondary);
   let allDates = row(table, idx, 'date');

   // ----- Pivot Chart --------------------------------------------------
   let startIndex = 0;
   if (days < table.length) {
      const latest = new Date(allDates[allDates.length - 1]);
      const cutoff = new Date(latest);
      cutoff.setDate(cutoff.getDate() - days);
      const found = allDates.findIndex(d => new Date(d) >= cutoff);
      startIndex = found === -1 ? 0 : found;
   }

   let dates = allDates.slice(startIndex);
   let ratio0 = ratios(prims, secs);
   let ema20s0 = emas(ratio0, 20);

   let title = primary + '/' + secondary;
   const ratios1 = line(title, ratio0.slice(startIndex), 'dodgerblue');
   const sma100s = line('SMA-100', smas(ratio0, 100).slice(startIndex), 'lime');
   const ema20s = line('EMA-20', ema20s0.slice(startIndex), 'tomato');
   drawLineChart(dates, [ratios1, sma100s, ema20s], 'pivotChart');

   // ----- Delta chart --------------------------------------------------
   let deltaStartIndex = 0;
   if (100 < table.length) {
      const latest = new Date(allDates[allDates.length - 1]);
      const cutoff = new Date(latest);
      cutoff.setDate(cutoff.getDate() - 100);
      const found = allDates.findIndex(d => new Date(d) >= cutoff);
      deltaStartIndex = found === -1 ? 0 : found;
   }
   const deltaDates = allDates.slice(deltaStartIndex);

   let [ds, mins, maxs] = deltas(ratio0, ema20s0, 100);
   drawDeltas(deltaDates, ds.slice(deltaStartIndex), mins.slice(deltaStartIndex), maxs.slice(deltaStartIndex));

   return drawRec(deltaDates, ds.slice(deltaStartIndex), mins.slice(deltaStartIndex), maxs.slice(deltaStartIndex), primary, secondary);
};

const drawDeltas = (dates, ds, mins, maxs) => {
   const ctx1 = document.getElementById('deltaChart').getContext('2d');

   const rgba = (r, g, b, a) =>
      'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
   const line = (label, d, r, g, b) => {
      return {
         label: label + ' δ',
         data: d.slice(1),
         borderColor: rgba(r, g, b, '1'),
         backgroundColor: rgba(r, g, b, '0.2'),
         fill: false,
         type: 'line',
         borderWidth: 2,
         pointRadius: 2,
         pointHoverRadius: 4
      };
   };
      
   new Chart(ctx1, {
      type: 'bar',
      data: {
         labels: dates,
         datasets: [ {
               label: 'δ',
               data: ds,
               backgroundColor: 'rgba(255, 159, 64, 0.9)',
               borderColor: 'rgba(255, 159, 64, 1)',
               borderWidth: 1,
               type: 'bar'
            },
            line('Max', maxs, '75', '192', '192'),
            line('Min', mins, '153', '102', '255')
         ]
      },
      options: {
         responsive: true,
         maintainAspectRatio: false,
         plugins: {
            legend: { labels: { color: 'white' } },
            customCanvasBackgroundColor: { color: '#0F1422' } },
         scales: {
            y: {
               beginAtZero: false,
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
         }
      },
      plugins: [plugin]
   });
};

const drawRec = (dates, ds, mins, maxs, prim, sec) => {

   const ultimate = arr => arr[arr.length - 1];
   const penultimate = arr => arr[arr.length - 2];
   const arr = (a, b) => a + " -> " + b;
   let d = ultimate(ds);

   let call = "For " + ultimate(dates) + ", SWAP ";
   let swap = (d < 0) ? arr(sec, prim) : arr(prim, sec);
   let dem = penultimate((d < 0) ? mins : maxs);

   let conf0 = d / dem;
   let conf = (conf0 * 100) | 0;

   const field = document.getElementById('recommendation');

   if (field) {
      let msg = call + swap + ", δ-confidence: " + conf + "%";
      field.innerText = msg;
   }
   return (d < 0);
};

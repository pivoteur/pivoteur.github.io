// assume EMA-20s chart is a canvas called 'pivotChart'
// assume deltas chart is a canvas called 'deltaChart'

const pivotCharts = (primary, secondary, data, days = 100) => {
   let [table, idx] = pivotTable(data);
   pivotChartsTbl(primary, secondary, table, idx, days);
}

// `days` controls the DISPLAY window only (how many trailing calendar days are
// shown, measured against real dates in the data). This
// matters because the underlying data can have gaps (missing dates), so
// "last 90 rows" and "last 90 calendar days" are not the same thing. SMA-100
// and EMA-20's calculation periods stay fixed regardless of what's displayed —
// those are real technical-indicator windows, not display settings.
const pivotChartsTbl = (primary, secondary, table, idx, days = 100) => {
   let prims = row(table, idx, primary);
   let secs = row(table, idx, secondary);
   let allDates = row(table, idx, 'date');

   // Find the first row whose date falls within `days` calendar days of the
   // most recent date in the data. If `days` covers more history than exists
   // (e.g. "2Y" on a dataset with only 8 months), this naturally falls back to
   // showing everything available, same as MAX.
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

   // deltas() ignores its own `window` parameter internally (always computes
   // over the full dataset) — sliced here from the same startIndex as
   // everything else, so it can't drift out of alignment with the dates shown.
   let [ds0, mins0, maxs0] = deltas(ratio0, ema20s0, days);
   let ds = ds0.slice(startIndex);
   let mins = mins0.slice(startIndex);
   let maxs = maxs0.slice(startIndex);

   let title = primary + '/' + secondary;
   const ratios1 = line(title, ratio0.slice(startIndex), 'dodgerblue');
   const sma100s = line('SMA-100', smas(ratio0, 100).slice(startIndex), 'lime');
   const ema20s = line('EMA-20', ema20s0.slice(startIndex), 'tomato');

   drawDeltas(dates, ds, mins, maxs);
   drawLineChart(dates, [ratios1, sma100s, ema20s], 'pivotChart');
   return drawRec(dates, ds, mins, maxs, primary, secondary);
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
               backgroundColor: 'rgba(255, 159, 64, 0.6)',
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

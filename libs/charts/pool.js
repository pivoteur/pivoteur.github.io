const poolCharts = data => {
   let [pool, idx] = sortedTable(data);
   drawPivotEfficacy(pool, idx);
   drawPoolApportionment(pool, idx);
};

const drawPivotEfficacy = (pool, idx) => {
   let labels = [];
   for (let i in idx) {
      if (i.startsWith('Total')) { labels.push(i); }
   }

   let dates = row(pool, idx, 'date');
   let totals = labels.map(label => row(pool, idx, label).map(parseUSD));

   drawLineChart(dates, [line(labels[0], totals[0], 'blue'),
                         line(labels[1], totals[1], 'red')]);
};

const drawPoolApportionment = (pool, idx) => {
   let labels = [];
   for (let i in idx) {
      if (i.startsWith('γ')) { labels.push([i, idx[i]]); }
   }
   let parsedData = parseData(pool, labels);
   barChartTbl(labels, parsedData);
};

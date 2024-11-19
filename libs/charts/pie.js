const pieChart = (wallets, idx, canvasName, labelRow, 
                  position='right', chartType='pie') => {
   let tvls = row(wallets, idx, 'TVL').map(parseUSD);
   let dappsTvl = {};
   let dapprow = row(wallets, idx, labelRow);
   dapprow.forEach((label, ix) => {
      if (dappsTvl[label]) {
         dappsTvl[label] += tvls[ix];
      } else {
         dappsTvl[label] = tvls[ix];
      }
   });
   let labels = [];
   let amounts = [];
   for (dapp in dappsTvl) {
      labels.push(dapp);
      amounts.push(dappsTvl[dapp]);
   }
   doughnutChartTbl(labels, amounts, canvasName, chartType, position);
};

const doughnutChartTbl = (labels, amounts, canvasName, 
                          chartType='doughnut', position='left') => { 
   const ctx = document.getElementById(canvasName).getContext('2d');

   let myColors = colors();
   let slices = labels.forEach(_l => randomColor(myColors));

   new Chart(ctx, {
      type: chartType,
      data: {
         labels: labels,
         datasets: [{
            label: 'TVL $',
            data: amounts,
            backgroundColor: slices
         }],
      },
      options: {
         responsive: true,
         plugins: {
            legend: { position: position, align: 'start',
                      labels: { color: 'white' }
            }
         }
      } 
   });
};
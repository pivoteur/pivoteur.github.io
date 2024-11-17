const pivotsUrl = 'https://raw.githubusercontent.com/logicalgraphs/crypto-n-rust/refs/heads/main/data-files/csv/pivots.csv';

const pivotTable = data => {
   const lines = data.trim().split('\n');
   const labels0 = [];
   const btcEthRatio0 = [];

   const indices = {};
   const orDate = v => { 
      let ans = v;
      if (v === "") { ans = "date"; }
      return ans;
   }
   lines[1].split(',').map((v, i) => indices[orDate(v)] = i);

   const table = [];
   lines.slice(2).map(row => {
      if (row.length > 10) {
         const cols = row.split(',');
         table.push([cols[0]].concat(cols.slice(1).map(parseFloat)));
      }
   });
   return [table, indices];
};

const row = (table, idx, key) => table.map(r => r[idx[key]]);

const id = x => x;

const table = (data, separator='\t', offset=0, f=id) => {
   const lines = data.trim().split('\n');
   const labels0 = [];

   const indices = {};
   const orDate = v => { 
      let ans = v;
      if (v === "") { ans = "date"; }
      return ans;
   }
   lines[0 + offset].split(separator).map((v, i) => indices[orDate(v)] = i);

   const table = [];
   lines.slice(1 + offset).map(row => {
      if (row.length > 10) {
         const cols = row.split(separator);
         table.push([cols[0]].concat(cols.slice(1).map(f)));
      }
   });
   return [table, indices];
};

const row = (table, idx, key) => table.map(r => r[idx[key]]);

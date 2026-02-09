const params = () => {
    var url = window.location.search.substring(1);
    var query = url.split('&');
    let ans = {};
    query.forEach(pair => {
       let [a, b] = pair.split('=');
       ans[a] = decodeURIComponent(b);
    });
    return ans;
};

const poolName = (vars, sep) => vars['p1'] + sep + vars['p2'];

const replaceText = (eltClass, txt) => {
   let elts = document.getElementsByClassName(eltClass);
   if(elts) {
      Array.prototype.forEach.call(elts, elt => elt.textContent = txt);
   }
};

async function populatePivotPoolUX(graphf, radarp) {
   let vars = params();

   let pp = poolName(vars, '+');
   if(!vars['title']) { vars['title'] = pp + ' Pivot'; }
   if(!vars['file']) { vars['file'] = poolName(vars, '-').toLowerCase(); }

   replaceText('title', vars['title']);
   replaceText('pair', pp);

   document.getElementById('screens').href =
      "diy.html?t1=" + poolName(vars, '&t2=');

   let d = document.getElementById('detail');
   if(d) { d.href = "detail.html?p1=" + poolName(vars, '&p2='); }

   let fileName = 'data/pools/' + vars['file'] + '.tsv';

   fetch(fileName).then(response => response.text())
      .then(data => graphf(data));

   fetch('data/wallets.tsv').then(response => response.text())
      .then(data => {
         let [wallets, idx] = table(data);
         if(radarp) { radarChartTbl(wallets, idx, pp, 1); }
         if(!vars['addy']) {
            let invRows = wallets.filter(r => r[idx['name']] === pp + ' inv');
            let addy = invRows[0][idx['addy']];
            vars['addy'] = addy;
         }
         replaceText('addy', vars['addy']);

         let tot = total(wallets.filter(row => row[idx['pool']] === pp)
                                .map(row => row[idx['TVL']]));
         replaceText('tvl', showUsd(tot));
   });
}

const copyAddy1 = () => {
   let addy = document.getElementById("z").innerText;
   copyAddy(addy);
};

// ----- Pool-indexing --------------------------------------------------

const mkUrl = (row, idx) =>
   "pool.html?p1=" + row[idx['p1']] + "&p2=" + row[idx['p2']];

const poolRow = (pool, row, idx, hrefIx, nonpool=false) => {
   return {
      pool: pool,
      href: nonpool? row[hrefIx] : mkUrl(row, idx),
      incept: row[idx['incept']],
      roi: row[idx['ROI']],
      apr: row[idx['APR']],
      tvl: row[idx['TVL']]
   };
};

const datum = (row, ix, txt) => {
   let cell = row.insertCell(ix);
   cell.innerHTML = txt;
};

const pivotTR = (tableId, rowIx, row) => {
  // ooh! DOM-manipulation henceforth!
  let table = document.getElementById(tableId);
  let tr = table.insertRow(rowIx); // remember: we already have a header row
  let { pool, href, incept, roi, apr, tvl } = row;
  datum(tr, 0, "<a href='" + href + "'>" + pool + "</a>");
  datum(tr, 1, incept);
  datum(tr, 2, tvl);
  datum(tr, 3, roi);
  datum(tr, 4, apr);
};

async function poolInfo(wallets = 'wallets', subDir = '') {
   const poolInfos = [wallettos, idxen, pools, nonPools, tot];
   return poolInfos;
}

const assets = names => {
   let ans = new Set();
   names.forEach(toks => { toks.forEach(tok => ans.add(tok)); });
   return ans;
};

async function indexPools(wallets = 'wallets', subDir = '') {
   let file = 'data/' + subDir + '/' + wallets + '.tsv';
   const pools = [];
   const nonPools = [];
   let tot = 0;
   fetch(file)
      .then(response => {
         if (!response.ok) {
           throw new Error(wallets);
         }
         return response.text();
      })
      .then(data => {
         let [wallets, idx] = table(data);
         let hrefIx = idx['href'];
         let poolRows = wallets.filter(row => row[hrefIx] !== 'n/a');
         poolRows.forEach(row => {
            let pool = row[idx['pool']];
            tot += parseUSD(row[idx['TVL']]);
            if(pool === 'n/a') {
               nonPools.push(poolRow(row[idx['name']], row, idx, hrefIx, true));
            } else { pools.push(poolRow(pool, row, idx, hrefIx)); }
         });
         replaceText('tvl', showUsd(tot));

         let rowIx = 3;
         pools.forEach(row => pivotTR("poolTable", rowIx++, row));
         let stakeIx = rowIx + 2; // to hop over the horizontal rule
         nonPools.forEach(row => pivotTR("poolTable", stakeIx++, row));

         let dappIx = idx['dapp'];
         let pivots = wallets.filter(row => row[dappIx] === 'pools'
                                     || row[dappIx] === 'echo');
         vennTbl(pivots, idx, 'vennChart');
      }).catch(error => alert('No such profile: ' + error));
}

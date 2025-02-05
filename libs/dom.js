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

async function replaceText(graphf, radarp) {
   let vars = params();

   let pp = poolName(vars, '+');
   if(!vars['title']) { vars['title'] = pp + ' Pivot'; }
   if(!vars['file']) { vars['file'] = poolName(vars, '-').toLowerCase(); }

   let t = document.getElementsByClassName('title');
   Array.prototype.forEach.call(t, elt => elt.textContent = vars['title']);

   let p = document.getElementsByClassName('pair');
   Array.prototype.forEach.call(p, elt => elt.textContent = pp);

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

         let a = document.getElementsByClassName('addy')
         Array.prototype.forEach.call(a, elt => elt.textContent = vars['addy']);
   });
}

const copyAddy1 = () => {
   let addy = document.getElementById("z").innerText;
   copyAddy(addy);
};

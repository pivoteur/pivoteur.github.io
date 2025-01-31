const parseUSD = str => parseFloat(str.replace('$', '').replace(',', ''));

const total = row => row.reduce((acc, x) => parseUSD(x) + acc,0);

// because kv-objects don't have .filter(), le sigh.

const fetchLabels = (idx, labelf) => {
   const labels = [];
   for (let k in idx) {
      let lab = labelf(k);
      if (lab) {
         let ix = idx[k];
         labels.push([lab, ix]);
      }
   }
   return labels;
};

const usdLabelf = k => {
   if(k.endsWith('$')) { return k.slice(0, -2); }
};

const usdLabels = idx => {
   return fetchLabels(idx, usdLabelf);
};

const showUsd = n => {
   let d = Math.floor(n);
   let c = Math.floor((n - d) * 100);
   let cents = c === 0 ? "00" : c < 10 ? "0" + c : c;
   return "$" + d + '.' + cents;
};

// extracts the labels and dollar amounts from a table, then:
// 1. puts all USD-assets as 'stable' and
// 2. groups all assets less than a minimum (default 5%) as 'other'
// ... in that order

// labelf takes a label and returns a modified label, so 'BTC $' becomes 'BTC'
// but 'date' returns false or nil or 0 or undefined or [] or whatever 'bottom'
// is in this stupidly-typed language.

// A language has to have one, definitive, bottom for one to keep one's sanity,
// but what do I know, other than what mathematics has taught us for millennia?
// *sigh*

// const tokVals = (table, idx, labelf) => {


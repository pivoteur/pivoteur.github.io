// Distinct colors from https://sashamaps.net/docs/resources/20-colors/
// (excluding black #000000)

// don't use this!

distinctColors = [
    '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0',
    '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8',
    '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff'
];

// use this!

const colors = () => [...distinctColors];

// iwanthue distinct colors for color-blindness
// don't use this!

hueColors = 
   ["#cc554f","#4aab83","#8e62ca","#7ea342","#c75d9c","#c1883f","#6b8dce"];

// use this!

const hues = () => [...hueColors];

const randomColor = colors => {
   let [color, idx] = sampleRow(colors);
   delete colors[idx];
   return color;
};

const randomCyan = () => {
  let jrnd = () => 75 + Math.floor(Math.random() * 156);
  // Generate random values for red, green, and blue (0-255)
  let r = 0; // Blue/Green are the only components with a non-zero values
  let g = jrnd();
  let b = jrnd();

  // Construct the RGB string
  let color = "rgb(" + r + ", " + g + ", " + b + ")";
  return color;
};

const crypto = new Map([
   ["AAVE", "rgb(165, 55, 140)"],
   ["ALGO", "rgb(0, 0, 0)"],
   ["AVAX",  "linear-gradient(135deg, #d80c0c 0%, #de6d6d 100%)"],
   ["BAL",  "rgb(29, 40, 42)"],
   ["BAND", "rgb(81, 111, 250)"],
   ["BNB",  "rgb(240, 185, 11)"],
   ["BTC",   "linear-gradient(135deg, #e78427 0%, #dfa872 100%)"],
   ["BCH",  "rgb(141, 195, 81)"],
   ["ADA",  "rgb(0, 51, 173)"],
   ["LINK", "rgb(6, 103, 208)"],
   ["ATOM", "rgb(46, 49, 72)"],
   ["CRV",  "rgb(93, 0, 250)"],
   ["DAI",  "rgb(255, 183, 77)"],
   ["DOGE", "orange"],
   ["ETH",   "linear-gradient(135deg, #5b6be4 0%, #6c8de9 100%)"],
   ["ETC",  "rgb(89, 212, 175)"],
   ["LTC",  "rgb(166, 169, 170)"],
   ["MKR",  "rgb(26, 171, 155)"],
   ["QI",   "DodgerBlue"],
   ["SOL",  "Turquoise"],
   ["SUSHI","rgb(240, 85, 162)"],
   ["UNDEAD","linear-gradient(135deg, #4b0815 0%, #980523 100%)"],
   ["UNI",  "rgb(255, 0, 122)"],
   ["USDC", "#2775CA"],
   ["sAVAX","#6de7d3"],
   ["stable","linear-gradient(135deg, #99957e 0%, #eddcb2 100%)"],
   ["liquiditypools", "#f3c5f7"],
]);

const baseName = token => token.replace(/[γ\s\$]/g,'');
const colorOf = token => {
   let ans = crypto.get(baseName(token)) || "rgb(255, 255, 255)";
   if(token.startsWith("LP ")) { ans = randomCyan(); }
   return ans;
};
const solidOf = fillOrGradient => {
   const m = /linear-gradient\([^,]+,\s*([^\s]+)/.exec(fillOrGradient);
   return m ? m[1] : fillOrGradient;
};

// Returns a readable hue-matched text color for a label sitting directly on
// top of `fill`
const textOnFill = fill => {
   const probe = document.createElement('div');
   probe.style.color = solidOf(fill);
   document.body.appendChild(probe);
   const resolved = getComputedStyle(probe).color;
   document.body.removeChild(probe);
   const [r, g, b] = resolved.match(/\d+/g).map(Number);

   const relLum = (cr, cg, cb) => {
      const [rs, gs, bs] = [cr, cg, cb].map(c => {
         c /= 255;
         return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
   };

   const DARK_THRESHOLD = 0.10; // below this, black text loses -- go light instead
   return relLum(r, g, b) < DARK_THRESHOLD ? '#c2c6cb' : '#151515';
};

// Shrinks labels that don't fit (full -> data-short -> blank); title always has the full info.
const fitSegLabels = container => {
   container.querySelectorAll('.seg-label').forEach(label => {
      const seg = label.parentElement;
      if (label.scrollWidth > seg.clientWidth && label.dataset.short !== undefined) {
         label.textContent = label.dataset.short;
      }
      if (label.scrollWidth > seg.clientWidth) {
         label.textContent = '';
      }
   });
};

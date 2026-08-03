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
   ["AVAX", "#E84142"],
   ["BAL",  "rgb(29, 40, 42)"],
   ["BAND", "rgb(81, 111, 250)"],
   ["BNB",  "rgb(240, 185, 11)"],
   ["BTC",  "#F7931A"],
   ["BCH",  "rgb(141, 195, 81)"],
   ["ADA",  "rgb(0, 51, 173)"],
   ["LINK", "rgb(6, 103, 208)"],
   ["ATOM", "rgb(46, 49, 72)"],
   ["CRV",  "rgb(93, 0, 250)"],
   ["DAI",  "rgb(255, 183, 77)"],
   ["DOGE", "orange"],
   ["ETH",  "#627EEA"],
   ["ETC",  "rgb(89, 212, 175)"],
   ["LTC",  "rgb(166, 169, 170)"],
   ["MKR",  "rgb(26, 171, 155)"],
   ["QI",   "DodgerBlue"],
   ["SOL",  "Turquoise"],
   ["SUSHI","rgb(240, 85, 162)"],
   ["UNDEAD","#8B1E1E"],
   ["UNI",  "rgb(255, 0, 122)"],
   ["USDC", "#2775CA"],
   ["sAVAX","#F2A9A8"],
   ["stable","#4FD9BE"]
]);

const baseName = token => token.replace(/[γ\s\$]/g,'');
const colorOf = token => {
   let ans = crypto.get(baseName(token)) || "rgb(255, 255, 255)";
   if(token.startsWith("LP ")) { ans = randomCyan(); }
   return ans;
};

// Returns a readable hue-matched text color for a label sitting directly on
// top of `fill`
const textOnFill = (fill, factor = 0.78) => {
   // Resolve any CSS color (named, hex, rgb(), var()) to real RGB via the browser.
   const probe = document.createElement('div');
   probe.style.color = fill;
   document.body.appendChild(probe);
   const resolved = getComputedStyle(probe).color;
   document.body.removeChild(probe);
   const [r, g, b] = resolved.match(/\d+/g).map(Number);

   // WCAG relative luminance + contrast ratio, so we pick whichever of a
   // darkened/lightened candidate actually contrasts best against the fill.
   const relLum = (cr, cg, cb) => {
      const [rs, gs, bs] = [cr, cg, cb].map(c => {
         c /= 255;
         return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
   };
   const contrastRatio = (l1, l2) => {
      const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
      return (hi + 0.05) / (lo + 0.05);
   };

   const fillLum = relLum(r, g, b);
   const dark  = [r, g, b].map(c => Math.round(c * (1 - factor)));
   const light = [r, g, b].map(c => Math.round(c + (255 - c) * factor));
   const darkContrast  = contrastRatio(fillLum, relLum(...dark));
   const lightContrast = contrastRatio(fillLum, relLum(...light));

   const [wr, wg, wb] = darkContrast >= lightContrast ? dark : light;
   return `rgb(${wr}, ${wg}, ${wb})`;
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

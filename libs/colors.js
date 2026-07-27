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
   ["AVAX", "red"],
   ["BAL",  "rgb(29, 40, 42)"],
   ["BAND", "rgb(81, 111, 250)"],
   ["BNB",  "rgb(240, 185, 11)"],
   ["BTC",  "rgb(247, 147, 26)"],
   ["BCH",  "rgb(141, 195, 81)"],
   ["ADA",  "rgb(0, 51, 173)"],
   ["LINK", "rgb(6, 103, 208)"],
   ["ATOM", "rgb(46, 49, 72)"],
   ["CRV",  "rgb(93, 0, 250)"],
   ["DAI",  "rgb(255, 183, 77)"],
   ["DOGE", "orange"],
   ["ETH",  "rgb(142, 118, 255)"],
   ["ETC",  "rgb(89, 212, 175)"],
   ["LTC",  "rgb(166, 169, 170)"],
   ["MKR",  "rgb(26, 171, 155)"],
   ["QI",   "DodgerBlue"],
   ["SOL",  "Turquoise"],
   ["SUSHI","rgb(240, 85, 162)"],
   ["UNDEAD","darkred"],
   ["UNI",  "rgb(255, 0, 122)"],
   ["USDC", "blue"]
]);

const baseName = token => token.replace(/[γ\s\$]/g,'');
const colorOf = token => {
   let ans = crypto.get(baseName(token)) || "rgb(255, 255, 255)";
   if(token.startsWith("LP ")) { ans = randomCyan(); }
   return ans;
};

// Returns a readable, hue-matched text color for a label sitting directly on
// top of `fill` — darkened toward black on light/mid fills, lightened toward
// white on fills that are already dark (e.g. UNDEAD's #8B1E1E), since
// darkening an already-dark color further would be unreadable. Tinting
// toward the fill's own hue (rather than plain black/white) is what keeps
// labeled segbars — the coverage bar, the distributions breakdown — reading
// as intentional rather than a flat black stamp on every color.
const textOnFill = (fill, factor = 0.55) => {
   let r, g, b;
   if (fill.startsWith('#')) {
      let hex = fill.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      const n = parseInt(hex, 16);
      r = (n >> 16) & 255; g = (n >> 8) & 255; b = n & 255;
   } else {
      [r, g, b] = fill.match(/\d+/g).map(Number);
   }
   const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
   const mix = luminance > 0.5
      ? c => Math.round(c * (1 - factor))
      : c => Math.round(c + (255 - c) * factor);
   return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};

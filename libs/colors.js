// Distinct colors from https://sashamaps.net/docs/resources/20-colors/
// (excluding black #000000)

// don't use this!

distinctColors = ['#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe', '#008080', '#e6beff', '#9a6324', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075', '#808080', '#ffffff'];

// use this!

const colors = () => [...distinctColors];

// iwanthue distinct colors for color-blindness
// don't use this!

hueColors = ["#cc554f",
"#4aab83",
"#8e62ca",
"#7ea342",
"#c75d9c",
"#c1883f",
"#6b8dce"];

// use this!

const hues = () => [...hueColors];

const randomColor = colors => {
   let [color, idx] = sampleRow(colors);
   delete colors[idx];
   return color;
};

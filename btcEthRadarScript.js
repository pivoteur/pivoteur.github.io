document.addEventListener('DOMContentLoaded', function () {
    fetch('data/pools/eth-btc.tsv')
        .then(response => response.text())
        .then(file => {
    const lines = file.trim().split('\n');
    const labels = ['BTC $','ETH $', 'BNB $', 'AVAX $', 'QI $', 'UNDEAD $'];
    const ethData = [];
    const undeadData = [];
    const btcData = [];

    const parseNum =
       column => parseFloat(column.replace('$', '').replace(',', ''));
    const parseNums = (columns, ix) => ix.map(i => columns[i]).map(parseNum);

    const parsedData = lines.slice(1).map(line => {
        const columns = line.split('\t');
        return {
            label: columns[0],
            data: parseNums(columns, [6,9,12,15,18,21]),
            fill: true,
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
        };
    });

    colorify = (pd, r, g, b) => { 
       color = (post, r, g, b) => {
          return 'rgb' + post + '(' + r + ', ' + g + ', ' + b;
       };
       const fade = color('a', r, g, b) + ', 0.2)';
       const rgb = color('', r, g, b) + ')';

       return { ...pd,
          backgroundColor: fade,
          borderColor: rgb,
          pointBackgroundColor: rgb,
          pointHoverBorderColor: rgb
       };
    };
    parsedData[0] = colorify(parsedData[0], '255', '99', '132');
    parsedData[1] = colorify(parsedData[1], '54', '162', '235');
    parsedData[2] = colorify(parsedData[2], '0', '255', '0');

    const data = { labels: labels, datasets: parsedData };
    const plugin = {
       id: 'customCanvasBackgroundColor',
       beforeDraw: (chart, args, options) => {
         const {ctx} = chart;
         ctx.save();
         ctx.globalCompositeOperation = 'destination-over';
         ctx.fillStyle = options.color || '#99ffff';
         ctx.fillRect(0, 0, chart.width, chart.height);
         ctx.restore();
       }
    };

    const ctx = document.getElementById('radarChart').getContext('2d');

    new Chart(ctx, {
        type: 'radar',
        data: data,
        options: { 
         elements: { line: { borderWidth: 3 } },
         plugins: {
           customCanvasBackgroundColor: { color: 'black' }
         },
         scales: { r: { angleLines: { display: true },
                        backgroundColor: "DimGray" }},
        },
        plugins: [plugin] });
  });
});

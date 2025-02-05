const radarChart = (data, kind, offset=0) => {
    let [wallets, idx] = table(data);
    radarChartTbl(wallets, idx, kind, offset);
}

const radarChartTbl = (wallets, idx, kind, offset=0) => {
    let dapp = wallets.filter(row => row[1 + offset] === kind);

    let labels = [];
    let ix = [];
    usdLabels(idx).forEach(([k, i]) => {
       labels.push(k);
       ix.push(i);
    });

    const parseNums = (columns, ix) => ix.map(i => columns[i]).map(parseUSD);

    const addys = dapp.map(wallet => {
        return {
            label: wallet[0],
            data: parseNums(wallet, ix),
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
    addys[0] = colorify(addys[0], '255', '99', '132');
    addys[1] = colorify(addys[1], '54', '162', '235');
    if (addys.length > 2) {
       addys[2] = colorify(addys[2], '0', '255', '0');
    }

    const ctx = document.getElementById('radarChart').getContext('2d');

    new Chart(ctx, {
        type: 'radar',
        data: { labels: labels, datasets: addys },
        options: { 
         elements: { line: { borderWidth: 3 } },
         plugins: {
           legend: { labels: { color: 'white' } },
           customCanvasBackgroundColor: { color: 'black' }
         },
         scales: { r: { angleLines: { display: true },
                        pointLabels: { color: "white" },
                        backgroundColor: "DimGray" }},
        },
        plugins: [plugin] });
};

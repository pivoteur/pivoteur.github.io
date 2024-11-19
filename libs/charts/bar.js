const barChart = data => {
    let [assets, idx] = table(data);

    const myColors = hues();
    const labels = [];
    for (let k in idx) { if (k.endsWith('$')) { labels.push([k, idx[k]]); } }

    const parsedData = assets.map(columns => {
        const daters = {};
        labels.forEach(([k, i]) => { daters[k] = parseUSD(columns[i]); });
        return {
            date: columns[0],
            data: daters
        };
    });

    parsedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    let amounts = {};
    const dates = [];
    parsedData.forEach(row => {
        dates.push(row.date);
        for(let asset in row.data) { 
           let datum = row.data[asset];
           if (amounts[asset]) {
              amounts[asset].push(datum);
           } else {
              amounts[asset] = [datum];
           }
        }
    });

    let datasets = [];
    const mkSet = asset => {
       return {
          label: asset,
          data: amounts[asset],
          backgroundColor: randomColor(myColors)
       };
    };
    for (let amount in amounts) { datasets.push(mkSet(amount)); };

    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: datasets,
        },
        options: {
            responsive: true,
            plugins: {
               legend: { labels: { color: 'white' } },
               customCanvasBackgroundColor: { color: 'black' }
            },
            scales: { x: { stacked: true }, y: { stacked: true } }
        },
        plugins: [plugin]
    });
};

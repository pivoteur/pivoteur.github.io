const barChart = data => {
    let [assets, idx] = table(data);

    const randomColor = () => 
       '#' + Math.floor(Math.random()*16777215).toString(16);

    const parseUSD = col => parseFloat(col.replace('$', '').replace(',', ''));

    const labels = idx.filter(k => k.endsWith('$'));

    const parsedData = assets.map(columns => {
        const daters = labels.map((k, i) => { k: parseUSD(columns[i]) });
        return {
            date: columns[0],
            data: daters
        };
    });

    parsedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    let amounts = {};
    parsedData.forEach(row => {
        dates.push(row.date);
        for(let asset in row.data) { amounts[asset].push(row.data[asset]); }
    });

    let datasets = [];
    const mkSet = asset => {
       return {
          label: asset,
          data: amounts[asset],
          backgroundColor: randomColor()
       };
    ;
    for (let amount in amounts) { datasets.push(mkSet(amount)); }

    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: datasets,
        },
        options: {
            responsive: true,
            plugins: { legend: { labels: { color: 'white' } } },
            scales: { x: { stacked: true }, y: { stacked: true } }
        }
    });
});

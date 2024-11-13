document.addEventListener('DOMContentLoaded', function () {
    fetch('data/assets.tsv')
        .then(response => response.text())
        .then(data => {
    const lines = data.trim().split('\n');
    const labels = [];
    const ethData = [];
    const undeadData = [];
    const bnbData = [];

    const parsedData = lines.slice(1).map(line => {
        const columns = line.split('\t');
        return {
            date: columns[0],
            eth: parseFloat(columns[3].replace('$', '').replace(',', '')),
            undead: parseFloat(columns[6].replace('$', '').replace(',', '')),
            bnb: parseFloat(columns[9].replace('$', '').replace(',', ''))
        };
    });

    parsedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    parsedData.forEach(item => {
        labels.push(item.date);
        ethData.push(item.eth);
        undeadData.push(item.undead);
        bnbData.push(item.bnb);
    });

    const ctx = document.getElementById('cryptoChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'ETH $',
                    data: ethData,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
                {
                    label: 'UNDEAD $',
                    data: undeadData,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                },
                {
                    label: 'BNB $',
                    data: bnbData,
                    backgroundColor: 'rgba(255, 159, 64, 0.6)',
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                        legend: {
                            labels: {
                                color: 'white' // Set the text color to white for brightness
                            }
                        }
                    },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                }
            }
        }
    });
});
});

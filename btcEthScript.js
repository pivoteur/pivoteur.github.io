document.addEventListener('DOMContentLoaded', function () {
    fetch('data/btc-eth.tsv')
        .then(response => response.text())
        .then(data => {
            const lines = data.trim().split('\n');
            const labels = [];
            const btcEthData = [];
            const sma100Data = [];
            const ema20Data = [];

            for (let i = 1; i < lines.length; i++) {
                const columns = lines[i].split('\t');
                const dt = new Date(columns[0]);
                if (dt > day100) {
                   labels.push(columns[0]);
                   btcEthData.push(parseFloat(columns[1]));
                   sma100Data.push(parseFloat(columns[3]));
                   ema20Data.push(parseFloat(columns[4]));
                }
            }

            const ctx = document.getElementById('btcEthChart')
                                .getContext('2d');

            const rgba = (r, g, b, a) =>
               'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';

            const datum = (label, d, r, g, b) => {
               label,
               data: d,
               borderColor: rgba(r, g, b, 1),
               backgroundColor: rgba(r, g, b, 0.2),
               fill: false
            };

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        datum('BTC/ETH', btcEthData, '255', '99', '132'),
                        datum('SMA-100', sma100Data, '54', '162', '235'),
			datum('EMA-20', ema20Data, '75', '192', '192')
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                       customCanvasBackgroundColor: { color: 'black' }
                    },
                    scales: { y: { beginAtZero: false } }
                },
                plugins: [plugin]
            });
        });
});

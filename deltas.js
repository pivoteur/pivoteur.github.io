document.addEventListener('DOMContentLoaded', function () {
    fetch('data/btc-eth.tsv')
        .then(response => response.text())
        .then(data => {
            const lines = data.trim().split('\n');
            const labels = [];
            const deltaData = [];
            const maxDeltaData = [];
            const minDeltaData = [];

            for (let i = 1; i < lines.length; i++) {
                const columns = lines[i].split('\t');
                const dt = new Date(columns[0]);
                if (dt > day100) {
                   labels.push(columns[0]);
                   const delta = parseFloat(columns[5]);
                   deltaData.push(delta);
                   maxDeltaData.push(parseFloat(columns[6]));
                   minDeltaData.push(parseFloat(columns[7]));
                }
            }

            const ctx = document.getElementById('deltasChart').getContext('2d');
            const rgba = (r, g, b, a) =>
               'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
            const line = (label, d, r, g, b) => {
               label: label + ' δ',
               data: d,
               borderColor: rgba(r, g, b, '1'),
               backgroundColor: rgba(r, g, b, '0.2'),
               fill: false,
               type: 'line'
            };

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'δ',
                            data: deltaData,
                            backgroundColor: 'rgba(255, 159, 64, 0.6)',
                            type: 'bar'
                        },
                        line('Max', maxDeltaData, '75', '192', '192'),
                        line('Min', minDeltaData, '153', '102', '255')
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

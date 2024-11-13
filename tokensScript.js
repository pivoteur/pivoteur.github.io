document.addEventListener('DOMContentLoaded', function () {
    fetch('data/tokens.tsv')
        .then(response => response.text())
        .then(data => {
            const lines = data.trim().split('\n');
            const labels = [];
            const tvlData = [];

            for (let i = 1; i < lines.length; i++) {
                const columns = lines[i].split('\t');
                labels.push(columns[0]);
                tvlData.push(parseFloat(columns[3].replace('$', '').replace(',', '')));
            }

            const ctx = document.getElementById('tokensChart').getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'TVL $',
                        data: tvlData,
                        backgroundColor: [
                            'pink',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                            'red',
                            'green',
                            'rgba(153, 102, 255, 0.6)'
                        ],
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'left',
                            align: 'start',
                            labels: {
                                color: 'white', // Set the text color to white for brightness
                                font: {
                                    size: 14 // Adjust the font size if needed
                                }
                            }
                        }
                    }
                }
            });
        });
});

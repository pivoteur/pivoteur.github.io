document.addEventListener('DOMContentLoaded', function () {
    fetch('data/dapps.tsv')
        .then(response => response.text())
        .then(data => {
            const lines = data.trim().split('\n');
            const labels = [];
            const tvlData = [];

            for (let i = 1; i < lines.length; i++) {
                const columns = lines[i].split('\t');
                labels.push(columns[0]);
                tvlData.push(parseFloat(columns[1].replace('$', '').replace(',', '')));
            }

            const ctx = document.getElementById('dappsChart').getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'TVL $',
                        data: tvlData,
                        backgroundColor: [
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                            'rgba(255, 205, 86, 0.6)',
                            'rgba(54, 162, 235, 0.6)'
                        ],
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'right',
                            align: 'start',
                            labels: {
                                color: 'white' // Set the text color to white for brightness
                            }
                        }
                    },
onClick: (event, elements) => {
                        if (elements.length > 0) {
                            const index = elements[0].index;
                            const label = labels[index];
                            const url = `/${label.toLowerCase()}.html`;
			    console.log("I am redirecting to: " + url);
                            window.location.href = url;
                        }
                    }
                }
            });
        });
});

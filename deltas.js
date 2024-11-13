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
                        {
                            label: 'Max δ',
                            data: maxDeltaData,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: false,
                            type: 'line'
                        },
                        {
                            label: 'Min δ',
                            data: minDeltaData,
                            borderColor: 'rgba(153, 102, 255, 1)',
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                            fill: false,
                            type: 'line'
                        }
                    ]
                },
                options: {
                    responsive: true,
plugins: {
      customCanvasBackgroundColor: {
        color: 'black',
      }
    },

                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                },
                plugins: [plugin]
            });
        });
});

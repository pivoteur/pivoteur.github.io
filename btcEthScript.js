const today = new Date();
const day100 = priorDate = new Date(new Date().setDate(today.getDate() - 100));

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
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'BTC/ETH',
                            data: btcEthData,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            fill: false,
                        },
                        {
                            label: 'SMA-100',
                            data: sma100Data,
                            borderColor: 'rgba(54, 162, 235, 1)',
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            fill: false,
                        },
                        {
                            label: 'EMA-20',
                            data: ema20Data,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            fill: false,
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

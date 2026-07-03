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

// Draws a total figure in the hole of a doughnut chart — used by pie.js so
// the reader doesn't have to add up legend values by hand.
const centerTextPlugin = {
  id: 'centerText',
  afterDraw: (chart, args, options) => {
    const opts = chart.options.plugins.centerText;
    if (!opts || !opts.enabled) return;
    const { ctx, chartArea: { left, right, top, bottom } } = chart;
    const cx = (left + right) / 2;
    const cy = (top + bottom) / 2;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(242,245,248,0.95)';
    ctx.font = "700 16px 'JetBrains Mono', monospace";
    const totalStr = '$' + opts.total.toLocaleString('en-US', { maximumFractionDigits: 0 });
    ctx.fillText(totalStr, cx, cy - 6);
    ctx.fillStyle = 'rgba(184,196,232,0.42)';
    ctx.font = "11px Inter, -apple-system, system-ui, sans-serif";
    ctx.fillText('total', cx, cy + 12);
    ctx.restore();
  }
};

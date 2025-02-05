const gitLGurl = 'https://raw.githubusercontent.com/logicalgraphs';
const cryptoUrl = gitLGurl + '/crypto-n-rust/refs/heads/main';

const pivotsUrl = cryptoUrl + '/data-files/csv/pivots.csv';

const pivotTable = data => table(data, ',', 1, parseFloat);

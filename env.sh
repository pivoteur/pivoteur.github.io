export PIVOT_DATA_DIR=$PIVOT_DIR/data

export WALLETS=$PIVOT_DATA_DIR/wallets.tsv

function update1 { TSV=$1.tsv; rm -f $TSV; vi $TSV; git add $TSV }

function update { update1 data/$1 }

function pool { update1 data/pools/$1 }

function gains { echo "* actual ROI: $1 / $2 APR projected" | despace }

export PIVOT_DATA_DIR=$PIVOT_DIR/data

export WALLETS=$PIVOT_DATA_DIR/wallets.tsv

function update {
   FILE=$1; DIR=data; TSV=$DIR/$FILE.tsv; rm $TSV; vi $TSV; git add $TSV
}

function pool {
   FILE=$1; DIR=data/pools; TSV=$DIR/$FILE.tsv; rm $TSV; vi $TSV; git add $TSV
}

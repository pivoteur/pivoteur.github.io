export PIVOT_DATA_DIR=$PIVOT_DIR/data

export WALLETS=$PIVOT_DATA_DIR/wallets.tsv

function update {
   cd $PIVOT_DATA_DIR; rm $1; vi $1; git add $1; cd -
}

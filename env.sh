export PIVOT_DATA_DIR=$PIVOT_DIR/data

export WALLETS=$PIVOT_DATA_DIR/wallets.tsv

function update {
   rm $PIVOT_DATA_DIR/$1; vi $PIVOT_DATA_DIR/$1; git add $PIVOT_DATA_DIR/$1
}

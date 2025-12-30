export PIVOT_DATA_DIR=$PIVOT_DIR/data

export WALLETS=$PIVOT_DATA_DIR/wallets.tsv

# -- GIT -------------------------------------------------------------

function vig { vi $1; git add $1 }

function update1 { TSV=$1.tsv; rm -f $TSV; vig $TSV }

function update { update1 data/$1 }

function pool { update1 data/pools/$1 }
function opn { update1 data/pivots/open/raw/$1 }
function cls { update1 data/pivots/close/raw/$1 }
function stk { update1 data/pivots/stakes/raw/$1 }
function dist { update1 data/pivots/dists/raw/$1 }

# ... and a li'l bit o' obscuation

function profile { hashed=$(printf "%s" "$1" | sha256); update1 data/profiles/$hashed }

# ... editing files in-place without deleting the original

function vid { vig data/$1.tsv }

# -- REPORTAGE -------------------------------------------------------

function gains { echo "* actual ROI: $1 / $2 APR projected" | despace }

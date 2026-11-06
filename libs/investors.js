async function fetchInvestorStakes(investorAddress, filePath = './data/profiles/investors.tsv') {
    if (!investorAddress) throw new Error("No investor address provided.");

    const response = await fetch(filePath);
    if (!response.ok) throw new Error(`Failed to load file: ${filePath}`);
    
    const tsvText = await response.text();
    const lines = tsvText.split('\n')
        .map(line => line.replace(/\r$/, '').split('\t'));

    if (lines.length < 4) throw new Error("TSV file format invalid or empty.");

    // Row 0 has your unique pool identifiers
    const poolRow = lines[0]; 
    const subHeaders = lines[1];
    
    // 1. Gather all unique pool names in order from Row 0
    const orderedPoolNames = poolRow
        .slice(3)
        .map(p => p.trim())
        .filter(p => p !== "");

    // 2. Find the investor row using the async loop
    let investorCells = null;

    for (let i = 4; i < lines.length; i++) {
        const row = lines[i];
        if (row && row[2]) {
            const hashedRowAddress = await digestLowercasedMessage(row[2].trim());
            if (hashedRowAddress === investorAddress) {
                investorCells = row;
                break;
            }
        }
    }

    if (!investorCells) {
        return { found: false, timestamp: lines, pools: [] };
    }

    // 3. Process each pool by strictly applying your updated structural rule
    const parsedPools = [];
    let currentColumnIndex = 3; // Data columns start at index 3

    orderedPoolNames.forEach(poolName => {
        const poolData = {
            name: poolName,
            metrics: {},
            assets: {}
        };

        let assetTokens = [];
        
       // Determine total columns for this block based on your structural rule
        // Non-UNDEAD = 3 assets + 3 metrics = 6 columns total
        // UNDEAD = 2 assets + 3 metrics = 5 columns total
        const totalBlockColumns = poolName.includes('UNDEAD') ? 5 : 6;
        const endColumnIndex = currentColumnIndex + totalBlockColumns;

        // Loop through this pool's precise sub-slice of columns
        for (let i = currentColumnIndex; i < endColumnIndex; i++) {
            const metricName = subHeaders[i] ? subHeaders[i].trim() : "";
            const rawValue = investorCells[i] ? investorCells[i].trim() : "0";

            if (!metricName) continue;

            // Dynamically match based on whatever row 1 actually says!
            if (['TVL', '%', 'reinvest'].includes(metricName)) {
                poolData.metrics[metricName] = rawValue;
            } else {
                poolData.assets[metricName] = rawValue;
            }
        }

        // Advance the pointer to the start of the next pool block
        currentColumnIndex = endColumnIndex;
        parsedPools.push(poolData);
    });

    return {
        found: true,
        timestamp: lines[0][0],
        alias: investorCells[1],
        address: investorCells[2],
        pools: parsedPools
    };
}

function renderInvestorTable(data, targetTableId = 'poolTable') {
    const tableElement = document.getElementById(targetTableId);
    if (!tableElement) return;

    if (!data.found) {
        tableElement.innerHTML = `<tr><td colspan="4">Investor profile not found in current snapshot.</td></tr>`;
        return;
    }

    // Applying a consistent background style rule directly inline to all header cells
    const headerStyle = `background-color: #333333; color: #ffffff; padding: 10px; font-weight: bold; border: 1px solid #444444;`;

    let htmlContent = `
        <thead>
            <tr>
                <th colspan="4" style="${headerStyle} text-align: left;">
                    <strong>Investor Profile:</strong> ${data.alias} (${data.address.slice(0, 6)}...${data.address.slice(-4)})
                    <span style="float: right; font-weight: normal; font-size: 0.85em; color: #cccccc;">Snapshot: ${data.timestamp}</span>
                </th>
            </tr>
            <tr>
                <th style="${headerStyle} text-align: left;">Pool</th>
                <th style="${headerStyle} text-align: left;">Asset Balances</th>
                <th style="${headerStyle} text-align: left;">Value (TVL)</th>
                <th style="${headerStyle} text-align: left;">Reinvestment</th>
            </tr>
        </thead>
        <tbody>
    `;

    data.pools.forEach(pool => {
        const tvlShare = pool.metrics['TVL'] || "$0.00";
        const pctShare = pool.metrics['%'] ? ` (${pool.metrics['%']})` : "";
        const reinvest = pool.metrics['reinvest'] || "n/a";

        const assetBreakdown = Object.entries(pool.assets)
            .map(([tokenName, quantity]) => {
                const num = parseFloat(quantity);
                if (isNaN(num) || num === 0) return null; // Skips printing zero holdings
                
                return `<div style="margin-bottom: 2px;"><strong>${tokenName}:</strong> ${quantity}</div>`;
            })
            .filter(Boolean)
            .join("") || `<span style="color: #999;">0.00</span>`;

        htmlContent += `
            <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 8px; vertical-align: top;"><strong>${pool.name}</strong></td>
                <td style="padding: 8px; vertical-align: top;">${assetBreakdown}</td>
                <td style="padding: 8px; vertical-align: top; text-align: right;">${tvlShare}<small style="color:#666;">${pctShare}</small></td>
                <td style="padding: 8px; vertical-align: top;">${reinvest}</td>
            </tr>
        `;
    });

    htmlContent += `</tbody>`;
    tableElement.innerHTML = htmlContent;
}

// 3. Orchestration Example
// async function init() {
//    const [investorAddress] = Object.values(params());
//    try {
//        const stakeData = await fetchInvestorStakes(investorAddress);
//        renderInvestorTable(stakeData);
//    } catch(err) {
//        console.error("Pipeline failure:", err);
//    }
// }


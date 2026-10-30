// 1. Get the profile address from the URL parameters
let [investorAddress] = Object.values(params());

async function loadInvestorStakes() {
    if (!investorAddress) {
        console.error("No investor address provided in URL parameters.");
        return;
    }

    try {
        // Fetch the raw TSV file from your repository's relative path
        const response = await fetch('./data/profiles/investors.tsv');
        const tsvText = await response.text();

        // Split data into lines and map columns
        const lines = tsvText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        // The first line is the timestamp (e.g., 2026-09-24), the second line contains the headers
        const poolHeaders = lines[1].split('\t'); 
        
        // Find the specific investor's row (skipping timestamp and header rows)
        let investorRow = null;
        for (let i = 2; i < lines.length; i++) {
            const cells = lines[i].split('\t');
            // Assuming the first column is the investor address
            if (cells[0].toLowerCase() === investorAddress.toLowerCase()) {
                investorRow = cells;
                break;
            }
        }

        if (!investorRow) {
            document.getElementById('poolTable').innerHTML = `<tr><td colspan="5">Investor address not found.</td></tr>`;
            return;
        }

        // Render the matched stakes into your table
        const table = document.getElementById('poolTable');
        
        // Clear old structural rows if needed, keeping your table headers, or append dynamically
        // Here we build row items starting from index 1 (skipping address index 0)
        let htmlContent = `
            <tr>
                <th>Pool Name</th>
                <th>Stake Amount</th>
            </tr>
        `;

        for (let j = 1; j < poolHeaders.length; j++) {
            const poolName = poolHeaders[j];
            const stakeValue = investorRow[j] || "0.00"; // fallback if cell is blank
            
            htmlContent += `
                <tr>
                    <td><strong>${poolName}</strong></td>
                    <td>${stakeValue}</td>
                </tr>
            `;
        }

        table.innerHTML = htmlContent;

    } catch (error) {
        console.error("Error reading the investor data TSV file:", error);
    }
}

// Call the function on page load
loadInvestorStakes();


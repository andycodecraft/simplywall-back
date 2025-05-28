const AWS = require('aws-sdk');
const XLSX = require('xlsx');
const { PassThrough } = require('stream');
require('dotenv').config();
const pool = require('./stocks/connection');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,  // Use environment variables for credentials
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1' // Specify your region
});

function updateDatabase() {
  try {
      const params = {
          Bucket: 'superid-llm-test',
          Key: 'Excel/Stocks_Chart.xlsx'
      };

      const fileStream = s3.getObject(params).createReadStream();
      const passThrough = new PassThrough();
      fileStream.pipe(passThrough);
      let fileContent = [];

      passThrough.on('data', (chunk) => {
          fileContent.push(chunk);
      });

      passThrough.on('end', async () => {
        const completeBuffer = Buffer.concat(fileContent);
        const workbook = XLSX.read(completeBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        const query = `TRUNCATE all_ideas `;

        try {
          await pool.query(query);
          jsonData.forEach(async (idea) => {
            const downloadValue = idea['Download'] ? idea['Download'] : '';
            const query = `INSERT INTO all_ideas (company_name, symbol_ticker, ai_rating, advice_type, stock_price, market_cap, sub_industry, risk_level, est_upside, return_rating, pdf_file) VALUES ('${idea['Company Name']}', '${idea['Symbol / Ticker']}', ${idea['AI Advisor Rating']}, '${idea['Advice Type']}', '${idea['$ Stock Price']}', '${idea['$ Market Cap']}', '${idea['Sub-Industry']}', '${idea['Risk Level']}', '${idea['Est. % Upside']}', '${idea['% Return Since Write-Up']}', '${downloadValue}')`;
            await pool.query(query);
          });
            
        } catch (error) {
            console.error('Error executing TRUNCATE query:', error);
        }
      });

      passThrough.on('error', (error) => {
          console.error('Error processing stream:', error);
      });

  } catch (error) {
      console.error('Error in downloadPDF:');
  }
}

setInterval(updateDatabase, 100000);
updateDatabase();
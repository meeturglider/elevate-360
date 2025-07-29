const express = require('express');
const cors = require('cors');
const { BigQuery } = require('@google-cloud/bigquery');

const SCOPES = [
  'https://www.googleapis.com/auth/bigquery',
  'https://www.googleapis.com/auth/drive.readonly' // Add this for Google Drive access
];
const app = express();
const PORT = 3001;

app.use(cors());

const bigquery = new BigQuery({
  keyFilename: './src/keys.json', // Make sure the filename and path are correct
  projectId: 'elevate360-poc',
     scopes: SCOPES, // Pass the array of scopes here

});

app.get('/api/ces-data', async (req, res) =>{
  try {
    const [job] = await bigquery.createQueryJob({
      query: `
  SELECT 
    string_field_6 AS specialization, 
    ROUND(AVG(SAFE_CAST(string_field_9 AS FLOAT64)), 2) AS avg_ces_score_percentage
  FROM \`elevate360-poc.ces_data_cgn.source\`
  WHERE string_field_8 = 'CGN - HYD' 
    AND SAFE_CAST(string_field_9 AS FLOAT64) IS NOT NULL
  GROUP BY string_field_6
  ORDER BY avg_ces_score_percentage DESC
  LIMIT 10
  OFFSET 1
`,
      location: 'US',
      useLegacySql: false,
    });
    const [rows] = await job.getQueryResults();
    res.json(rows);
  } catch (error) {
    console.error('❌ Error running query:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


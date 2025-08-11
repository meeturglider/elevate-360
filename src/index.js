const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { BigQuery } = require('@google-cloud/bigquery');

const SCOPES = [
  'https://www.googleapis.com/auth/bigquery',
  'https://www.googleapis.com/auth/drive.readonly'
];
const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const bigquery = new BigQuery({
  keyFilename: './src/keys.json',
  projectId: 'elevate360-poc',
  scopes: SCOPES,
});

app.get('/api/ces-data', async (req, res) => {
  // This correctly receives all four parameters
  const { startDate, endDate, businessLine, site } = req.query;

  console.log('Received request with params:', { startDate, endDate, businessLine, site });

  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'startDate and endDate are required' });
  }

  // This robustly builds the filter conditions
  const filters = [
    "SAFE_CAST(string_field_9 AS FLOAT64) IS NOT NULL",
    `PARSE_DATE('%Y-%m-%d', string_field_4) BETWEEN DATE('${startDate}') AND DATE('${endDate}')`
  ];

  if (site && site !== 'Select') {
    // CORRECTED: This now correctly forms a SQL string
    filters.push(`TRIM(string_field_8) = '${site.trim()}'`);
  }

  if (businessLine && businessLine !== 'Select') {
    // CORRECTED: This now correctly forms a SQL string
    filters.push(`string_field_5 = '${businessLine.trim()}'`);
  }

  const whereClause = filters.join(' AND ');

  const query = `
    SELECT
      string_field_6 AS specialization,
      ROUND(AVG(SAFE_CAST(string_field_9 AS FLOAT64)), 2) AS avg_ces_score_percentage
    FROM
      \elevate360-poc.ces_data_cgn.source\
    WHERE
      ${whereClause}
    GROUP BY
      string_field_6
    ORDER BY
      avg_ces_score_percentage DESC
    LIMIT 10
  `;

  console.log('Sending this query to BigQuery:', query); 

  try {
    const [rows] = await bigquery.query({ query });
    res.json(rows);
  } catch (err) {
    console.error('BigQuery Error:', err);
    res.status(500).send('Query Failed');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
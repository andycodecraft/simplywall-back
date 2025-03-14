const AWS = require('aws-sdk');
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,  // Use environment variables for credentials
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1' // Specify your region
});

exports.getPDFList = async (req, res) => {
  try {
    const params = {
      Bucket: 'superid-llm-test',
      Prefix: 'PDFs/'
    };

    const data = await s3.listObjectsV2(params).promise();
    res.json(data.Contents.map(item => item.Key));
  } catch (error) {
    res.status(500).send('Error fetching files');
  }
}

exports.downloadPDF = async (req, res) => {
  try {
    const fileKey = req.query.fileKey;

    if (!fileKey) {
      return res.status(400).send('fileKey is required');
    }

    const params = {
      Bucket: 'superid-llm-test',
      Key: fileKey
    };

    const fileStream = s3.getObject(params).createReadStream();

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(path.basename(fileKey))}"`);
    res.setHeader('Content-Type', 'application/pdf');

    fileStream.pipe(res).on('error', (error) => {
      console.error('Error downloading file:', error);
      res.status(500).send('Error downloading file');
    });

  } catch (error) {
    console.error('Error in downloadPDF:', error);
    res.status(500).send('Error processing your request');
  }
}

const CryptoJS = require('crypto-js');
const pool = require('../connection');
const AWS = require('aws-sdk');
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
});

exports.getTopStocks = async (req, res) => {
  try {
    const query = 'SELECT * FROM top_ideas ORDER BY `order`';
    const [details] = await pool.query(query);

    const resData = {
      status: true,
      response: details
    }

    res.status(200).json(resData);
  } catch (error) {
    const resData = {
      status: false,
      response: error.message
    }
    res.status(400).json(resData);
  }
}

const getSignedUrlAsync = (params) => {
  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', params, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
};

function extractContent(text) {
  const imageLinkRegex = /\[?(Images\/[^\]\s]+)\]?/g;

  const imageLinks = [];
  let match;
  while ((match = imageLinkRegex.exec(text)) !== null) {
    imageLinks.push(match[1]);
  }
  return imageLinks;
}

exports.getTopStockById = async (req, res) => {
  try {
    const encrypt_id = decodeURIComponent(req.body.stock_id);
    const secretKey = 'mySecretKey';
    const bytes = CryptoJS.AES.decrypt(encrypt_id, secretKey);
    const stock_id = bytes.toString(CryptoJS.enc.Utf8);

    const query = `SELECT * FROM top_ideas WHERE id = ${stock_id}`;
    const [details] = await pool.query(query);

    const content_query = `SELECT * FROM idea_details WHERE idea_id = ${stock_id}`;
    let [contents] = await pool.query(content_query);
    // console.log(contents)
    if (contents) {
      const tasks = contents.map(async (content) => {
        if (content['content']) {
            const imageLinks = extractContent(content['content'])
            for (const imageLink of imageLinks) {
              const params = {
                Bucket: 'superid-llm-test',
                Key: imageLink,
              };
      
              try {
                const url = await getSignedUrlAsync(params);
                content['content'] = content['content'].split('[' + imageLink + ']').join('[' + url + ']');
              } catch (error) {
                console.error('Error getting signed URL:', error);
              }
            }
        }
        return content;
      });
      contents = await Promise.all(tasks);
    }
    if (details) {
      details[0]['detail'] = contents;
    }

    const resData = {
      status: true,
      response: details,
    };

    res.status(200).json(resData);
  } catch (error) {
    const resData = {
      status: false,
      response: error.message,
    };
    res.status(400).json(resData);
  }
};

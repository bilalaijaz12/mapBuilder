const axios = require('axios');

const lightboxClient = axios.create({
  baseURL: 'https://api.lightboxre.com/v1',
  headers: {
    'x-api-key': process.env.LIGHTBOX_API_KEY
  }
});

console.log('Lightbox API key:', process.env.LIGHTBOX_API_KEY);

module.exports = lightboxClient;
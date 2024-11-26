const lightboxClient = require('../config/lightbox.config');

exports.getParcelByGeometry = async (req, res, next) => {
  try {
    const { wkt, bufferDistance = 50, bufferUnit = 'm' } = req.body;
    
    console.log('Request params:', { wkt, bufferDistance, bufferUnit }); // Log request params

    const response = await lightboxClient.get('/parcels/us/geometry', {
      params: {
        wkt,
        bufferDistance,
        bufferUnit
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Lightbox API error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    next(error);
  }
};

exports.getParcelByAddress = async (req, res, next) => {
    try {
      const { text } = req.query;
      
      const response = await lightboxClient.get('/parcels/address', {
        params: {
          text
        }
      });
  
      res.json(response.data);
    } catch (error) {
      console.error('Lightbox API error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      next(error);
    }
};
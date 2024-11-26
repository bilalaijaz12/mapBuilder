const lightboxClient = require('../config/lightbox.config');

exports.getZoningByParcelId = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const response = await lightboxClient.get(`/zoning/_on/parcel/us/${id}`);

    res.json(response.data);
  } catch (error) {
    console.error('Zoning API error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    next(error);
  }
};
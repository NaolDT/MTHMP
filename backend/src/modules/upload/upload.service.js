const cloudinary = require('../../config/cloudinary');
const ApiError = require('../../shared/utils/ApiError');


const logger = require('../../shared/utils/logger');

function uploadImage(buffer, { tenantId, category }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `mthmp/${tenantId}/${category}`,
        resource_type: 'image',
        transformation: [{ width: 1600, height: 1600, crop: 'limit' }],
      },
      (error, result) => {
        // if (error) {
        //   logger.error('Cloudinary upload failed', {
        //     message: error.message,
        //     httpCode: error.http_code,
        //     name: error.name,
        //   });
        //   return reject(ApiError.internal('Image upload failed'));
        // }
        if (error) {
  logger.error('Cloudinary upload failed', {
    message: error.message,
    httpCode: error.http_code,
    name: error.name,
  });
  return reject(ApiError.internal('Image upload failed'));
}
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

module.exports = { uploadImage };
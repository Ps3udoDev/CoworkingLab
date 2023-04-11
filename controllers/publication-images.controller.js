const { uploadFile, deleteFile } = require('../libs/awsS3');
const ProfilesService = require('../services/profiles.service');
const PublicationImagesService = require('../services/publications-images.service');
const PublicationsServices = require('../services/publications.service');
const { CustomError } = require('../utils/helpers');

const publicationImagesService = new PublicationImagesService();
const publicationServices = new PublicationsServices();
const profileServices = new ProfilesService();

const uploadImage = async (req, res, next) => {
  const publicationId = req.params.id;
  const files = req.files;
  const userLogin = req.user.id;
  try {
    const publication = await publicationServices.getPublication(publicationId);
    const admin = await profileServices.findProfileByUserID(userLogin);
    if (publication.user_id == userLogin || admin.role == 2) {
      if (files.length < 1)
        throw new CustomError('No images received', 400, 'Bad Request');

      let imagesKeys = [];
      let imagesErrors = [];

      let openSpots = await publicationImagesService.getAvalibleImageOrders(
        publicationId
      );
      await Promise.all(
        openSpots.map(async (spot, index) => {
          try {
            if (!files[index]) return '';

            let fileKey = `public/publications/images/image-${publicationId}-${spot}`;

            if (files[index].mimetype == 'image/jpg') {
              fileKey = `public/publications/images/image-${publicationId}-${spot}.png`;
            }

            if (files[index].mimetype == 'image/jpg') {
              fileKey = `public/publications/images/image-${publicationId}-${spot}.jpg`;
            }

            if (files[index].mimetype == 'image/jpeg') {
              fileKey = `public/publications/images/image-${publicationId}-${spot}.jpeg`;
            }

            await uploadFile(files[index], fileKey);

            let bucketURL = process.env.AWS_DOMAIN + fileKey;

            let newImagePublication =
              await publicationImagesService.updateImage(
                publicationId,
                bucketURL,
                spot
              );
            imagesKeys.push(bucketURL);
            console.log(newImagePublication);
          } catch (error) {
            imagesErrors.push(error.message);
          }
        })
      );

      return res.status(200).json({
        results: {
          message: `Count of uploaded images: ${imagesKeys.length} `,
          imagesUploaded: imagesKeys,
          imageErrors: imagesErrors,
        },
      });
    }else{
      return res.status(403).json({message: 'not authorized to make this request', errorName: 'Bad Request'})
    }
  } catch (error) {
    return next(error);
  }
};

const removeImage = async (req, res, next) => {
  const publicationId = req.params.id;
  const order = req.params.order;
  const userLogin = req.user.id;
  try {
    const publication = await publicationServices.getPublication(publicationId);
    const admin = await profileServices.findProfileByUserID(userLogin);
    if (publication.user_id == userLogin || admin.role_id == 2) {
      let { image_url } = await publicationImagesService.getImageOr404(
        publicationId,
        order
      );
      let awsDomain = process.env.AWS_DOMAIN;
      const imageKey = image_url.replace(awsDomain, '');
      await deleteFile(imageKey);

      let publicationImage = await publicationImagesService.removeImage(
        publicationId,
        order
      );

      return res
        .status(200)
        .json({ message: 'Removed', image: publicationImage });
    }else{
      return res.status(403).json({message: 'not authorized to make this request', errorName: 'Bad Request'})
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadImage,
  removeImage,
};

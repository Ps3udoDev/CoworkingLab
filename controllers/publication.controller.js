const ProfilesService = require('../services/profiles.service');
const PublicationImagesService = require('../services/publications-images.service');
const PublicationsServices = require('../services/publications.service');
const { CustomError } = require('../utils/helpers');

const publicarionServices = new PublicationsServices();
const publicationImageServices = new PublicationImagesService();
const profileServices = new ProfilesService();

const getAllPublications = async (req, res, next) => {
  try {
    const {
      limit,
      offset,
      tags,
      id,
      publication_type_id,
      title,
      description,
      content,
      reference_link,
    } = req.query;
    let user = req.user
    if (!user) {
      const publications = await publicarionServices.findAndCount({
        limit,
        offset,
        tags,
        id,
        publication_type_id,
        title,
        description,
        content,
        reference_link,
      }, null);
      const { count, currentPage, totalPages, results } = publications;
      return res
        .status(200)
        .json({ results: { count, totalPages, currentPage, results } });
    }
    const publications = await publicarionServices.findAndCount({
      limit,
      offset,
      tags,
      id,
      publication_type_id,
      title,
      description,
      content,
      reference_link,
    }, user.id);
    const { count, currentPage, totalPages, results } = publications;
    return res
      .status(200)
      .json({ results: { count, totalPages, currentPage, results } });
  } catch (error) {
    next(error);
  }
};

const postPublication = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const {
      publication_type_id,
      city_id = 1,
      title,
      description,
      content,
      reference_link,
      tags,
    } = req.body;
    if (
      publication_type_id &&
      title &&
      description &&
      content &&
      reference_link &&
      tags
    ) {
      const newPublication = await publicarionServices.createPublication(
        {
          user_id,
          publication_type_id,
          city_id,
          title,
          description,
          content,
          reference_link,
        },
        tags
      );
      return res.status(201).json({ results: newPublication });
    } else {
      throw new CustomError('Missing Data', 404, 'Not Found');
    }
  } catch (error) {
    next(error);
  }
};

const getPublicationById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let user = req.user
    try {
      if (!user) {
        const publication = await publicarionServices.getPublication(id, null);
        return res.status(200).json({ results: publication });
      }
      const publication = await publicarionServices.getPublication(id, user.id);
      return res.status(200).json({ results: publication });
    } catch (error) {
      throw new CustomError('Not found Publication', 404, 'Not Found');
    }
  } catch (error) {
    next(error);
  }
};

const postVotePublication = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const publicationId = req.params.id;
    const publicationVote = await publicarionServices.toggleVote(
      publicationId,
      userId
    );
    const { status } = publicationVote;
    let message = status == 200 ? 'Voto removido' : 'Voto añadido';
    return res.status(status).json({ message });
  } catch (error) {
    next(error);
  }
};

const deletePublication = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const admin = await profileServices.findProfileByUserID(userId);
    try {
      let publication = await publicarionServices.getPublication(id);
      let publicationImages = await publicationImageServices.getAllImages(id);

      if (publicationImages.length > 0) {
        res.status(404).json({
          message:
            'There are images stored for this post in the cloud please delete them first',
          errorName: 'Bad Request',
        });
      } else {
        if (publication.user_id === userId || admin.role_id === 2) {
          publication = await publicarionServices.removePublication(id);
          res.status(200).json({ results: publication });
        } else {
          return res
            .status(403)
            .json({ message: 'Esta publication no te pertenece' });
        }
      }
    } catch (error) {
      throw new CustomError('Not found Publication', 404, 'Not Found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPublications,
  postPublication,
  getPublicationById,
  deletePublication,
  postVotePublication,
};

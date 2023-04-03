const { v4: uuid4 } = require('uuid');
const models = require('../database/models')
const { Op, cast, literal } = require('sequelize')
const { CustomError } = require('../utils/helpers');
const { raw } = require('express');

class PublicationsServices {
  constructor() {
  }

  async findAndCount(query) {
    const options = {
      where: {},
      attributes: {
        include: [
          [cast(literal(
            `(SELECT COUNT(*) FROM "votes" 
              WHERE "votes"."publication_id" = "Publications"."id")`
          ), 'integer'), 'votes_count'],
        ]
      },
      include: []
    }

    const { size, page } = query
    if (size && page) {
      options.size = size
      options.page = page
    }

    const { id } = query
    if (id) {
      options.where.id = id
    }
    const { publication_type_id, title, description, content, reference_link } = query
    if (publication_type_id) options.where.publication_type_id = { [Op.eq]: publication_type_id }
    if (title) options.where.title = { [Op.iLike]: `%${title}%` }
    if (description) options.where.description = { [Op.iLike]: `%${description}%` }
    if (content) options.where.content = { [Op.content]: `%${content}%` }
    if (reference_link) options.where.reference_link = { [Op.reference_link]: `%${reference_link}%` }

    options.distinct = true

    const publications = await models.Publications.scope('votes_count').findAndCountAll(options)
    const totalPages = size === 0 ? 1 : Math.ceil(publications.count / (size ? size : publications.count));
    const startIndex = ((page ? page : 1) - 1) * (size ? size : publications.count);
    const endIndex = startIndex + Number(size ? size : publications.count);

    const results = page > totalPages ? [] : publications.rows.slice(startIndex, endIndex)
    return {
      count: publications.count,
      totalPages,
      currentPage: page ? page : 1,
      results
    };
  }

  async createPublication(obj, tags) {
    const transaction = await models.sequelize.transaction()
    try {
      obj.id = uuid4()
      let newPublication = await models.Publications.create(obj, { transaction, fields: ['id', 'user_id', 'publication_type_id', 'city_id', 'title', 'description', 'content', 'reference_link'] })
      await models.Votes.create({ publication_id: newPublication.id, user_id: newPublication.user_id }, { transaction })
      if (tags) {
        let tagsIds = tags.split(',')
        let findedTags = await models.Tags.findAll({
          where: { id: tagsIds },
          attributes: ['id'],
          raw: true,
        })
        if (findedTags.length > 0) {
          let tags_ids = findedTags.map(tag => tag['id'])
          await newPublication.setTags(tags_ids, { transaction })
        }
      }
      await transaction.commit()
      return newPublication
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async getPublicationOr404(id) {
    let publication = await models.Publications.scope('view_public').findByPk(id, { raw: true })
    if (!publication) throw new CustomError('Not found Publication', 404, 'Not Found')
    return publication
  }

  async getPublication(id) {
    let publication = await models.Publications.findByPk(id, {
      attributes: {
        include: [
          [cast(literal(
            `(SELECT COUNT(*) FROM "votes" 
            WHERE "votes"."publication_id" = "Publications"."id")`
          ), 'integer'), 'votes_count'],
        ],

      },
      include: [
        {
          model: models.PublicationsImages,
          as: 'images'
        },
        {
          model: models.Users,
          as: 'user',
          attributes: ['first_name', 'last_name', 'image_url']
        },
        {
          model: models.PublicationTypes,
          as: 'publication_type'
        },
        {
          model: models.Tags,
          as: 'tags',
          through: {
            attributes: []
          }
        }
      ]
    })
    if (!publication) throw new CustomError('Not found Publication', 404, 'Not Found')
    return publication
  }

  async removePublication(id, user_id) {
    const transaction = await models.sequelize.transaction()
    try {
      let publication = await models.Publications.findByPk(id)
      if (!publication) throw new CustomError('Not found publication', 404, 'Not Found')
      if (publication.user_id === user_id) {
        await publication.destroy({ transaction })
      } else {
        throw new CustomError('Esta publication no te pertenece', 400, 'Bad Request')
      }
      await transaction.commit()
      return publication
    } catch (error) {
      console.log(error)
      await transaction.rollback()
      throw error
    }
  }

  async addVote(publicationId, userId) {
    const transaction = await models.sequelize.transaction()
    try {
      const publication = await this.getPublicationOr404(publicationId)
      const vote = await models.Votes.findOne({ where: { publication_id: publicationId, user_id: userId } })
      if (vote) {
        throw new CustomError('User has already voted for this publication', 400, 'Bad Request')
      }
      await models.Votes.create({ publication_id: publicationId, user_id: userId })
      publication.votes_count += 1
      await transaction.commit()
      return publication
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async removeVote(publicationId, userId) {
    const transaction = await models.sequelize.transaction()
    try {
      const publication = await this.getPublicationOr404(publicationId)
      const vote = await models.Votes.findOne({ where: { publication_id: publicationId, user_id: userId } })
      if (!vote) {
        throw new CustomError('User has not voted for this publication', 400, 'Bad Request')
      }
      await vote.destroy()
      publication.votes_count -= 1
      await transaction.commit()
      return publication
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}

module.exports = PublicationsServices
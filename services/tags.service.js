const models = require('../database/models')
const { Op } = require('sequelize')
const { CustomError } = require('../utils/helpers')

class TagsServices {

  constructor() {
  }

  async findAndCount(query) {
    const options = {
      where: {},
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

    const { name, desciption } = query
    if (name) options.where.name = { [Op.iLike]: `%${name}%` }
    if (desciption) options.where.desciption = { [Op.iLike]: `%${desciption}%` }

    //Necesario para el findAndCountAll de Sequelize
    options.distinct = true

    const tags = await models.Tags.findAndCountAll(options)
    const totalPages = size === 0 ? 1 : Math.ceil(tags.count / (size ? size : tags.count));
    const startIndex = ((page ? page : 1) - 1) * (size ? size : tags.count);
    const endIndex = startIndex + Number(size ? size : tags.count);

    const results = page > totalPages ? [] : tags.rows.slice(startIndex, endIndex)
    return {
      count: tags.count,
      totalPages,
      currentPage: page ? page : 1,
      results
    };
  }

  async createTag(obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let newTag = await models.Tags.create({
        name: obj.name,
        description: obj.description,
        image_url: obj.image_url,
      }, { transaction })

      await transaction.commit()
      return newTag
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
  //Return Instance if we do not converted to json (or raw:true)
  async getTagOr404(id) {
    let tag = await models.Tags.findByPk(id, { raw: true })
    if (!tag) throw new CustomError('Not found Tag', 404, 'Not Found')
    return tag
  }

  //Return not an Instance raw:true | we also can converted to Json instead
  async getTag(id) {
    let tag = await models.Tags.findByPk(id)
    if (!tag) throw new CustomError('Not found Tag', 404, 'Not Found')
    return tag
  }

  async updateTag(id, obj) {
    const transaction = await models.sequelize.transaction()
    try {
      let tag = await models.Tags.findByPk(id)

      if (!tag) throw new CustomError('Not found Tag', 404, 'Not Found')

      let updateTag = await tag.update(obj, { transaction })

      await transaction.commit()

      return updateTag
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async removeTag(id) {
    const transaction = await models.sequelize.transaction()
    try {
      let tag = await models.Tags.findByPk(id)

      if (!tag) throw new CustomError('Not found Tag', 404, 'Not Found')
      if (tag.image_url) throw new CustomError('Image Tag is on Cloud, must be deleted first', 400, 'Bad Request')
      
      await tag.destroy({ transaction })

      await transaction.commit()

      return tag
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async uploadImage(image_url, tag_id) {
    const transaction = await models.sequelize.transaction();
    try {
      let tag = await models.Tags.findByPk(tag_id);
      if (tag){
        let updateImage = await tag.update({ image_url }, { transaction });
        await transaction.commit();
        return updateImage;
      }else{
        throw new CustomError('Not found tag', 404, 'Not Found');
      } 
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getImageOr404(user_id) {
    const tagImage = await models.Tags.findByPk(user_id);
    if (!tagImage.image_url)
      throw new CustomError(
        'The tag does not have an associated image',
        404,
        'Bad request'
      );
    return tagImage;
  }

}

module.exports = TagsServices

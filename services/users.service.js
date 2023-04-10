const { v4: uuid4 } = require('uuid');
const models = require('../database/models');
const { Op } = require('sequelize');
const { CustomError } = require('../utils/helpers');
const { hashPassword } = require('../libs/bcrypt');

class UsersService {
  constructor() {}

  async findAndCount(query) {
    const options = {
      where: {},
      include: [],
    };

    const { size, page } = query;

    if (size && page) {
      options.size = size;
      options.page = page;
    }

    const { id } = query;
    if (id) {
      options.where.id = id;
    }

    const {
      first_name,
      last_name,
      email,
      username,
      email_verified,
      country_id,
      code_phone,
      phone,
      created_at,
    } = query;

    const elapsedTime = Date.now();
    const today = new Date(elapsedTime);
    if (first_name)
      options.where.first_name = { [Op.iLike]: `%${first_name}%` };
    if (last_name) options.where.last_name = { [Op.iLike]: `%${last_name}%` };
    if (email) options.where.email = { [Op.iLike]: `%${email}%` };
    if (username) options.where.username = { [Op.iLike]: `%${username}%` };
    if (email_verified)
      options.where.email_verified = {
        [Op.between]: [
          new Date(email_verified),
          today.toISOString().slice(0, 10),
        ],
      };
    if (country_id) options.where.country_id = { [Op.eq]: country_id };
    if (code_phone)
      options.where.code_phone = { [Op.iLike]: `%${code_phone}%` };
    if (phone) options.where.phone = { [Op.iLike]: `%${phone}%` };
    if (created_at)
      options.where.created_at = {
        [Op.between]: [new Date(created_at), today.toISOString().slice(0, 10)],
      };

    //Necesario para el findAndCountAll de Sequelize
    options.distinct = true;

    const users = await models.Users.scope('asociate_tags').findAndCountAll(
      options
    );

    const totalPages =
      size === 0 ? 1 : Math.ceil(users.count / (size ? size : users.count));
    const startIndex = ((page ? page : 1) - 1) * (size ? size : users.count);
    const endIndex = startIndex + Number(size ? size : users.count);

    const results =
      page > totalPages ? [] : users.rows.slice(startIndex, endIndex);

    return {
      count: users.count,
      totalPages,
      currentPage: page ? page : 1,
      results,
    };
  }

  async createAuthUser(obj) {
    const transaction = await models.sequelize.transaction();
    try {
      obj.id = uuid4();
      obj.password = hashPassword(obj.password);
      let newUser = await models.Users.create(obj, {
        transaction,
        fields: [
          'id',
          'first_name',
          'last_name',
          'password',
          'email',
          'username',
        ],
      });

      let publicRole = await models.Roles.findOne(
        { where: { name: 'public' } },
        { raw: true }
      );

      let newUserProfile = await models.Profiles.create(
        { user_id: newUser.id, role_id: publicRole.id },
        { transaction }
      );

      await transaction.commit();
      return newUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getAuthUserOr404(id) {
    let user = await models.Users.scope('asociate_tags').findByPk(id, {
      raw: true,
      include: [],
    });
    if (!user) throw new CustomError('Not found User', 404, 'Not Found');
    return user;
  }

  async getUser(id) {
    let user = await models.Users.scope('asociate_tags').findByPk(id, {
      include: [],
    });
    if (!user) throw new CustomError('Not found User', 404, 'Not Found');
    return user;
  }

  async getUserByIdBasedOnScope(id, scope) {
    let user = await models.Users.scope(scope).findByPk(id, {
      include: [
        {
          model: models.Tags,
          as: 'interests',
          through: {
            attributes: [],
          },
        },
      ],
    });
    if (!user) throw new CustomError('Not found User', 404, 'Not Found');
    return user;
  }

  async findUserByEmailOr404(email) {
    if (!email) throw new CustomError('Email not given', 400, 'Bad Request');
    let user = await models.Users.findOne({ where: { email } }, { raw: true });
    if (!user) throw new CustomError('Not found User', 404, 'Not Found');
    return user;
  }

  async updateUser(id, obj) {
    const transaction = await models.sequelize.transaction();
    try {
      let user = await models.Users.findByPk(id, {
        include: [
          {
            model: models.Tags,
            as: 'interests',
          },
        ],
      });
      if (!user) throw new CustomError('Not found user', 404, 'Not Found');
      const { first_name, last_name, code_phone, phone, interests } = obj;
      let updatedUser = await user.update(
        { first_name, last_name, code_phone, phone, interests },
        { transaction }
      );
      if (interests) {
        let tagsIds = obj.interests.split(',');
        let findedTags = await models.Tags.findAll({
          where: { id: tagsIds },
          attributes: ['id'],
          raw: true,
        });
        if (findedTags.length > 0) {
          let tags_ids = findedTags.map((tag) => tag['id']);
          await updatedUser.setInterests(tags_ids, { transaction });
        }
      }
      await transaction.commit();
      return updatedUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async removeUser(id) {
    const transaction = await models.sequelize.transaction();
    try {
      let user = await models.Users.findByPk(id);
      if (!user) throw new CustomError('Not found user', 404, 'Not Found');
      if (user.image_url)
        throw new CustomError(
          'Image Tag is on Cloud, must be deleted first',
          400,
          'Bad Request'
        );
      await user.destroy({ transaction });
      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async setTokenUser(id, token) {
    const transaction = await models.sequelize.transaction();
    try {
      let user = await models.Users.findByPk(id);
      if (!user) throw new CustomError('Not found user', 404, 'Not Found');
      let updatedUser = await user.update({ token }, { transaction });
      await transaction.commit();
      return updatedUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async removeTokenUser(id) {
    const transaction = await models.sequelize.transaction();
    try {
      let user = await models.Users.findByPk(id);
      if (!user) throw new CustomError('Not found user', 404, 'Not Found');
      await user.update({ token: null }, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async verifiedTokenUser(id, token, exp) {
    const transaction = await models.sequelize.transaction();
    try {
      if (!id) throw new CustomError('Not ID provided', 400, 'Bad Request');
      if (!token)
        throw new CustomError('Not token provided', 400, 'Bad Request');
      if (!exp) throw new CustomError('Not exp exist', 400, 'Bad Request');

      let user = await models.Users.findOne({
        where: {
          id,
          token,
        },
      });
      if (!user)
        throw new CustomError(
          'The user associated with the token was not found',
          400,
          'Invalid Token'
        );
      if (Date.now() > exp * 1000)
        throw new CustomError(
          'The token has expired, the 15min limit has been exceeded',
          401,
          'Unauthorized'
        );
      await user.update({ token: null }, { transaction });
      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updatePassword(id, newPassword) {
    const transaction = await models.sequelize.transaction();
    try {
      if (!id) throw new CustomError('Not ID provided', 400, 'Bad Request');
      let user = await models.Users.findByPk(id);
      if (!user) throw new CustomError('Not found user', 404, 'Not Found');
      let restoreUser = await user.update(
        { password: hashPassword(newPassword) },
        { transaction }
      );
      await transaction.commit();
      return restoreUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async uploadImage(image_url, user_id) {
    const transaction = await models.sequelize.transaction();
    try {
      let user = await models.Users.findByPk(user_id);
      if (user){
        let updateImage = await user.update({ image_url }, { transaction });
        await transaction.commit();
        return updateImage;
      }else{
        throw new CustomError('Not found user', 404, 'Not Found');
      } 
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getImageOr404(user_id) {
    const userImage = await models.Users.findByPk(user_id);
    if (!userImage.image_url)
      throw new CustomError(
        'The user does not have an associated image',
        404,
        'Bad request'
      );
    return userImage;
  }

  async removeImage(user_id) {
    const transaction = await models.sequelize.transaction();
    try {
      let user = await models.Users.findByPk(user_id);
      if (!user) throw new CustomError('Not found user', 404, 'Not Found');
      let removeImage = await user.update({ image_url: null }, { transaction });
      await transaction.commit();
      return removeImage;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

module.exports = UsersService;

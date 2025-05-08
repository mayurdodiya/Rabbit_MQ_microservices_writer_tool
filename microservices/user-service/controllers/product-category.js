const responseLib = require("wt-lib").resp;
const moment = require("moment");
const { ObjectId } = require("wt-server").mongoose.Types;

const {
  UserModel,
  OtpModel,
  RoleModel,
  BlogModel,
  ProductCategory,
} = require("wt-schemas");
const { log } = require("wt-lib/logger.lib");
const { message } = require("wt-utils");
const { generateToken, comparePassword } = require("wt-utils/bcryptTokens");
const {
  sendOTP,
  sendWelcomeMail,
  changePasswordInformedMail,
  sendForgotPassMail,
} = require("../utils/mail/mail.service");

module.exports = {
  createCate: async (req, res) => {
    try {
      if (
        await ProductCategory.findOne({
          title: req.body.title,
          isDeleted: false,
        })
      )
        return responseLib.BAD_REQUEST({
          res,  
          message: message.CATEGORY_ALREADY_EXISTS,
        });

      await ProductCategory.create(req.body);

      return responseLib.OK({ res, message: message.SUCCESS });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({
        res,
        message: message.GENERAL_ERROR,
        payload: error,
      });
    }
  },

  getCate: async (req, res) => {
    try {
      const { id, search, isActive } = req.query;

      req.query.sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
      req.query.sortOrder = req.query.sortOrder ? req.query.sortOrder : -1;
      req.query.page = req.query.page ? req.query.page : 1;
      req.query.page = req.query.page ? req.query.page : 1;
      let page = parseInt(req.query.page);
      req.query.limit = req.query.limit ? req.query.limit : 10;
      let limit = parseInt(req.query.limit);
      let skip = (parseInt(page) - 1) * limit;

      let criteria = {};
      if (search)
        criteria = {
          title: { $regex: req.query.search, $options: "i" },
        };
      if (isActive != undefined) criteria = { isActive: isActive, ...criteria };

      let findCate = {};
      let count = 1;
      if (id) {
        findCate = await ProductCategory.findOne({
          _id: id,
        });
      } else {
        findCate = await ProductCategory.aggregate([
          {
            $match: criteria,
          },
          {
            $sort: {
              createdAt: -1,
            },
          },
          {
            $skip: skip,
          },
          {
            $limit: limit,
          },
        ]);
        count = await ProductCategory.countDocuments(criteria);
      }
      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: {
          product_category: findCate,
          counts: count,
        },
      });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({
        res,
        message: message.GENERAL_ERROR,
        payload: error,
      });
    }
  },

  updateCate: async (req, res) => {
    try {
      const findBlogCate = await ProductCategory.findOne({
        _id: new ObjectId(req.params.id),
        isDeleted: false,
      });

      if (!findBlogCate)
        return responseLib.BAD_REQUEST({
          res,
          message: message.NOT_FOUND,
        });
      let body = {};
      if (req.body.title) body.title = req.body.title;
      if (req.body.description) body.description = req.body.description;
      if (req.body.isActive != undefined) body.isActive = req.body.isActive;

      await ProductCategory.updateOne(
        { _id: findBlogCate._id },
        { $set: body },
        { new: true }
      );

      return responseLib.OK({ res, message: message.updated });
    } catch (error) {      
      return responseLib.CATCH_ERROR({
        res,
        message: message.GENERAL_ERROR,
        payload: error,
      });
    }
  },
};

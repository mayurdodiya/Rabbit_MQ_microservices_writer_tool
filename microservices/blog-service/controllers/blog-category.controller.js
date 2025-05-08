const responseLib = require("wt-lib").resp;
const moment = require("moment");
const { ObjectId } = require("wt-server").mongoose.Types;
const {
  UserModel,
  OtpModel,
  RoleModel,
  BlogCategory,
  BlogModel,
  ProductCategory,
} = require("wt-schemas");
const { log } = require("wt-lib/logger.lib");
const { message } = require("wt-utils");
const { generateSlugId } = require("wt-utils/other-services");
const {
  enums: { BLOG_STATUS },
} = require("wt-config");

module.exports = {
  createCate: async (req, res) => {
    try {
      //Check slugId
      const slug = req.body.slugId ? req.body?.slugId : req.body?.title;
      const createSlug = await generateSlugId(slug);
      if (
        await BlogCategory.findOne({
          $or: [
            { title: req.body.title, isDeleted: false },
            { slugId: createSlug, isDeleted: false },
          ],
        })
      )
        return responseLib.BAD_REQUEST({
          res,
          message: message.CATEGORY_ALREADY_EXISTS,
        });
      req.body.slugId = createSlug;
      await BlogCategory.create(req.body);

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
      const {
        id,
        slugId,
        search,
        status,
        isActive,
        sortBy,
        sortOrder,
        page,
        limit,
      } = req.query;

      let skip = (parseInt(page) - 1) * limit;

      let criteria = {};
      if (search)
        criteria = {
          title: { $regex: req.query.search, $options: "i" },
        };

      if (isActive != undefined) criteria = { isActive, ...criteria };
      if (id) criteria = { _id: id, ...criteria };
      if (slugId) criteria = { slugId, ...criteria };
      if (status) criteria = { status, ...criteria };

      let findCate = {};
      let count = 1;
      if (id) {
        findCate = await BlogCategory.findOne({
          _id: id,
        });
      } else {
        findCate = await BlogCategory.aggregate([
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
        count = await BlogCategory.countDocuments(criteria);
      }
      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: {
          blog_category: findCate,
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
      const findBlogCate = await BlogCategory.findOne({
        _id: new ObjectId(req.params.id),
        isDeleted: false,
      });

      if (!findBlogCate)
        return responseLib.BAD_REQUEST({
          res,
          message: message.NOT_FOUND,
        });

      let body = {};
      if (req.body.title) {
        const slug = await generateSlugId(req.body.title);

        // Check if slugId already exists
        const slugExist = await BlogCategory.findOne({
          slugId: slug,
          _id: { $ne: findBlogCate._id },
          // status: { $ne: BLOG_STATUS.DRAFT },
        });

        if (slugExist) {
          return responseLib.BAD_REQUEST({
            res,
            message: message.BLOG_CATEGORY_ALREADY_EXISTS,
          });
        }

        body.slugId = slug;
        body.title = req.body.title;
      }

      if (req.body.description) body.description = req.body.description;
      if (req.body.isActive != undefined) body.isActive = req.body.isActive;

      await BlogCategory.updateOne(
        { _id: findBlogCate._id },
        { $set: body },
        { new: true }
      );

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
};

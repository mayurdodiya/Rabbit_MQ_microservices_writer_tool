const { isDeepStrictEqual } = require("util");
const { ToneModel } = require("wt-schemas");
const { message } = require("wt-utils");
const responseLib = require("wt-lib").resp;
const { generateSlugId } = require("wt-utils/other-services");
const { ObjectId } = require("wt-server").mongoose.Types;
const { log } = require("wt-lib/logger.lib");

module.exports = {
  /**
   * Create a new Tone.
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @property {string} tone - Tone of the blog
   * @property {string} description - Description of the blog
   * @returns {Object} - Tone document
   */
  createTone: async (req, res) => {
    try {
      const { tone, description } = req.body;
      const toneExist = await ToneModel.findOne({ tone });
      if (toneExist) {
        return responseLib.BAD_REQUEST({
          res,
          message: message.TONE_ALREADY_EXISTS,
        });
      }

      const slug = await generateSlugId(tone);
      req.body["slug"] = slug;

      const result = await ToneModel.create({ tone, description, slug });
    

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: result,
      });
    } catch (error) {
      log.error("Error creating tone:->", error);
      return responseLib.CATCH_ERROR({
        res,
        message: message.INTERNAL_SERVER_ERROR,
        payload: error,
      });
    }
  },
  
  /**
   * API to get all tones
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @property {number} page - Page number
   * @property {number} limit - Number of results per page
   * @property {string} search - Search query
   * @property {boolean} isActive - Whether to fetch active tones
   * @property {boolean} isDeleted - Whether to fetch deleted tones
   * @returns {Object} - Response object with tones and count
   */
  getAllTones: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      let skip = (parseInt(page) - 1) * limit;

      const { search, isActive, isDeleted } = req.query;
      let criteria = {};

      if (search) {
        criteria = {
          ...criteria,
          tone: { $regex: req.query.search, $options: "i" },
        };
      }

      if (isActive) criteria = { isActive: true, ...criteria };
      if (isDeleted !== undefined) criteria = { isDeleted: true, ...criteria };

      const pipeline = [
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
      ];

      const result = await ToneModel.aggregate(pipeline);

      const count = await ToneModel.countDocuments(criteria);

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: {
          tones: result,
          count,
        },
      });
    } catch (error) {
      log.error("Error fetching tones:->", error);
      return responseLib.CATCH_ERROR({
        res,
        message: message.INTERNAL_SERVER_ERROR,
        payload: error,
      });
    }
  },

  /**
   * API to update Tone
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @property {string} tone - Tone of the blog
   * @property {string} description - Description of the blog
   * @property {string} id - ObjectId of tone document
   * @returns {Object} - Tone document
   */
  updateTone: async (req, res) => {
    try {
      const { tone, description } = req.body;

      const toneExist = await ToneModel.findOne({
        tone: req.body.tone,
        isDeleted: false,
      });

      if (toneExist) {
        return responseLib.BAD_REQUEST({
          res,
          message: message.TONE_ALREADY_EXISTS,
        });
      }

      const slug = await generateSlugId(tone);

      const slugExist = await ToneModel.findOne({
        slug,
        isDeleted: false,
      });

      if (slugExist) {
        return responseLib.BAD_REQUEST({
          res,
          message: message.TONE_ALREADY_EXISTS,
        });
      }

      const result = await ToneModel.findByIdAndUpdate(
        { _id: new ObjectId(req.query.id) },
        { tone, description, slug },
        { new: true }
      );

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: result,
      });
    } catch (error) {
      log.error("Error updating tone:->", error);
      return responseLib.CATCH_ERROR({
        res,
        message: message.INTERNAL_SERVER_ERROR,
        payload: error,
      });
    }
  },

    //changeToneStatus
    changeToneStatus: async (req, res) => {
      try {
        await ToneModel.updateOne(
          { _id: new ObjectId(req.params.id), isDeleted: false },
          {
            $set: {
              isActive: req.body?.isActive,
            },
          },
          {
            new: true,
          }
        );
  
        return responseLib.OK({
          res,
          message: message.SUCCESS,
        });
      } catch (error) {
        log.error(error);
        return responseLib.CATCH_ERROR({
          res,
          error,
        });
      }
    },
};

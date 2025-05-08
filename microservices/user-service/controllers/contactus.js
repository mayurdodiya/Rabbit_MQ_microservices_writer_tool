const responseLib = require("wt-lib").resp;

const { ContactusModel } = require("wt-schemas");
const { log } = require("wt-lib/logger.lib");
const { message } = require("wt-utils");

module.exports = {
  addContact: async (req, res) => {
    try {
      //   if (
      //     await ContactusModel.findOne({
      //       $or: [{ email: req.body.email }, { mobileNo: req.body.mobileNo }],
      //     })
      //   )
      //     return responseLib.BAD_REQUEST({
      //       res,
      //       message: "Email or Mobile Number already exists",
      //     });

      await ContactusModel.create(req.body);

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

  getContacts: async (req, res) => {
    try {
      let { limit = 10, page = 1, skip = 0 } = req.query;
      limit = parseInt(limit);
      page = parseInt(page);
      skip = (parseInt(page) - 1) * limit;
      let query = {};
      if (req.query.search) {
        query = {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
            { mobileNo: { $regex: req.query.search, $options: "i" } },
          ],
        };
      }
      const contacts = await ContactusModel.find(query).limit(limit).skip(skip);
      return responseLib.OK({ res, payload: contacts });
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

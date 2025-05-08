const responseLib = require("wt-lib").resp;
const { ObjectId } = require("wt-server").mongoose.Types;
const {
  UserModel,
  BlogModel,
  BlogCategory,
  NewsLetterModel,
  PrivacyPolicyModel,
  BlogNotificationModel,
  PaymentModel,
  RoleModel,
} = require("wt-schemas");
const { log } = require("wt-lib/logger.lib");
const { message } = require("wt-utils");
const {
  enums: { BLOG_STATUS, RMQ_ROUTING_KEYS, RMQ_QUEUS, ROLE },
} = require("wt-config");
const { broker } = require("wt-lib");

module.exports = {
  //dashboard
  dashboard: async (req, res) => {
    try {
      let { userStartDate, userEndDate, revenueStartDate, revenueEndDate } =
        req.query; //for filter data
      const emailExist = await UserModel.findOne({
        email: req.user.email,
        isActive: true,
      }).populate("roleId"); // Get user by email.
      if (!emailExist) {
        return responseLib.NOT_FOUND({
          res,
          message: message.USER_EMAIL_NOT_REGISTERED,
          payload: {},
        }); // If email doesn't exist, throw an error.
      }
      //criteria for start and end date if it is provided by query or not
      userStartDate = userStartDate
        ? new Date(req.query.userStartDate).setHours(0o0, 0o0, 0o0)
        : null;
      userEndDate = userEndDate
        ? new Date(req.query.userEndDate).setHours(23, 59, 59)
        : null;

      revenueStartDate = req.query.revenueStartDate
        ? new Date(req.query.revenueStartDate).setHours(0o0, 0o0, 0o0)
        : null;
      revenueEndDate = req.query.revenueEndDate
        ? new Date(req.query.revenueEndDate).setHours(23, 59, 59)
        : null;

      // Start of the current month (e.g., January 1, 2025, 00:00:00)
      let startOfMonth = new Date(new Date().setDate(1));
      startOfMonth.setHours(0, 0, 0, 0);

      // End of the current month (e.g., January 31, 2025, 23:59:59)
      let endOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      );
      endOfMonth.setHours(23, 59, 59, 999);

      //query for revenue
      let query4Revenue =
        revenueStartDate && revenueEndDate
          ? [
              {
                $match: {
                  createdAt: {
                    $gte: new Date(revenueStartDate),
                    $lt: new Date(revenueEndDate),
                  },
                },
              },
              {
                $group: {
                  _id: null,
                  totalAmount: { $sum: "$amount" },
                },
              },
            ]
          : [
              {
                $group: {
                  _id: null,
                  totalAmount: { $sum: "$amount" },
                },
              },
            ];

      //Find role id of user
      const roleIdOfUser = await RoleModel.findOne({
        role: "User",
      });
      let resData = [
        //Total number of users[totalNumberOfUsers]
        UserModel.countDocuments({
          ...(userStartDate &&
            userEndDate && {
              createdAt: { $gte: userStartDate, $lt: userEndDate },
            }),

          roleId: roleIdOfUser?._id,
        }),

        //Total number of active users[numberOfActiveUsers]
        UserModel.countDocuments({
          isActive: true,
          roleId: roleIdOfUser?._id,
          ...(userStartDate &&
            userEndDate && {
              createdAt: { $gte: userStartDate, $lt: userEndDate },
            }),
        }),

        //Today's total number of new non social users [totalTodayNonSocialUsers]
        UserModel.countDocuments({
          isSocial: false,
          roleId: roleIdOfUser?._id,
          createdAt: {
            $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
            $lt: new Date(new Date().setHours(23, 59, 59)),
          },
        }),

        //Total number of blogs[numberOfBlogs]
        BlogModel.countDocuments({}),

        //Total number of pending blogs[numberOfPendingBlogs]
        BlogModel.countDocuments({
          status: "Pending",
          createdBy: ROLE.USER,
        }),

        //Total number of approved blogs[numberOfApprovedBlogs]
        BlogModel.countDocuments({
          status: "Approved",
          createdBy: ROLE.USER,
        }),

        //Total number of rejected blogs[numberOfRejectedBlogs]
        BlogModel.countDocuments({
          status: "Rejected",
          createdBy: ROLE.USER,
        }),

        //Total number of users who have login with social media[numberOfSocialUsers]
        UserModel.countDocuments({
          isSocial: true,
          roleId: roleIdOfUser?._id,
          ...(userStartDate &&
            userEndDate && {
              createdAt: { $gte: userStartDate, $lt: userEndDate },
            }),
        }),

        // Today's Revenue[todayRevenue]
        PaymentModel.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
                $lt: new Date(new Date().setHours(23, 59, 59)),
              },
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
            },
          },
        ]),

        //Total Revenue for this month[thisMonthRevenue]
        PaymentModel.aggregate([
          {
            $match: {
              createdAt: {
                $gte: startOfMonth,
                $lt: endOfMonth,
              },
            },
          },
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
            },
          },
        ]),

        // Total Revenue[totalRevenue]
        PaymentModel.aggregate([query4Revenue]),

        //Total today's users[totalTodayUsers]
        UserModel.countDocuments({
          createdAt: {
            $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
            $lt: new Date(new Date().setHours(23, 59, 59)),
          },
          roleId: roleIdOfUser?._id,
        }),

        //Total this month users[totalThisMonthUsers]
        UserModel.countDocuments({
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
          roleId: roleIdOfUser?._id,
        }),

        //ToDay's social users[totalTodaySocialUsers]
        UserModel.countDocuments({
          createdAt: {
            $gte: new Date(new Date().setHours(0o0, 0o0, 0o0)),
            $lt: new Date(new Date().setHours(23, 59, 59)),
          },
          isSocial: true,
          roleId: roleIdOfUser?._id,
        }),

        //Total this month social users[totalThisMonthSocialUsers]
        UserModel.countDocuments({
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
          isSocial: true,
          roleId: roleIdOfUser?._id,
        }),

        //Total this month without social users[totalThisMonthNonSocialUsers]
        UserModel.countDocuments({
          createdAt: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
          isSocial: false,
          roleId: roleIdOfUser?._id,
        }),

        //Total number of blogs created by admin[numberOfBlogsCreatedByAdmin]
        BlogModel.countDocuments({
          createdBy: ROLE.ADMIN,
        }),

        //Total number of blogs created by user[numberOfBlogsCreatedByUser]
        BlogModel.countDocuments({
          createdBy: ROLE.USER,
        }),
      ];

      Promise.all(resData)
        .then((values) => {
          // values will be an array containing the resolved values from each promise
          const totalNumberOfUsers = values[0] || 0;
          const numberOfActiveUsers = values[1] || 0;
          const totalTodayNonSocialUsers = values[2] || 0;
          const numberOfBlogs = values[3] || 0;
          const numberOfPendingBlogs = values[4] || 0;
          const numberOfApprovedBlogs = values[5] || 0;
          const numberOfRejectedBlogs = values[6] || 0;
          const numberOfSocialUsers = values[7] || 0;
          const numberOfNonSocialUsers =
            totalNumberOfUsers - numberOfSocialUsers || 0;
          const todayRevenue = values[8][0]?.totalAmount || 0;
          const thisMonthRevenue = values[9][0]?.totalAmount || 0;
          const totalRevenue = values[10][0]?.totalAmount || 0;
          const totalTodayUsers = values[11] || 0;
          const totalThisMonthUsers = values[12] || 0;
          const totalTodaySocialUsers = values[13] || 0;
          const totalThisMonthSocialUsers = values[14] || 0;
          const totalThisMonthNonSocialUsers = values[15] || 0;
          const numberOfBlogsCreatedByAdmin = values[16] || 0;
          const numberOfBlogsCreatedByUser = values[17] || 0;
          resData = {
            totalNumberOfUsers,
            numberOfActiveUsers,
            numberOfSocialUsers,
            numberOfNonSocialUsers,
            totalTodayUsers,
            totalThisMonthUsers,
            totalTodaySocialUsers,
            totalThisMonthSocialUsers,
            totalThisMonthNonSocialUsers,
            totalTodayNonSocialUsers,
            numberOfBlogs,
            numberOfPendingBlogs,
            numberOfApprovedBlogs,
            numberOfRejectedBlogs,

            todayRevenue,
            thisMonthRevenue,
            totalRevenue,
            numberOfBlogsCreatedByAdmin,
            numberOfBlogsCreatedByUser,
          };
          return responseLib.OK({
            res,
            message: message.SUCCESS,
            payload: resData,
          });
        })
        .catch((error) => {
          // Handle any errors that might occur during promise resolution
          log.error(error);
          return responseLib.CATCH_ERROR({
            res,
            error,
          });
        });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({
        res,
        error,
      });
    }
  },

  //getAllUsers
  getAllUsers: async (req, res) => {
    try {
      let { search, isActive } = req.query;

      // Check if useer is logged in
      let emailExist = await UserModel.findOne({
        _id: new ObjectId(req.user._id),
        isActive: true,
      }).populate("roleId"); // Get user by email.

      req.query.sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
      req.query.sortOrder = req.query.sortOrder ? req.query.sortOrder : -1;
      req.query.page = req.query.page ? req.query.page : 1;
      req.query.limit = req.query.limit ? req.query.limit : 10;

      let page = parseInt(req.query.page);
      let limit = parseInt(req.query.limit);
      let skip = (parseInt(page) - 1) * limit;

      let criteria = {};

      if (search) {
        criteria = {
          ...criteria,
          $or: [
            {
              email: { $regex: search, $options: "i" },
            },
            {
              userName: { $regex: search, $options: "i" },
            },
          ],
        };
      }

      if (req.query.isActive != undefined) criteria = { isActive, ...criteria };

      if (emailExist.roleId.role != ROLE.ADMIN)
        criteria = { _id: new ObjectId(req.user._id) };

      const pipeline = [
        { $match: criteria }, // Filter based on criteria
        { $sort: { createdAt: -1 } }, // Sort by createdAt descending
        { $skip: skip }, // Skip documents
        { $limit: limit }, // Limit documents
        {
          $lookup: {
            from: "productcategories", // Replace 'ProductCategory' with actual collection name
            localField: "productCategory", // Field referencing the category ID
            foreignField: "_id", // Field in ProductCategory collection that holds the ID
            as: "productCategoryDetails", // Name for the populated field
          },
        },
        {
          $unwind: {
            path: "$productCategoryDetails",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "blogcategories", // Replace 'InterestCategory' with actual collection name
            localField: "interestedCategories", // Field referencing the category IDs (array)
            foreignField: "_id", // Field in InterestCategory collection that holds the ID
            as: "interestedCategoriesDetails", // Name for the populated field
          },
        },
        {
          $project: {
            createdAt: 1,
            userName: 1,
            email: 1,
            productName: 1,
            productCategoryDetails: 1,
            productURL: 1,
            isActive: 1,
            productCategoryName: "$productCategoryDetails.title", // Get name from first element
            interestedCategoriesNames: {
              $map: {
                input: "$interestedCategoriesDetails",
                as: "category",
                in: "$$category.title",
              },
            }, // Project only names from array
          },
        },
      ];
      const findUsers = await UserModel.aggregate(pipeline);

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: {
          user: findUsers,
          counts: await UserModel.countDocuments(criteria),
        },
      });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({
        res,
        error,
      });
    }
  },

  //updateUserStatus
  updateUserStatus: async (req, res) => {
    try {
      let emailExist = await UserModel.findOne({
        _id: new ObjectId(req.user.id),
        isActive: false,
      }).populate("roleId"); // Get user by email.

      if (emailExist && emailExist.roleId.role != "Admin")
        return responseLib.BAD_REQUEST({
          res,
          message: message.UNAUTHORIZED,
        });

      await UserModel.updateOne(
        { _id: new ObjectId(req.body.id) },
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

  //changeBlogStatus
  changeBlogStatus: async (req, res) => {
    try {
      //step 1  : find blog
      const findBlog = await BlogModel.findOne({
        _id: new ObjectId(req.params.id),
      }).lean();

      if (!findBlog) {
        return responseLib.NOT_FOUND({
          res,
          message: message.BLOG_NOT_FOUND,
        });
      }
      if (req.body?.isTrending && findBlog.status != BLOG_STATUS.APPROVED) {
        return responseLib.BAD_REQUEST({
          res,
          message: message.BLOG_STATUS_ERROR,
        });
      }

      const updatedBlog = await BlogModel.findByIdAndUpdate(
        { _id: new ObjectId(req.params.id) },
        {
          $set: {
            isActive: req.body?.isActive,
            isTrending: req.body?.isTrending,
            isEditorPick: req.body?.isEditorPick,
            status: req.body?.status,
            approvedAt:
              req.body?.status === BLOG_STATUS.APPROVED ? new Date() : null,
          },
        },
        {
          new: true,
        }
      ).lean();

      //step 2 : create notification
      if (req.body?.status && updatedBlog) {
        await BlogNotificationModel.create({
          blogId: updatedBlog._id,
          receiverId: updatedBlog.uid,
          message: `Your blog "${updatedBlog?.title}" has been "${req.body?.status}"`,
        });
        //func calling for notification
        const message = {
          receiverId: updatedBlog.uid.toString(),
          message: `Your blog "${updatedBlog?.title}" has been "${req.body?.status}"`,
        };

        await broker.sendMessages(
          JSON.stringify(message),
          RMQ_QUEUS.MESSAGE_QUEUE,
          RMQ_ROUTING_KEYS.EVENT_SERVICE
        );
      }
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

  //changeBlogCagtoryStatus
  changeBlogCagtoryStatus: async (req, res) => {
    try {
      await BlogCategory.updateOne(
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

  //getAllBlogs
  getAllBlogs: async (req, res) => {
    try {
      let {
        id,
        search,
        isActive,
        isDeleted,
        status,
        isTrending,
        isEditorPick,
        createdBy,
      } = req.query;

      req.query.sortBy = req.query.sortBy ? req.query.sortBy : "createdAt";
      req.query.sortOrder = req.query.sortOrder ? req.query.sortOrder : -1;

      let page = parseInt(req.query.page);
      let limit = parseInt(req.query.limit);

      let skip = (parseInt(page) - 1) * limit;

      let searchTerm = search === undefined ? (search = "") : search; // Search term

      // Step 1: Find users based on search criteria
      let matchingUsers = await UserModel.find({
        $or: [
          { userName: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
        ],
      }).distinct("_id");

      // Step 2: Find blogCategory based on search criteria
      let matchingBlogCategory = await BlogCategory.find({
        title: { $regex: searchTerm, $options: "i" },
      }).distinct("_id");

      // Criteria Object to filter the blogs
      let criteria = {};

      // Criteria to search by title or slugId
      if (search) {
        criteria = {
          $or: [
            {
              title: { $regex: req.query?.search, $options: "i" },
            },
            {
              slugId: { $regex: req.query?.search, $options: "i" },
            },
            {
              blogCategoryId: { $in: matchingBlogCategory || [] },
            },
            {
              uid: { $in: matchingUsers || [] },
            },
          ],
        };
      }

      if (status) criteria = { status: status, ...criteria };
      if (isActive != undefined) criteria = { isActive: isActive, ...criteria };
      if (isDeleted != undefined)
        criteria = { isDeleted: isDeleted, ...criteria };
      if (isTrending != undefined)
        criteria = { isTrending: isTrending, ...criteria };
      if (isEditorPick != undefined)
        criteria = { isEditorPick: isEditorPick, ...criteria };
      if (createdBy) {
        criteria = {
          createdBy: createdBy,
          ...criteria,
        };
      }
      //if createdBy is User then not to show draft blogs
      if (createdBy == ROLE.USER) {
        criteria = {
          status: { $ne: BLOG_STATUS.DRAFT },
          ...criteria,
        };
      }
      let findBlogs = {};
      let count = 0;
      if (id) {
        findBlogs = await BlogModel.findOne({
          _id: id,
          // status: { $ne: BLOG_STATUS.DRAFT },
          ...criteria,
        });
      } else {        
        findBlogs = await BlogModel.aggregate([
          {
            $match: {
              ...criteria,
              // status: status ? status : { $ne: BLOG_STATUS.DRAFT },
            },
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
          {
            $lookup: {
              from: "blogcategories",
              localField: "blogCategoryId",
              foreignField: "_id",
              as: "BlogCategory",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "uid",
              foreignField: "_id",
              pipeline: [
                {
                  $project: {
                    userName: 1,
                    email: 1,
                    profileImage: 1,
                    instagramLink: 1,
                    facebookLink: 1,
                    twitterLink: 1,
                    youtubeLink: 1,
                    linkedinLink: 1,
                    shortBio: 1,
                  },
                },
              ],
              as: "Users",
            },
          },
          {
            $unwind: "$Users",
          },
          //lookup for likes and dislikes counts
          {
            $lookup: {
              from: "likedislikehistories",
              let: { blogId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$blogId", "$$blogId"] },
                        { $eq: ["$action", "like"] },
                      ],
                    },
                  },
                },
              ],
              as: "likes",
            },
          },
          {
            $lookup: {
              from: "likedislikehistories",
              let: { blogId: "$_id" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$blogId", "$$blogId"] },
                        { $eq: ["$action", "dislike"] },
                      ],
                    },
                  },
                },
              ],
              as: "dislikes",
            },
          },
          {
            $addFields: {
              likes: { $size: "$likes" },
              dislikes: { $size: "$dislikes" },
            },
          },
        ]);
        count = await BlogModel.countDocuments(criteria);
      }

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: {
          blog_category: findBlogs,
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

  //getAllNewsletterSubscribers
  getAllNewsletterSubscribers: async (req, res) => {
    try {
      let { search, page, limit, sortBy, sortOrder } = req.query;

      let skip = (parseInt(page) - 1) * limit;
      let criteria = {};
      if (search) {
        criteria = {
          ...criteria,
          email: { $regex: search, $options: "i" },
        };
      }

      const pipeline = [
        { $match: criteria }, // Filter based on criteria
        { $sort: { createdAt: -1 } }, // Sort by createdAt descending
        { $skip: skip }, // Skip documents
        { $limit: limit }, // Limit documents
      ];
      const findUsers = await NewsLetterModel.aggregate(pipeline);

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: {
          user: findUsers,
          counts: await NewsLetterModel.countDocuments(criteria),
        },
      });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({
        res,
        error,
      });
    }
  },

  //deleteNewsletterSubscriber
  deleteNewsletterSubscriber: async (req, res) => {
    try {
      await NewsLetterModel.deleteOne({
        _id: new ObjectId(req.params.id),
      });

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

  //createPrivacyPolicy
  createPrivacyPolicy: async (req, res) => {
    try {
      const createdPrivacyAndPolicy = await PrivacyPolicyModel.create({
        ...req.body,
      });

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: createdPrivacyAndPolicy,
      });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({
        res,
        error,
      });
    }
  },

  //getAllPrivacyPolicies
  getAllPrivacyPolicies: async (req, res) => {
    try {
      let { search, isDeleted, id, page, limit, sortBy, sortOrder, title } =
        req.query;

      let skip = (parseInt(page) - 1) * limit;
      let criteria = {};
      if (search) {
        criteria = {
          ...criteria,
          $or: [
            {
              title: { $regex: search, $options: "i" },
              content: { $regex: search, $options: "i" },
            },
          ],
        };
      }

      if (title) {
        const titleMap = {
          terms: "Terms And Conditon",
          disclaimer: "Disclaimer",
          policy: "Privacy Policy",
          home: "Home Page",
        };
        criteria = { title: titleMap[title] };
      }

      if (isDeleted != undefined)
        criteria = { isDeleted: isDeleted, ...criteria };
      if (id) {
        const findPrivacyPolicy = await PrivacyPolicyModel.findOne({
          _id: id,
          ...criteria,
        });

        return responseLib.OK({
          res,
          message: message.SUCCESS,
          payload: findPrivacyPolicy,
        });
      }

      const pipeline = [
        { $match: criteria }, // Filter based on criteria
        { $sort: { createdAt: -1 } }, // Sort by createdAt descending
        { $skip: skip }, // Skip documents
        { $limit: limit }, // Limit documents
      ];

      const findPrivacyPolicy = await PrivacyPolicyModel.aggregate(pipeline);

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: {
          privacy_policy: findPrivacyPolicy,
          counts: await PrivacyPolicyModel.countDocuments(criteria),
        },
      });
    } catch (error) {
      log.error(error);

      return responseLib.CATCH_ERROR({
        res,
        error,
      });
    }
  },

  //updatePrivacyPolicy
  updatePrivacyPolicy: async (req, res) => {
    try {
      const updatedPrivacyAndPolicy = await PrivacyPolicyModel.updateOne(
        { _id: new ObjectId(req.body?.id) },
        {
          ...req.body,
        },
        { new: true }
      ).lean();

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: {},
      });
    } catch (error) {
      log.error(error);
      return responseLib.CATCH_ERROR({
        res,
        error,
      });
    }
  },

  //deletePrivacyPolicy
  deletePrivacyPolicy: async (req, res) => {
    try {
      await PrivacyPolicyModel.updateOne(
        {
          _id: new ObjectId(req.params.id),
        },
        {
          $set: {
            isDeleted: true,
            deletedAt: new Date(),
          },
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

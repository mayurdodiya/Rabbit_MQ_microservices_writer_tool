const responseLib = require("wt-lib").resp;
const moment = require("moment");
const { ObjectId } = require("wt-server").mongoose.Types;
const {
  UserModel,
  BlogCategory,
  BlogModel,
  SaveBlogModel,
  NewsLetterModel,
  LikeDislikeHistoryModel,
} = require("wt-schemas");
const { log } = require("wt-lib/logger.lib");
const { message } = require("wt-utils");
const { generateSlugId } = require("wt-utils/other-services");
const { generateThumbnail } = require("wt-utils/s3.bucket");
const {
  enums: { BLOG_STATUS, ROLE },
} = require("wt-config");

module.exports = {
  // API to create Blog
  createBlog: async (req, res) => {
    try {
      const { user } = req;

      //slugId check
      const slug = req.body.slugId ? req.body?.slugId : req.body?.title;
      const createSlug = await generateSlugId(slug);

      const blogExist = await BlogModel.findOne({
        slugId: createSlug,
        isDeleted: false,
      });

      if (blogExist)
        return responseLib.BAD_REQUEST({
          res,
          message: message.BLOG_ALREADY_EXISTS,
        });

      let blogCategoryIds = req.body?.blogCategoryId;

      if (!Array.isArray(blogCategoryIds)) {
        blogCategoryIds = [blogCategoryIds];
      }

      const categoryPromises = blogCategoryIds?.map(async (category) => {
        const findCategory = await BlogCategory.findOne({
          _id: new ObjectId(category),
          isDeleted: false,
        });

        if (!findCategory) {
          return responseLib.BAD_REQUEST({
            res,
            message: message.BLOG_CATEGORY_NOT_FOUND,
          });
        }

        return findCategory._id;
      });

      // Categores of Blog Post
      const blogCategories = await Promise.all(categoryPromises);

      const blogkeyWords = req.body.keyWords?.map((keyword) => {
        return keyword.toLowerCase();
      });

      // Create thumbnail field by converting cover photo to thumbnail in webp format
      const thumbnail =
        req.file === undefined
          ? req.thumbnail
          : await generateThumbnail(req.file?.location);

      const emailExist = await UserModel.findOne({
        email: req.user.email,
        isActive: true,
      }).populate("roleId"); // Get user by email.

      const createBlog = await BlogModel.create({
        title: req.body?.title,
        description: req.body?.description,
        sortDescription: req.body?.sortDescription,
        websiteLink: req.body?.websiteLink,
        keyWords: blogkeyWords,
        blogCategoryId: blogCategories,
        slugId: createSlug,
        instagramLink: req.body.instagramLink,
        facebookLink: req.body.facebookLink,
        linkedinLink: req.body.linkedinLink,
        twitterLink: req.body.twitterLink,
        youtubeLink: req.body.youtubeLink,
        thumbnail,
        coverPhoto: req.file ? req.file?.location : req.coverPhoto,
        coverPhotoAltTag: req.body?.coverPhotoAltTag,
        metaTitle: req.body?.metaTitle,
        metaDescription: req.body?.metaDescription,
        FAQs: req.body?.FAQs,
        uid: user._id,
        createdBy: emailExist.roleId.role,
        status:
          emailExist.roleId.role == (ROLE.ADMIN || ROLE.SUPER_ADMIN)
            ? req.body?.status || BLOG_STATUS.APPROVED
            : req.body?.status,
        isActive: emailExist.roleId.role == ROLE.ADMIN ? true : false,
        readTime: req.body?.readTime,
      });

      const payload = {};

      if (createBlog.status === BLOG_STATUS.DRAFT) {
        payload.message = message.BLOG_SAVED_AS_DRAFT;
      } else {
        payload.message = message.BLOG_SUBMITTED_FOR_APPROVAL;
      }

      return responseLib.OK({
        res,
        payload: createBlog,
        message: message.SUCCESS,
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

  // API to get Blog
  getBlog: async (req, res) => {
    try {
      const {
        id,
        slugId,
        search,
        isActive,
        isDeleted,
        isTrending,
        isEditorPick,
        blogCtaegory,
        blogCategorySlugIds,
        status,
        createdBy,
        limit,
        page,
        sortBy,
        sortOrder,
      } = req.query;

      let userId = req?.user ? req.user._id : false;

      let skip = (parseInt(page) - 1) * limit;
      let criteria = {};
      // Criteria to search by title or slugId
      if (search) {
        criteria = {
          ...criteria,
          $or: [
            {
              title: { $regex: req.query.search, $options: "i" },
            },
            {
              slugId: { $regex: req.query.search, $options: "i" },
            },
            {
              keyWords: { $regex: req.query.search, $options: "i" },
            },
          ],
        };
      }

      if (isActive) criteria = { isActive: true, ...criteria };
      if (isDeleted != undefined) criteria = { isDeleted, ...criteria };
      if (isEditorPick != undefined) criteria = { isEditorPick, ...criteria };
      if (blogCtaegory)
        criteria = { blogCategoryId: { $in: blogCtaegory || [] }, ...criteria };
      if (status) {
        criteria = {
          status:
            status === "Published"
              ? { $in: [BLOG_STATUS.APPROVED, BLOG_STATUS.REJECTED] }
              : status,
          // uid: new ObjectId(req?.user?._id),
          ...criteria,
          //change by MS
          ...(req?.user != undefined
            ? { uid: new ObjectId(req?.user?._id) }
            : {}),
        };
      } else {
        criteria = {
          ...criteria,
          status: BLOG_STATUS.APPROVED,
        };
      }

      if (isTrending != undefined) {
        criteria = { isTrending, ...criteria };
        delete criteria.uid;
      }
      if (createdBy) criteria = { createdBy: createdBy, ...criteria };
      if (blogCategorySlugIds) {
        const blogCategoryIds = await BlogCategory.find({
          slugId: { $in: blogCategorySlugIds || [] },
        }).distinct("_id");
        criteria = {
          blogCategoryId: { $in: blogCategoryIds || [] },
          ...criteria,
        };
        delete criteria.uid;
      }
      let findBlog = {};
      let count = 0;

      if (id || slugId) {
        criteria = slugId ? { slugId: slugId } : { _id: id };
        findBlog = await BlogModel.findOne(criteria)
          .populate(["blogCategoryId", "uid"])
          .lean();
        const isSaved = await SaveBlogModel.countDocuments({
          blogId: new ObjectId(findBlog._id),
          uid: new ObjectId(req?.user?._id),
        }).lean();
        findBlog.isSaved = isSaved > 0 ? true : false;

        if (userId) {
          const result = await LikeDislikeHistoryModel.findOne({
            blogId: findBlog._id,
            userId: userId,
          }).select("action");

          if (result) {
            if (result?.action === "like") {
              findBlog.likedBlog = true;
              findBlog.dislikedBlog = false;
            } else {
              findBlog.dislikedBlog = true;
              findBlog.likedBlog = false;
            }
          } else {
            findBlog.likedBlog = false;
            findBlog.dislikedBlog = false;
          }
        } else {
          findBlog.likedBlog = false;
          findBlog.dislikedBlog = false;
        }

        //Find counts of likes and dislikes
        const likes = await LikeDislikeHistoryModel.countDocuments({
          blogId: new ObjectId(findBlog._id),
          action: "like",
        });
        findBlog.likes = likes || 0;

        const dislikes = await LikeDislikeHistoryModel.countDocuments({
          blogId: new ObjectId(findBlog._id),
          action: "dislike",
        });
        findBlog.dislikes = dislikes || 0;

        //related blogs using the same category
        relatedBlogs = await BlogModel.find({
          blogCategoryId: { $in: findBlog?.blogCategoryId },
          _id: { $ne: findBlog?._id },
          isActive: true,
          status: BLOG_STATUS.APPROVED,
        })
          .select("-description -FAQs")
          .limit(3)
          .populate(["blogCategoryId", "uid"]);

        findBlog.relatedBlogs = relatedBlogs || [];
      } else {
        let pipeline = [
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

        if (status === undefined) {
          pipeline.push({
            $project: {
              description: 0,
              FAQs: 0,
            },
          });
        }

        pipeline.push(
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
          }
        );
        if (req?.user) {
          pipeline.push(
            {
              $lookup: {
                from: "library",
                localField: "_id",
                foreignField: "blogId",
                as: "library_blogs",
                pipeline: [
                  {
                    $match: {
                      uid: new ObjectId(req?.user?._id),
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                isSaved: {
                  $cond: {
                    if: {
                      $eq: [{ $size: "$library_blogs" }, 0],
                    },
                    then: false,
                    else: true,
                  },
                },
              },
            }
          );
        }
        findBlog = await BlogModel.aggregate(pipeline);
        count = await BlogModel.countDocuments(criteria);
      }

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: {
          blogs: findBlog,
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

  // API to get Blog
  getEditorBlogs: async (req, res) => {
    try {
      const { limit, page, sortBy, sortOrder, search } = req.query;
      const user = req.user;
      let skip = (parseInt(page) - 1) * limit;

      let criteria = {
        status: BLOG_STATUS.APPROVED,
        isDeleted: false,
        isEditorPick: true,
        // ...(user
        //   ? { blogCategoryId: { $in: user?.interestedCategories || [] } }
        //   : {}),
      };

      if (search) {
        criteria = {
          ...criteria,
          $or: [
            {
              title: { $regex: req.query.search, $options: "i" },
            },
            {
              slugId: { $regex: req.query.search, $options: "i" },
            },
          ],
        };
      }

      // Criteria to find by user's intrusted categories
      let findEditorBlogs = {};
      let count = 0;

      let query = [
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
        {
          $project: {
            description: 0,
            FAQs: 0,
          },
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
                },
              },
            ],
            as: "Users",
          },
        },
        {
          $unwind: "$Users",
        },
      ];
      if (user) {
        query.push(
          {
            $lookup: {
              from: "library",
              localField: "_id",
              foreignField: "blogId",
              as: "library_blogs",
              pipeline: [
                {
                  $match: {
                    uid: new ObjectId(req?.user?._id),
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              isSaved: {
                $cond: {
                  if: {
                    $eq: [{ $size: "$library_blogs" }, 0],
                  },
                  then: false,
                  else: true,
                },
              },
            },
          }
        );
      }
      findEditorBlogs = await BlogModel.aggregate([...query]);
      count = await BlogModel.countDocuments(criteria);

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: {
          editor_blogs: findEditorBlogs,
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

  // API to get Explore Blogs
  getExploreBlogs: async (req, res) => {
    try {
      const { limit, page, sortBy, sortOrder, search } = req.query;
      let skip = (parseInt(page) - 1) * limit;

      let criteria = {
        status: BLOG_STATUS.APPROVED,
        isActive: true,
        isDeleted: false,
      };
      if (search) {
        criteria = {
          ...criteria,
          $or: [
            {
              title: { $regex: req.query.search, $options: "i" },
            },
            {
              slugId: { $regex: req.query.search, $options: "i" },
            },
          ],
        };
      }
      let findExploreBlogs = {};
      let count = 0;
      findExploreBlogs = await BlogModel.aggregate([
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
        {
          $project: {
            description: 0,
            FAQs: 0,
          },
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
                },
              },
            ],
            as: "Users",
          },
        },
        {
          $unwind: "$Users",
        },
        {
          $lookup: {
            from: "library",
            localField: "_id",
            foreignField: "blogId",
            as: "library_blogs",
            pipeline: [
              {
                $match: {
                  uid: new ObjectId(req?.user?._id),
                },
              },
            ],
          },
        },
        {
          $addFields: {
            isSaved: {
              $cond: {
                if: {
                  $eq: [{ $size: "$library_blogs" }, 0],
                },
                then: false,
                else: true,
              },
            },
          },
        },
      ]);
      count = await BlogModel.countDocuments(criteria);

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: {
          explore_blogs: findExploreBlogs,
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

  // API to update BLog
  updateBlog: async (req, res) => {
    try {
      const findBlog = await BlogModel.findOne({
        _id: new ObjectId(req.params.id),
        isDeleted: false,
      });

      if (!findBlog)
        return responseLib.BAD_REQUEST({
          res,
          message: message.BLOG_NOT_FOUND,
        });

      let body = { ...req.body };

      if (req.file?.fieldname === "coverPhoto") {
        body.coverPhoto = req.file.location;
        body.thumbnail = await generateThumbnail(body.coverPhoto);
      }

      if (req.body?.title) {
        const newSlug = await generateSlugId(req.body.title);
        const slugExist = await BlogModel.findOne({
          slugId: newSlug,
          _id: { $ne: findBlog._id },

          // status: { $ne: BLOG_STATUS.DRAFT },
        });
        if (slugExist) {
          return responseLib.BAD_REQUEST({
            res,
            message: "This title already used in SlugId",
          });
        }
        body.slugId = newSlug;
      }

      if (req.body?.slugId) {
        const newSlug = await generateSlugId(req.body.slugId);
        const slugExist = await BlogModel.findOne({
          slugId: newSlug,
          _id: { $ne: findBlog._id },
          // status: { $ne: BLOG_STATUS.DRAFT },
        });
        if (slugExist) {
          return responseLib.BAD_REQUEST({
            res,
            message: "SlugId already Taken",
          });
        }
        body.slugId = newSlug;
      }

      await BlogModel.updateOne(
        { _id: findBlog._id },
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

  // API to delete Blog
  deleteBlog: async (req, res) => {
    try {
      const { id } = req.params;
      const blogExist = await BlogModel.findByIdAndDelete(id);

      if (!blogExist) {
        return responseLib.NOT_FOUND({
          res,
          message: message.BLOG_NOT_FOUND,
        });
      }

      return responseLib.OK({
        res,
        message: message.BLOG_DELETED,
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

  //API to Save Blogs of User
  savedBlogs: async (req, res) => {
    try {
      const { blogId } = req.query;

      //Check if blogExist or not
      const blogExist = await BlogModel.findOne({
        _id: new ObjectId(blogId),
        isActive: true,
      });

      if (!blogExist) {
        return responseLib.BAD_REQUEST({
          res,
          message: message.BLOG_NOT_FOUND,
        });
      }

      // Check if blog is already saved by user or not
      const saveBlogExist = await SaveBlogModel.findOne({
        blogId: new ObjectId(blogId),
        uid: new ObjectId(req.user._id),
      });

      if (saveBlogExist) {
        // Delete blog if already saved
        await SaveBlogModel.deleteOne({
          blogId: new ObjectId(blogId),
          uid: new ObjectId(req.user._id),
        });
        return responseLib.OK({
          res,
          message: message.BLOG_REMOVED_FROM_LIBRARY,
          payload: {},
        });
      }

      const saveBlog = new SaveBlogModel({
        blogId: new ObjectId(blogId),
        uid: new ObjectId(req.user._id),
      });

      await saveBlog.save();

      return responseLib.OK({
        res,
        message: message.BLOG_ADDED_TO_LIBRARY,
        payload: {},
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

  //API to get Saved Blogs of User
  getSavedBlogs: async (req, res) => {
    try {
      const { limit, page } = req.query;

      const uid = new ObjectId(req.user._id);

      let skip = (parseInt(page) - 1) * limit;
      const savedBlogs = await SaveBlogModel.find({ uid }).distinct("blogId");
      const findBlog = await BlogModel.aggregate([
        {
          $match: { _id: { $in: savedBlogs || [] } },
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
                },
              },
            ],
            as: "Users",
          },
        },
        {
          $unwind: "$Users",
        },
        {
          $lookup: {
            from: "library",
            localField: "_id",
            foreignField: "blogId",
            as: "library_blogs",
            pipeline: [
              {
                $match: {
                  uid: new ObjectId(req?.user?._id),
                },
              },
            ],
          },
        },
        {
          $addFields: {
            isSaved: {
              $cond: {
                if: {
                  $eq: [{ $size: "$library_blogs" }, 0],
                },
                then: false,
                else: true,
              },
            },
          },
        },
      ]);
      count = await BlogModel.countDocuments({
        _id: { $in: savedBlogs || [] },
      });

      return responseLib.OK({
        res,
        message: message.SUCCESS,
        payload: {
          blogs: findBlog,
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

  //API to subscribe for NewsLetter
  subscribe4NewsLetter: async (req, res) => {
    try {
      const { email } = req.body;
      const newsLetterExist = await NewsLetterModel.findOne({ email: email });
      if (newsLetterExist) {
        return responseLib.BAD_REQUEST({
          res,
          message: message.NEWSLETTER_ALREADY_EXISTS,
        });
      }
      const newsLetter = await NewsLetterModel.create({ email: email });
      return responseLib.OK({
        res,
        message: message.NEWSLETTER_SUBSCRIBED,
        payload: {},
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

  //API to unsubscribe for NewsLetter
  unsubscribe4NewsLetter: async (req, res) => {
    try {
      const { email } = req.body;
      const newsLetterExist = await NewsLetterModel.findOne({ email: email });
      if (!newsLetterExist) {
        return responseLib.BAD_REQUEST({
          res,
          message: message.NEWSLETTER_NOT_FOUND,
        });
      }
      await NewsLetterModel.updateOne(
        { email: email },
        {
          $set: { isDeleted: true, deletedAt: new Date() },
        }
      );
      return responseLib.OK({
        res,
        message: message.NEWSLETTER_UNSUBSCRIBED,
        payload: {},
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

  //API to like Blog
  likeBlog: async (req, res) => {
    try {
      const userId = new ObjectId(req.user._id);
      const { blogId } = req.params;

      // Check if user already liked or disliked the blog
      const existingAction = await LikeDislikeHistoryModel.findOne({
        userId,
        blogId,
      }).populate("userId blogId");

      const likeCounts = await LikeDislikeHistoryModel.countDocuments({
        blogId,
        action: "like",
      });

      const dislikeCount = await LikeDislikeHistoryModel.countDocuments({
        blogId,
        action: "dislike",
      });

      if (existingAction) {
        if (existingAction.action === "like") {
          return responseLib.NOT_ACCEPTABLE({
            res,
            message: "You have already liked this blog.",
            payload: {},
          });
        }

        // Update the dislike to a like
        existingAction.action = "like";
        const createNewAction = await existingAction.save();
        return responseLib.OK({
          res,
          message: "Blog liked successfully.",
          payload: {
            history: createNewAction,
            likecount: likeCounts + 1,
            dislikecount: dislikeCount - 1,
            likedBlog: true,
            dislikedBlog: false,
          },
        });
      }

      // Create a new like record
      const newLike = new LikeDislikeHistoryModel({
        userId,
        blogId,
        action: "like",
      });
      await newLike.save();

      return responseLib.OK({
        res,
        message: "Blog liked successfully.",
        payload: {
          history: newLike,
          likecount: likeCounts + 1,
          dislikecount: dislikeCount,
          likedBlog: true,
          dislikedBlog: false,
        },
      });
    } catch (error) {
      return responseLib.CATCH_ERROR({
        res,
        message: message.GENERAL_ERROR,
        payload: error.message,
      });
    }
  },

  dislikeBlog: async (req, res) => {
    try {
      const userId = new ObjectId(req.user._id);
      const { blogId } = req.params;

      // Check if user already liked or disliked the blog
      const existingAction = await LikeDislikeHistoryModel.findOne({
        userId,
        blogId,
      }).populate("userId blogId");

      const dislikeCounts = await LikeDislikeHistoryModel.countDocuments({
        blogId,
        action: "dislike",
      });

      const likeCounts = await LikeDislikeHistoryModel.countDocuments({
        blogId,
        action: "like",
      });

      if (existingAction) {
        if (existingAction.action === "dislike") {
          return responseLib.NOT_ACCEPTABLE({
            res,
            message: "You have already disliked this blog.",
            payload: {},
          });
        }

        // Update the like to a dislike
        existingAction.action = "dislike";
        const createNewAction = await existingAction.save();
        return responseLib.OK({
          res,
          message: "Blog disliked successfully.",
          payload: {
            history: createNewAction,
            dislikecount: dislikeCounts + 1,
            likecount: likeCounts - 1,
            likedBlog: false,
            dislikedBlog: true,
          },
        });
      }

      // Create a new dislike record
      const newDislike = new LikeDislikeHistoryModel({
        userId,
        blogId,
        action: "dislike",
      });
      await newDislike.save();

      return responseLib.OK({
        res,
        message: "Blog disliked successfully.",
        payload: {
          history: newDislike,
          dislikecount: dislikeCounts + 1,
          likecount: likeCounts,
          likedBlog: false,
          dislikedBlog: true,
        },
      });
    } catch (error) {
      return responseLib.CATCH_ERROR({
        res,
        message: message.GENERAL_ERROR,
        payload: error.message,
      });
    }
  },
};

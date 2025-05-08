const express = require("wt-server").express;
const {
  enums: { ROLE },
} = require("wt-config");

// Validation
const blogsValidation = require("../validation/blog.validation");
const { validate } = require("wt-utils");
const blogsController = require("../controllers/blog.controller");
const { auth } = require("wt-server/middleware");
const { uploadFile, uploadAndProcessFiles, dynamicFileUpload } = require("wt-utils/s3.bucket");
const router = express.Router();

//This API for Create blog
router.post(
  "/create",
  auth({ isTokenRequired: true, usersAllowed: ["*"] }),
  uploadFile.single("coverPhoto"),
  dynamicFileUpload,
  validate(blogsValidation.createBlog),
  blogsController.createBlog
);

//This API for Get All blogs
router.get(
  "/get",
  auth({ isTokenRequired: false, usersAllowed: ["*"] }),
  validate(blogsValidation.getBlogs),
  blogsController.getBlog
);

//This API for Get Editor blogs
router.get(
  "/get-editor-blogs",
  auth({ isTokenRequired: false, usersAllowed: ["*"] }),
  validate(blogsValidation.getEditorBlogs),
  blogsController.getEditorBlogs
);

//This API for Get explore blogs
router.get(
  "/get-explore-blogs",
  auth({ isTokenRequired: false, usersAllowed: ["*"] }),
  validate(blogsValidation.getExploreBlogs),
  blogsController.getExploreBlogs
);

//This API for Update blog
router.post(
  "/update/:id",
  auth({ isTokenRequired: true, usersAllowed: ["*"] }),
  uploadFile.single("coverPhoto"),
  uploadAndProcessFiles,
  validate(blogsValidation.updateBlog),
  blogsController.updateBlog
);

// Api to delete blog by id
router.delete(
  "/delete-blog/:id",
  auth({ isTokenRequired: true, usersAllowed: ["*"] }),
  blogsController.deleteBlog
);

// Api to save blog by user
router.post(
  "/saved-blogs",
  auth({ isTokenRequired: true, usersAllowed: ["*"] }),
  validate(blogsValidation.saveBlogsValidator),
  blogsController.savedBlogs
);

// Api to get saved blogs by user
router.get(
  "/get-saved-blogs",
  auth({ isTokenRequired: true, usersAllowed: ["*"] }),
  validate(blogsValidation.getSavedBlogValidator),
  blogsController.getSavedBlogs
);

//Api to subscribe for NewsLetter
router.post(
  "/subscribe4NewsLetter",
  auth({ isTokenRequired: false, usersAllowed: ["*"] }),
  validate(blogsValidation.subscribe4NewsLetter),
  blogsController.subscribe4NewsLetter
);

//Api to unsubscribe for NewsLetter
router.post(
  "/unsubscribe4NewsLetter",
  auth({ isTokenRequired: false, usersAllowed: ["*"] }),
  validate(blogsValidation.unsubscribe4NewsLetter),
  blogsController.unsubscribe4NewsLetter
);


//Api to do like or dislike on blog
router.post(
  "/:blogId/like",
  auth({ isTokenRequired: true, usersAllowed: ["*"] }),
  validate(blogsValidation.likeBlogValidator),
  blogsController.likeBlog
);

//Api to do dislike on blog
router.post(
  "/:blogId/dislike",
  auth({ isTokenRequired: true, usersAllowed: ["*"] }),
  validate(blogsValidation.likeBlogValidator),
  blogsController.dislikeBlog
);
module.exports = router;

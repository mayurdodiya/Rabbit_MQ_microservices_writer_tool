const enums = require("wt-config").enums;
const {
  Category,
  User,
  Course,
  Role,
  Batch,
  Lesson,
  Topic,
} = require("wt-schemas");
const responseLib = require("wt-lib").resp;

async function runScript(req, res, next) {
  try {
    let result = [];
    // -----------------------------------------add courses script start-----------------------------------------
    // const tempCourses = [];
    // const categories = await Category.find();
    // // find users who's roleId are either of these ["64645bf94f306e324c57d184", "64645bf94f306e324c57d185"]
    // const adminOrTutorUser = await User.find({ roleId: { $in: ["64645bf94f306e324c57d184", "64645bf94f306e324c57d185"] } });
    // for (let i = 1; i < 17; i++) {
    //   let randomCategory = Math.floor(Math.random() * categories.length);
    //   let randomUser = Math.floor(Math.random() * adminOrTutorUser.length);

    //   tempCourses.push({
    //     name: `course ${i}`,
    //     description: `course ${i} Id do ea mollit incididunt dolor.`,
    //     categoryId: categories[randomCategory]._id,
    //     createdBy: adminOrTutorUser[randomUser]._id,
    //   });
    // }

    // result = await Course.insertMany(tempCourses);
    // -----------------------------------------add courses script end-----------------------------------------

    // -----------------------------------------add lessons script start-----------------------------------------
    // const tempLessons = [];
    // const courses = await Course.find();

    // for (let i = 0; i < courses.length; i++) {
    //   for (let j = 1; j < 13; j++) {
    //     tempLessons.push({
    //       name: `lesson ${j}`,
    //       description: `lesson ${j} Id do ea mollit incididunt dolor.`,
    //       content: `lesson ${j} Amet sint quis commodo enim minim. Voluptate quis amet esse deserunt. Ipsum esse in velit enim ex cillum. Est anim Lorem culpa nulla ullamco occaecat ea. Anim nulla eiusmod dolor labore quis et eiusmod Lorem quis sunt proident ea non laboris. Non dolor mollit nisi minim laboris est nulla adipisicing ea excepteur id. Fugiat sunt mollit tempor mollit anim sit veniam amet magna sunt.`,
    //       courseId: courses[i]._id,
    //     });
    //   }
    // }
    // result = await Lesson.insertMany(tempLessons);
    // -----------------------------------------add lessons script end-----------------------------------------

    // -----------------------------------------update lessons with new topics flow script start-----------------------------------------

    // const courses = await Course.find();

    // for (let i = 0; i < courses.length; i++) {
    //   let topic = await Topic.findOne({ courseId: courses?.[i]._id });
    //   if (!topic) {
    //     topic = new Topic({ name: `${courses?.[i]?.name} topic 1`, courseId: courses?.[i]?._id });
    //     await topic.save();
    //   }
    //   if (courses?.[i].lessons?.length > 0) {
    //     await Course.updateOne({ _id: courses?.[i]?._id }, { $set: { lessons: null } });
    //   }

    //   let lessons = await Lesson.updateMany({ courseId: courses?.[i]?._id }, { $set: { topicId: topic._id, courseId: null, unlocked: null } });
    //   result.push({ courseName: courses?.[i]?.name, topicName: topic?.name, lessons: lessons });
    // }

    // -----------------------------------------update lessons with new topics flow script end-----------------------------------------

    // let responseObj = {
    //   req: req,
    //   result: 0,
    //   message: "success",
    //   payload: { data: result },
    //   logPayload: false,
    // };
    return responseLib.OK({ res, message: "success", payload: result });
    // return res.status(enums.HTTP_CODES.OK).json(responseLib.createResponseObject(responseObj));
  } catch (error) {
    // const erResponseObj = {
    //   req: req,
    //   result: -1,
    //   message: "something went wrong",
    //   payload: {},
    //   logPayload: false,
    // };
    // return res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json(responseLib.createResponseObject(erResponseObj));

    return responseLib.CATCH_ERROR({ res, message: "something went wrong" });
  }
}

module.exports = runScript;

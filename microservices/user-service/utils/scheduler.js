const cron = require("wt-lib").cron;
const { UserModel } = require("wt-schemas");
const logger = require("wt-lib").logger;

exports.userVerificationJob = cron.schedule("*/1 * * * *", async () => {
  try {
    // Delete the user which is not verified within 10 min
     await UserModel.deleteMany({
      isEmailVerified: false,
      createdAt: { $lt: new Date(Date.now() - 10 * 60 * 1000) },
    });

    return;
  } catch (error) {
    logger.error("Error deleting unverified users :- ", error);
  }
});

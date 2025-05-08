const { jwt } = require("wt-lib");
const { BlogNotificationModel, UserModel } = require("wt-schemas");
const {
  Types: { ObjectId: ObjectId },
} = require("wt-server").mongoose;
const log = require("wt-lib").logger;

module.exports = async (io) => {
  /* socket io connection */
  io.on("connection", async (socket) => {
    try {
      let { token: Authorization } = socket?.handshake?.query;
      if (Authorization && Authorization.startsWith("Bearer ")) {
        Authorization = Authorization.slice(7, Authorization.length);
      }
      const { _id } = jwt.decodeToken(Authorization);
      let user = await UserModel.findOne({ _id });
      socket.join(user?._id.toString());

      //check-notification
      socket.on("check-notification", async () => {
        let unreadNotification = await BlogNotificationModel.countDocuments({
          receiverId: user._id,
          isDisplay: false,
        });
        socket.emit("check-notification", { unreadNotification });
      });

      //update-notification
      socket.on("update-notification", async ({ isRead = null }) => {
        await BlogNotificationModel.updateMany(
          { receiverId: user._id },
          { isDisplay: true }
        );
        if (isRead) {
          await BlogNotificationModel.updateMany(
            { receiverId: user._id },
            { isRead: true }
          );
        }
        let unreadNotification = await BlogNotificationModel.countDocuments({
          receiverId: user._id,
          isDisplay: false,
        });
        socket.emit("check-notification", { unreadNotification });
      });

      //delete notification
      socket.on("delete-notification", async ({ notificationId }) => {
        await BlogNotificationModel.updateOne(
          { _id: notificationId },
          { isDeleted: true }
        );
        let unreadNotification = await BlogNotificationModel.countDocuments({
          receiverId: user._id,
          isDisplay: false,
        });
        socket.emit("check-notification", { unreadNotification });
      });

      //get-notification
      socket.on("get-notification", async () => {
        let notification = await BlogNotificationModel.find({
          receiverId: user._id,
        })
          .populate("blogId", "title")
          .sort({ createdAt: -1 });
        socket.emit("get-notification", { notification });
      });
      // io.in(socket.id).emit("taskData", { taskData });
      // socket.broadcast.emit("taskData", { taskData });
      // io.receiverId(userData.socket_id).emit("taskData", { taskData });
    } catch (error) {
      log.error("socket error", error);
      socket.disconnect();
    }
  });

  io.on("error", (err) => {
    log.error("socket err", err);
  });
};

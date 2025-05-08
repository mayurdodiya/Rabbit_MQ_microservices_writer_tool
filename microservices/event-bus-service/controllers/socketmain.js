const { log } = require("wt-lib/logger.lib");
const { jwt, broker } = require("wt-lib");
const { BlogNotificationModel, UserModel } = require("wt-schemas");
const { RMQ_QUEUS, RMQ_ROUTING_KEYS } = require("wt-config").enums;

// Start receiving messages
broker.receiveMessages(RMQ_QUEUS.MESSAGE_QUEUE, RMQ_ROUTING_KEYS.EVENT_SERVICE);

// Get the message emitter
const messageEmitter = broker.getMessageEmitter();

// Listen for the 'messageReceived' event
messageEmitter.on("messageReceived", async (message) => {
  const parsData = JSON.parse(message.content);

  // Handle the received message
  let unreadNotification = await BlogNotificationModel.find({
    receiverId: parsData.receiverId,
    isRead: false,
  });

  global.io.in(parsData.receiverId.toString()).emit("check-notification", {
    unreadNotification: unreadNotification,
    counts: unreadNotification.length,
  });
  global.io
    .in(parsData.receiverId.toString())
    .emit("get-unreadNotification-counts", {
      counts: await BlogNotificationModel.countDocuments({
        receiverId: parsData.receiverId,
        isDisplay: false,
      }),
    });

  let notification = await BlogNotificationModel.find({
    receiverId: parsData.receiverId,
  })
    .populate("blogId", "title")
    .sort({ createdAt: -1 });

  global.io.in(parsData.receiverId.toString()).emit("get-notification", {
    notification: notification,
    counts: notification.length,
  });
});

module.exports = async (io) => {
  /* socket io   */
  io.on("connection", async (socket) => {
    try {
      let { token: Authorization } = socket?.handshake?.query;
      if (Authorization && Authorization.startsWith("Bearer ")) {
        Authorization = Authorization.slice(7, Authorization.length);
      }
      const { _id, error } = jwt.decodeToken(Authorization);
      if (error) {
        socket.disconnect();
      }
      let user = await UserModel.findOne({ _id });

      socket.join(user?._id.toString());
      if (user) {
        socket.emit("get-unreadNotification-counts", {
          counts: await BlogNotificationModel.countDocuments({
            receiverId: user._id,
            isDisplay: false,
          }),
        });
        let limitData = 10;
        let pageData = 1;
        let skipData = 0;

        let unreadNotification = await BlogNotificationModel.find({
          receiverId: user._id,
          isRead: false,
        })
          .skip(skipData)
          .limit(limitData);

        socket.emit("check-notification", {
          unreadNotification: unreadNotification,
          counts: await BlogNotificationModel.countDocuments({
            receiverId: user._id,
            // isDisplay: false,
            isRead: false,
          }),
        });
      }
      //get-notification-counts
      socket.on("get-unreadNotification-counts", async () => {
        socket.emit("get-unreadNotification-counts", {
          counts: await BlogNotificationModel.countDocuments({
            receiverId: user?._id,
            isDisplay: false,
            isRead: false,
          }),
        });
      });

      //check-notification
      socket.on("check-notification", async ({ limit, page }) => {
        let limitData = limit ? limit : 10;
        let pageData = page ? page : 1;
        let skipData = page ? (pageData - 1) * limitData : 0;

        let unreadNotification = await BlogNotificationModel.find({
          receiverId: user._id,
          isRead: false,
        })
          .skip(skipData)
          .limit(limitData);

        socket.emit("check-notification", {
          unreadNotification: unreadNotification,
          counts: await BlogNotificationModel.countDocuments({
            receiverId: user._id,
            isRead: false,
            // isRead: false,
          }),
        });
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
          socket.emit("check-notification", {
            unreadNotification: {},
            counts: 0,
          });
        }
        // let unreadNotification = await BlogNotificationModel.countDocuments({
        //   receiverId: user._id,
        //   isDisplay: false,
        // });
        // socket.emit("check-notification", { unreadNotification });
        socket.emit("get-unreadNotification-counts", {
          counts: await BlogNotificationModel.countDocuments({
            receiverId: user._id,
            isDisplay: false,
          }),
        });
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
      socket.on("get-notification", async ({ limit, page }) => {
        let limitData = limit ? limit : 10;
        let pageData = page ? page : 1;
        let skipData = page ? (pageData - 1) * limitData : 0;

        let notification = await BlogNotificationModel.find({
          receiverId: user._id,
        })
          .populate("blogId", "title")
          .sort({ createdAt: -1 })
          .skip(skipData)
          .limit(limitData);

        socket.emit("get-notification", {
          notification: notification,
          counts: await BlogNotificationModel.countDocuments({
            receiverId: user._id,
          }),
        });
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

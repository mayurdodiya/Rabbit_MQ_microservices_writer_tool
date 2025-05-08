const { cron, jwt } = require("wt-lib");
const { User, Notification } = require("wt-schemas");
const {
  Types: { ObjectId: ObjectId },
} = require("wt-server").mongoose;

module.exports = async (io) => {
  /* socket io connection */
  io.on("connection", async (socket) => {
    // try {
    //   let { token: Authorization } = socket?.handshake?.query;
    //   if (Authorization && Authorization.startsWith("Bearer ")) {
    //     Authorization = Authorization.slice(7, Authorization.length);
    //   }
    //   const { _id } = jwt.decodeToken(Authorization);
    //   console.log("socket connected", _id, socket.id);
    //   let user=await User.findOne(
    //     {_id},
    //   );
    //   socket.join(user?._id.toString());
    //   console.log("socket connected", user._id.toString());
    // //check-notification
    // socket.on("check-notification", async () => {
    //   let unreadNotification = await Notification.countDocuments({ to: user._id, isDisplay: false });
    //   console.log("check-notification", unreadNotification);
    //   socket.emit("check-notification", { unreadNotification });
    // });
    // //update-notification
    // socket.on("update-notification", async ({isRead=null}) => {
    //   await Notification.updateMany({ to: user._id, }, { isDisplay: true,  });
    //   if(isRead){
    //     await Notification.updateMany({ to: user._id, }, { isRead: true,  });
    //   }
    //   let unreadNotification = await Notification.countDocuments({ to: user._id, isDisplay: false });
    //   console.log("update-notification", unreadNotification);
    //   socket.emit("check-notification", { unreadNotification });
    // });
    // //delete notification
    // socket.on("delete-notification", async ({ notificationId }) => {
    //   await Notification.updateOne({ _id: notificationId },{ isDeleted: true });
    //   let unreadNotification = await Notification.countDocuments({ to: user._id, isDisplay: false });
    //   console.log("delete-notification", unreadNotification);
    //   socket.emit("check-notification", { unreadNotification });
    // });
    // // io.in(socket.id).emit("taskData", { taskData });
    // // socket.broadcast.emit("taskData", { taskData });
    // // io.to(userData.socket_id).emit("taskData", { taskData });
    // } catch (error) {
    //   console.log("socket error", error);
    //   socket.disconnect();
    // }
  });

  io.on("error", (err) => {
    console.log("socket err", err);
  });
};

var MODULE_PREFIX = process.env.MODULE_PREFIX || "../../";
exports.services = {
  adminService: {
    name: "adminService",
    port: 30001,
    routeIndex: MODULE_PREFIX + "admin-service/routes/index.route",
    serviceRoute: "/admin-services",
  },
  userService: {
    name: "userService",
    port: 30002,
    routeIndex: MODULE_PREFIX + "user-service/routes/index.route",
    serviceRoute: "/user-services",
  },
  blogService: {
    name: "blogService",
    port: 30003,
    routeIndex: MODULE_PREFIX + "blog-service/routes/index.route",
    serviceRoute: "/blog-services",
  },
  eventBusService: {
    name: "eventBusService",
    port: 30004,
    routeIndex: MODULE_PREFIX + "event-bus-service/routes/index.route",
    serviceRoute: "/event-bus-services",
  },
};

const {
  enums: { ROLE },
} = require("wt-config");
const { UserModel, RoleModel } = require("wt-schemas");
const { adminData } = require("./seedData");
const { log } = require("wt-lib/logger.lib");

/**
 * Admin seeder.
 */
module.exports = adminSeeder = async () => {
  const superAdminRole = await RoleModel.findOne({ role: ROLE.SUPER_ADMIN });

  try {
    for (let admin of adminData) {
      const adminExist = await UserModel.findOne({ email: admin.email }); // Get Admin by email.

      if (!adminExist) {
        await UserModel.create({
          userName: "Admin",
          // lastName: "user",
          email: "admin@gmail.com",
          password: "Admin@123",
          roleId: superAdminRole._id,
          isEmailVerified: true,
        }); // If admin doesn't exists, create admin.
      }
    }

    log.info("✅ Admin seeder run successfully...");
  } catch (error) {
    log.error("❌ Error from admin seeder :", error);
  }
};

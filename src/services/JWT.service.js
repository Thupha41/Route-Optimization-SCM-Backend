import db from "../models/index";
class JWTService {
  static getRoleWithPermission = async (user) => {
    let roles = await db.Role.findOne({
      where: {
        id: user.roleId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.Permission,
          attributes: ["id", "url", "description"],
          through: { attributes: [] },
        },
      ],
    });

    return roles ? roles : {};
  };
}

module.exports = JWTService;

module.exports = (sequelize, DataTypes) => {
  const User_Save_Profile = sequelize.define('User_Save_Profile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',  // Ensure lowercase table name
        key: 'id'
      }
    },
    profile_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'user_save_profiles',
    timestamps: false
  });

  User_Save_Profile.associate = function(models) {
    User_Save_Profile.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });

    User_Save_Profile.belongsTo(models.User, {
      foreignKey: "profile_id",
      as: "profile",
    });
  };

  return User_Save_Profile;
};

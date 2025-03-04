'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserSocialLinks = sequelize.define('user_social_links', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    social_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'social_media_platforms',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    social_link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_social_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1 // 1=>Active, 2=>InActive, 3=>Deleted'
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
    timestamps: false,
    modelName: 'user_social_links'  // Add this line
  });

  UserSocialLinks.associate = function(models) {
    UserSocialLinks.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    UserSocialLinks.belongsTo(models.social_media_platforms, {
      foreignKey: 'social_type_id',
      as: 'social_platform'
    });
  };

  return UserSocialLinks;
};
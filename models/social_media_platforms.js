'use strict';

module.exports = (sequelize, DataTypes) => {
  const SocialMediaPlatforms = sequelize.define('social_media_platforms', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    social_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    social_icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    social_status: {
        type: DataTypes.INTEGER, //'1=>Active, 2=>InActive, 3=>Deleted',
        allowNull: false,
        defaultValue: 1
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
    modelName: 'social_media_platforms'
  });

  SocialMediaPlatforms.associate = function(models) {
    SocialMediaPlatforms.hasMany(models.user_social_links, {
      foreignKey: 'social_type_id',
      as: 'user_links'
    });
  };

  return SocialMediaPlatforms;
};
'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {  
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    user_profile_url: DataTypes.STRING,
    bio: DataTypes.STRING,
    website: DataTypes.STRING,
    profile_image: DataTypes.STRING,
    cover_image: DataTypes.STRING,
    phone: DataTypes.STRING,
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users',  // Force Sequelize to use lowercase 'users'
    timestamps: false
  });

  User.associate = function(models) {
    User.hasMany(models.user_social_links, {
      foreignKey: 'user_id',
      as: 'social_links'
    });
  };
  
  User.hasMany(models.User_Save_Profile, {
    foreignKey: "profile_id",
    as: "savedBy",
  });

  return User;
};

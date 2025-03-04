'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('social_media_platforms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      social_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      social_icon: {
        type: Sequelize.STRING,
        allowNull: false
      },
      social_status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      created: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add unique constraint on social_name
    await queryInterface.addIndex('social_media_platforms', ['social_name'], {
      unique: true,
      name: 'unique_social_name'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('social_media_platforms');
  }
};
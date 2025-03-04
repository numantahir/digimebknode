'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_social_links', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      social_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'social_media_platforms',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      social_link: {
        type: Sequelize.STRING,
        allowNull: false
      },
      user_social_status: {
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

    // Add composite index for user_id and social_type_id
    await queryInterface.addIndex('user_social_links', ['user_id', 'social_type_id'], {
      name: 'user_social_type_index'
    });

    // Add index for social_type_id for better query performance
    await queryInterface.addIndex('user_social_links', ['social_type_id'], {
      name: 'social_type_index'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_social_links');
  }
};
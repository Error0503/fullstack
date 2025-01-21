'use strict';

const { User, Post, Comment } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up() {
    const testUser = await User.create({
      username: 'user',
      password: 'user',
      role: 'user',
    });

    await User.create({
      username: 'admin',
      password: 'admin',
      role: 'user',
    });

    await User.create({
      username: 'moderator',
      password: 'moderator',
      role: 'user',
    });

    const testPost = await Post.create({
      heroId: 0,
      title: 'Test Post',
      shortDescription: 'This is a test post',
      body: {
        description: 'This is a test post created by the seeder',
        weaponItems: [
          'Close Quarters',
          'Hollow Point Ward',
          'Kinetic Dash',
          'Rapid Rounds',
        ],
        vitalityItems: [
          'Reactive Barrier',
          'Healbane',
          'Healing Nova',
          'Spirit Lifesteal',
        ],
        spiritItems: [
          'Extra Spirit',
          'Extra Charge',
          'Torment Pulse',
          'Spirit Snatch',
        ],
        flexItems: [
          {
            name: 'Crippling Headshot',
            category: 'weapon',
          },
          {
            name: "Enchanter's Barrier",
            category: 'vitality',
          },
          {
            name: 'Surge of Power',
            category: 'spirit',
          },
          {
            name: 'Superior Cooldown',
            category: 'spirit',
          },
        ],
      },
      UserId: testUser.id,
    });

    await Comment.create({
      commenterUsername: testUser.username,
      content: 'test',
      UserId: testUser.id,
      PostId: testPost.id,
    });
  },
  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Posts', null, {});
    await queryInterface.bulkDelete('Comments', null, {});
  },
};

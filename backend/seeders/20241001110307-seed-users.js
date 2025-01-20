'use strict';

const { User, Post, Comment } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up() {
    const testUser = await User.create({
      username: 'test',
      password: 'test',
      role: 'user',
    });

    const testPost = await Post.create({
      heroId: 0,
      title: 'Test Post',
      shortDescription: 'This is a test post',
      body: { description: 'This is a test post created by the seeder' },
      UserId: testUser.id,
    });

    await Comment.create({
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

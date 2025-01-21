'use strict';

const { User, Post, Comment, Report } = require('../models');

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
      commenterUsername: testUser.username,
      content: 'test',
      UserId: testUser.id,
      PostId: testPost.id,
    });

    await Report.create({
      status: 'open',
      reason: 'spam',
      body: 'test',
      UserId: testUser.id,
      PostId: testPost.id,
    });
    await Report.create({
      status: 'in-progress',
      reason: 'misleading',
      body: 'test',
      UserId: testUser.id,
      PostId: testPost.id,
    });
    await Report.create({
      status: 'resolved',
      reason: 'offensive',
      body: 'test',
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

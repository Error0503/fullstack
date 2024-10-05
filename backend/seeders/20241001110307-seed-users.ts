'use strict';

/** @type {import('sequelize-cli').Migration} */
const up = async (queryInterface) => {
  /**
   * Add seed commands here.
   *
   * Example:
   */
  await queryInterface.bulkInsert('Users', [
    {
      username: 'John Doe',
      password: 'test',
      role: 'test',
    },
  ]);
  // const testUser = await User.create({
  //   username: 'test',
  //   password: 'test',
  //   role: 'user',
  // });
};

const down = async (queryInterface) => {
  await queryInterface.bulkDelete('Users', null, {});
};

module.exports = { up, down };

// export { up, down };

/*
'use strict';

const { User, Post, Comment, Report } = require('../models');

module.exports = {
  async up(queryInterface, Sequelize) {
    const testUser = await User.create({
      username: 'test',
      password: 'test',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const testPost = await Post.create({
      title: 'test',
      body: 'test',
      UserId: testUser.id,
    });

    const testComment = await Comment.create({
      content: 'test',
      UserId: testUser.id,
      PostId: testPost.id,
    });

    const testReport = await Report.create({
      body: 'test',
      reason: 'spam',
      UserId: testUser.id,
      PostId: testPost.id,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};

*/

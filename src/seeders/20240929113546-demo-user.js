"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    //Tham số đầu tiên truyền vào là tên table muốn tham chiếu tới
    // bulkInsert allow us to insert multiple rows in tables
    await queryInterface.bulkInsert(
      "User",
      [
        {
          email: "John Doe",
          password: "123",
          username: "fake1",
        },
        {
          email: "John Doe2",
          password: "123",
          username: "fake12",
        },
        {
          email: "John Doe3",
          password: "123",
          username: "fake13",
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};

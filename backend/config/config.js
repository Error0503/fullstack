module.exports = {
  development: {
    database: 'database_development',
    storage: 'database/database.sqlite',
    dialect: 'sqlite',
  },
  test: {
    database: 'database_test',
    storage: 'database/database.sqlite',
    dialect: 'sqlite',
  },
  production: {
    database: 'database_production',
    storage: 'database/database.sqlite',
    dialect: 'sqlite',
  },
};

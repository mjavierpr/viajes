module.exports = {
  development: {
    username: 'javi',
    password: '1234',
    database: 'viajeros',
    host: 'localhost',
    dialect: "mysql",
  },
  test: {
    dialect: "mysql",
    storage: ":memory:"
  },
  production: {
    dialect: 'mysql',
    use_env_variable: 'DATABASE_URL'
  }
};

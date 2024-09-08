export default () => ({
  // server Port
  // port: process.env.PORT,

  // MySql Configuration
  // mysqlHost: process.env.MYSQL_HOST,
  // mysqlUser: process.env.MYSQL_USER,
  // mysqlPassword: process.env.MYSQL_PASSWORD,
  // mysqlDatabase: process.env.MYSQL_DATABASE,
  // mysqlPort: process.env.MYSQL_PORT,

  // JWT Configuration
  // jwtSecret: process.env.JWT_SECRET,
  // jwtExpiration: process.env.JWT_EXPIRATION,

  port: 3001,

  // MySql Configuration
  mysqlHost: 'slide-social-db.cxyoqs60eb1n.us-east-2.rds.amazonaws.com',
  mysqlUser: 'aws_db',
  mysqlPassword: '5TRW-*qHXf7',
  mysqlDatabase: 'slide_social_db',
  mysqlPort: 3306,

  // JWT Configuration
  jwtSecret: '$2b$12$cfURajWiJ39h/6v0K6Kwn.x79O.Ou6rKL/Pm4mko4asyDIHk.JUzC',
  jwtExpiration: '12h',
});

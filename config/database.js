module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "127.0.0.1"),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "chat-app"),
      user: env("DATABASE_USERNAME", "postgres"), // Update this line
      password: env("DATABASE_PASSWORD", "shivani12"),
      ssl: env.bool("DATABASE_SSL", false),
    },
  },
});
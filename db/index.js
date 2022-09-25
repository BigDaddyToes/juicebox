const { Client } = require("pg");
const client = new Client(
  {
    password: "postgres",
    user: "postgres",
    database: "juicebox-dev",
  },
  "postgres://localhost:5432/juicebox-dev"
);
client.connect();

client.query(`
DROP TABLE IF EXISTS users;

CREATE TABLE users (id SERIAL PRIMARY KEY, username varchar(255) UNIQUE NOT NULL, password varchar(255) NOT NULL);

INSERT INTO users (username, password) VALUES ('albert', 'bertie99');

INSERT INTO users (username, password) VALUES ('sandra', '2sandy4me');

INSERT INTO users (username, password) VALUES ('glamgal', 'soglam');`);

async function getAllUsers() {
  const { rows } = await client.query(
    `SELECT id, username 
    FROM users;
  `
  );

  return rows;
}

async function createUser({ username, password }) {
  try {
    const { rows } = await client.query(
      `
      INSERT INTO users(username, password) 
      VALUES($1, $2) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `,
      [username, password]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,
  getAllUsers,
  createUser,
};

const bcrypt = require("bcrypt");
const db = require("../config/db");
const logger = require("../utils/logger");

class User {
  static async create({ username, email, password, roleId }) {
    const hashedPassword = await bcrypt.hash(password, 12);
    const query =
    ` INSERT INTO users (username, email, password_hash, role_id) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id, username, email, role_id, created_at`;
      const values = [username, email, hashedPassword, roleId];

      try {
        const {rows} = await db.query(query, values);
        return rows[0];
      } catch (error) {
        logger.error("Error creating user:", error);
        throw error;
      }
    }
    static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await db.query(query, [email]);
    return rows[0];
  }

  // ... other methods like findById, update, etc.
}

module.exports = User;
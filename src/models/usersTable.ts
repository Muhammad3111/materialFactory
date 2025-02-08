import pool from "../config/db";

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        fullname VARCHAR(100) NOT NULL,
        phone VARCHAR(15) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(50) CHECK (role IN ('admin', 'omborchi', 'sotuvchi', 'ishchi')) DEFAULT 'ishchi',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Users jadvali yaratildi!");
  } catch (error) {
    console.error("Jadval yaratishda xatolik:", error);
  }
};

export default createTables;

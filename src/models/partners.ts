import pool from "../config/db";

const createPartnersTable = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS partners (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            address TEXT
            );
`);
    console.log("Partners jadvali yaratildi!");
  } catch (error) {
    console.error("Jadval yaratishda xatolik:", error);
  }
};

export default createPartnersTable;

import pool from "../config/db";

const createUsersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        fullname VARCHAR(100) NOT NULL,
        phone VARCHAR(15) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(50) CHECK (role IN ('admin', 'omborchi', 'sotuvchi', 'ishchi')) DEFAULT 'ishchi',
        salary_type VARCHAR(20) CHECK (salary_type IN ('oylik', 'soatlik', 'ish_bay')) DEFAULT 'oylik',
        salary_amount NUMERIC(12,2) DEFAULT 0,
        total_hours NUMERIC(10,2) DEFAULT 0,
        final_salary NUMERIC(12,2) DEFAULT 0,
        total_received NUMERIC(12,2) DEFAULT 0,
        total_output_products NUMERIC(12,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Users jadvali yaratildi!");
  } catch (error) {
    console.error("Jadval yaratishda xatolik:", error);
  }
};

export default createUsersTable;

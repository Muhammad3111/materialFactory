import pool from "../config/db";

const createProductsTable = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            category VARCHAR(255),
            quantity INT DEFAULT 0,
            price NUMERIC(10,2),
            low_stock_threshold INT DEFAULT 10,
            created_at TIMESTAMP DEFAULT NOW()
    );
        `);

    console.log("Products jadvali yaratildi!");
  } catch (error) {
    console.error("Jadval yaratishda xatolik:", error);
  }
};

export default createProductsTable;

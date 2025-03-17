import pool from "../config/db";

const createPermissionsTable = async () => {
  try {
    // 📌 `permissions` jadvali
    await pool.query(`
      CREATE TABLE IF NOT EXISTS permissions (
        id SERIAL PRIMARY KEY,
        role VARCHAR(50) UNIQUE NOT NULL,
        can_read BOOLEAN DEFAULT FALSE,
        can_create BOOLEAN DEFAULT FALSE,
        can_update BOOLEAN DEFAULT FALSE,
        can_delete BOOLEAN DEFAULT FALSE
      );
    `);

    console.log("Permissions jadvali yaratildi!");
  } catch (error) {
    console.error("Jadval yaratishda xatolik:", error);
  }
};

export default createPermissionsTable;

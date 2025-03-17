import pool from "../config/db";

const createInventoryLogs = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS inventory_log (
            id SERIAL PRIMARY KEY,
            product_id INT REFERENCES products(id) ON DELETE CASCADE,
            partner_id INT REFERENCES partners(id) ON DELETE SET NULL,
            user_id INT REFERENCES users(id) ON DELETE SET NULL,
            type VARCHAR(50) CHECK (type IN ('incoming', 'outgoing')),
            quantity INT NOT NULL,
            cost NUMERIC(10,2),
            total_cost NUMERIC(10,2),
            expense NUMERIC(10,2) DEFAULT 0, -- Sarflangan pul
            flaw NUMERIC(5,2) DEFAULT 0, -- Ishlov berishda yo‘qotilgan foiz
            unit VARCHAR(10) DEFAULT 'unit', -- O‘lchov birligi
            created_at TIMESTAMP DEFAULT NOW()
);
`);

    console.log("Inventory log jadvali yaratildi!");
  } catch (error) {
    console.error("Jadval yaratishda xatolik:", error);
  }
};

export default createInventoryLogs;

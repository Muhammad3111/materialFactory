import pool from "../config/db";

const createAttendanceLog = async () => {
  try {
    await pool.query(`
                CREATE TABLE IF NOT EXISTS attendance_log (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                check_in TIMESTAMP NOT NULL, -- Ishga kelgan vaqti
                check_out TIMESTAMP, -- Ishdan chiqqan vaqti (NULL bo‘lishi mumkin)
                worked_hours NUMERIC(10,2) DEFAULT 0, -- Hisoblangan ish soati
                created_at TIMESTAMP DEFAULT NOW()
    );
    `);

    console.log("Attendance log jadvali yaratildi!");
  } catch (error) {
    console.error("Jadval yaratishda xatolik:", error);
  }
};

export default createAttendanceLog;

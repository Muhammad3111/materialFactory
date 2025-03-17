import pool from "../config/db";

// 📌 Xodimlarning ishlagan soatlari va oylik maoshini yangilash
export const updateEmployeeSalaries = async (): Promise<void> => {
  try {
    await pool.query(`
      UPDATE users u
      SET total_hours = COALESCE((
          SELECT SUM(worked_hours) FROM attendance_log al WHERE al.user_id = u.id
      ), 0),
      final_salary = CASE 
          WHEN u.salary_type = 'oylik' THEN u.salary_amount
          WHEN u.salary_type = 'soatlik' THEN u.salary_amount * COALESCE((
              SELECT SUM(worked_hours) FROM attendance_log al WHERE al.user_id = u.id
          ), 0)
          WHEN u.salary_type = 'ish_bay' THEN u.salary_amount * COALESCE((
              SELECT COUNT(*) FROM attendance_log al WHERE al.user_id = u.id
          ), 0)
          ELSE 0
      END;
    `);
    console.log("Xodimlarning oyliklari yangilandi!");
  } catch (error) {
    console.error("Oylik hisoblashda xatolik:", error);
  }
};

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";
import createUsersTable from "./models/usersTable";
import createPermissionsTable from "./models/initDB";
import permissionRoutes from "./routes/permission";
import productRoutes from "./routes/products";
import inventoryRoutes from "./routes/inventory";
import partnerRoutes from "./routes/partners";
import createProductsTable from "./models/products";
import createPartnersTable from "./models/partners";
import createInventoryLogs from "./models/inventory_log";
import inventoryLogsRoutes from "./routes/inventoryLogs";
import inventoryStatsRoutes from "./routes/inventoryStats";
import createAttendanceLog from "./models/attendance_log";
import attendanceRoutes from "./routes/attendance";

dotenv.config();

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:5173" }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/permissons", permissionRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/inventoryLogs", inventoryLogsRoutes);
app.use("/api/inventory/stats", inventoryStatsRoutes);
app.use("/api/attendance", attendanceRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server ishlayapti: ${PORT}`);
  createUsersTable();
  createPermissionsTable();
  createProductsTable();
  createPartnersTable();
  createInventoryLogs();
  createAttendanceLog();
});

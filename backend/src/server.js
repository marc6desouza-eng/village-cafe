import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import app from './app.js';
import { connectDB } from './config/db.js';
import { Admin } from './models/Admin.js';
import { runSeed } from './utils/seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty on first boot
    const adminCount = await Admin.countDocuments({});
    if (adminCount === 0) {
      console.log('[Server] First launch detected. Initializing database with seed data...');
      await runSeed();
    }

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`  VILLAGE CAFE SERVER RUNNING`);
      console.log(`  Location: Carmel View, Curtorim, Goa`);
      console.log(`  API URL: http://localhost:${PORT}/api`);
      console.log(`  Health Check: http://localhost:${PORT}/api/health`);
      console.log(`  Admin Email: ${process.env.ADMIN_EMAIL || 'admin@villagecafe.goa'}`);
      console.log(`=======================================================`);
    });
  } catch (err) {
    console.error('[Server Error] Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

import dotenv from "dotenv";
dotenv.config();
import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import app from './app';
import logger from './utils/logger';
const PORT = process.env.PORT || 3000;
import { connectDB } from './db'
import { startPrivacyMaintenance } from './services/applicationPrivacyService';


void connectDB().then(() => {
  startPrivacyMaintenance();
});
app.listen(PORT, () => {
  console.log(`Servern körs på port ${PORT}`);
  logger.info('Server started on port ' + PORT);
});

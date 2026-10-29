import { app } from "./app";
import { testDbConnection } from "./db/connection";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  const isDbConnected = await testDbConnection();
  if (!isDbConnected) {
    console.warn("[Warning] MySQL database connection could not be verified on startup. Running in standby mode.");
  }

  const server = app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`  🚀 A B Taxway Consultancy REST API Server Running `);
    console.log(`  📡 Port: ${PORT}`);
    console.log(`  🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`  🔗 Health Check: http://localhost:${PORT}/health`);
    console.log(`====================================================`);
  });

  const shutdown = () => {
    console.log("\n[Server] Gracefully shutting down...");
    server.close(() => {
      console.log("[Server] Closed remaining HTTP connections.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

startServer().catch((err) => {
  console.error("[Fatal Startup Error]:", err);
  process.exit(1);
});

import "dotenv/config";

const { default: connectDB } = await import("./src/config/db.js");
const { default: app } = await import("./src/app.js");

await connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
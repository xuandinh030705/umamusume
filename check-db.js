const { createClient } = require("@libsql/client");
const c = createClient({ url: "file:D:/claude_project/umawall/dev.db" });
c.execute("SELECT name FROM sqlite_master WHERE type='table'")
  .then(r => console.log("Tables:", r.rows.map(r => r.name)))
  .catch(e => console.error("Error:", e.message));

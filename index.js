
// connect to the database
import {connectDatabase} from "./config/db.config.js";
import {PORT} from "./config/server.config.js";
import app from "./app.js";

connectDatabase().then(r => {
  app.listen(PORT, (_) =>
      console.log(`Server up and running on port ${PORT}`)
  );
});







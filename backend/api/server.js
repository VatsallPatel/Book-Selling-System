require("dotenv").config();

const express = require("express");

let app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const cors = require("cors");
app.use(cors());

app.use(
  "/public/thumbnails",
  express.static(__dirname + "/public/thumbnails")
);

app.use(
  "/public/books",
  express.static(__dirname + "/public/books")
);

app.use("/", require("./middleware/validate").extractHeaderLanguage);
app.use("/", require("./middleware/validate").validateApiKey);
app.use("/", require("./middleware/validate").validateHeaderToken);

const admin_auth = require("./modules/v1/admin/auth/auth_route");
const admin_home = require("./modules/v1/admin/home/home_route");
const user_auth = require("./modules/v1/user/auth/auth_route");
const user_home = require("./modules/v1/user/home/home_route");

app.use("/api/v1/admin-auth", admin_auth);
app.use("/api/v1/admin-home", admin_home);
app.use("/api/v1/auth", user_auth);
app.use("/api/v1/home", user_home);

try {
  app.listen(process.env.PORT || "3000");
  console.log(`⚡ Server Running ⚡ Port: ${process.env.PORT} ⚡`);
} catch (error) {
  console.log("Failed to run the server -> " + error);
}

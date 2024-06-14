const express = require("express");
const router = express.Router();
const common = require("../../../../config/common");
const auth_model = require("./auth_model");
const { t } = require("localizify");
const middleware = require("../../../../middleware/validate");

// APIs

// Login
router.post("/admin-login", function (req, res) {
  const rules = { email: "required", password: "required" };
  const messages = { required: t("required") };

  if (middleware?.checkValidation(res, req?.body, rules, messages)) {
    auth_model?.login(req?.body, function (code, message, data) {
      common?.response(req, res, code, message, data);
    });
  }
});

// Logout
router.post("/logout", function (req, res) {
  auth_model?.logout(req?.user_id, function (code, message, data) {
    common?.response(req, res, code, message, data);
  });
});

module.exports = router;

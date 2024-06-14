const express = require("express");
const router = express.Router();
const common = require("../../../../config/common");
const home_model = require("./home_model");
const { t } = require("localizify");
const middleware = require("../../../../middleware/validate");

// APIs

// Add to cart
router.post("/add-to-cart", function (req, res) {
  const rules = { book_id: "required", quantity: "required" };

  const message = { required: t("required") };

  if (middleware?.checkValidation(res, req?.body, rules, message)) {
    home_model?.addToCart(req, function (code, message, data) {
      common?.response(req, res, code, message, data);
    });
  }
});

// List cart
router.post("/listing-cart", function (req, res) {
  home_model?.listingCart(req, function (code, message, data) {
    common?.response(req, res, code, message, data);
  });
});

// Place order
router.post("/order", function (req, res) {
  home_model?.order(req, function (code, message, data) {
    common?.response(req, res, code, message, data);
  });
});

module.exports = router;

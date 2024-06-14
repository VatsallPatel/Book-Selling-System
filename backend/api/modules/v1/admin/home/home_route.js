const express = require("express");
const router = express.Router();
const common = require("../../../../config/common");
const home_model = require("./home_model");
const { t } = require("localizify");
const middleware = require("../../../../middleware/validate");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = file.mimetype.split("/")[0];
    if (type === "image") {
      cb(null, __dirname + "/../../../../public/thumbnails");
    } else {
      cb(null, __dirname + "/../../../../public/books");
    }
  },
  filename: function (req, file, cb) {
    const type = file.mimetype.split("/")[0];
    if (type === "image") {
      const thumbnail = `${Date.now()}_thumbnail_${file.originalname}`;
      req.body.thumbnail = thumbnail;
      cb(null, thumbnail);
    } else {
      const book = `${Date.now()}_book_${file.originalname}`;
      req.body.book_pdf = book;
      cb(null, book);
    }
  },
});

const upload = multer({ storage: storage });

// APIs

// Dashboard counts
router.post("/dashboard-counts", function (req, res) {
  home_model?.counts(function (code, message, data) {
    common?.response(req, res, code, message, data);
  });
});

// List Books
router.post("/list-books", function (req, res) {
  home_model?.listBooks(req?.body, function (code, message, data) {
    common?.response(req, res, code, message, data);
  });
});

// Add book
router.post(
  "/add-book",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "book_pdf", maxCount: 1 },
  ]),
  function (req, res) {
    const rules = {
      title: "required",
      author: "required",
      thumbnail: "required",
      book_pdf: "required",
      total_pages: "required",
      price: "required",
      tags: "required",
    };

    const messages = { required: t("required") };

    if (middleware?.checkValidation(res, req?.body, rules, messages)) {
      home_model?.addBook(req?.body, function (code, message, data) {
        common?.response(req, res, code, message, data);
      });
    }
  }
);

// Delete book
router.post("/delete-book", function (req, res) {
  const rules = { id: "required" };
  const messages = { required: t("required") };

  if (middleware?.checkValidation(res, req?.body, rules, messages)) {
    home_model?.deleteBook(req?.body, function (code, message, data) {
      common?.response(req, res, code, message, data);
    });
  }
});

// Edit book
router.post("/edit-book", function (req, res) {
  const rules = {
    id: "required",
    price: "required",
  };
  const messages = {
    required: t("required"),
  };

  if (middleware?.checkValidation(res, req?.body, rules, messages)) {
    home_model?.editBook(req?.body, function (code, message, data) {
      common?.response(req, res, code, message, data);
    });
  }
});

// List orders
router.post("/list-orders", function (req, res) {
  home_model?.listOrders(req, function (code, message, data) {
    common?.response(req, res, code, message, data);
  });
});

// Response order
router.post("/response-order", function (req, res) {
  const rules = {
    order_id: "required",
    response: "required",
  };
  const message = { required: t("required") };

  if (middleware?.checkValidation(res, req?.body, rules, message)) {
    home_model?.responseOrder(req?.body, function (code, message, data) {
      common?.response(req, res, code, message, data);
    });
  }
});

module.exports = router;

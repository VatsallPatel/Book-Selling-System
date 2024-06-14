const conn = require("../../../../config/database");
const common = require("../../../../config/common");
const constant = require("../../../../config/constant");
const asyncLoop = require("node-async-loop");

const home = {
  addToCart: function (req, callback) {
    const { book_id, quantity } = req?.body;

    common?.checkCart(req?.user_id, book_id, function (response, data) {
      if (response === true) {
        if (quantity !== 0) {
          const cartUpdate = `UPDATE tbl_cart SET qty = ${quantity} WHERE user_id = ${req?.user_id} AND 
                                book_id = ${book_id} and is_active = 1 and is_deleted = 0`;

          conn.query(cartUpdate, function (error, cart) {
            if (!error && cart?.affectedRows > 0) {
              callback("1", { keyword: "success_cart", content: "" }, []);
            } else {
              callback(
                "0",
                {
                  keyword: "error",
                  content: { error: "updating the cart quantity" },
                },
                []
              );
            }
          });
        } else {
          const cartDelete = `UPDATE tbl_cart SET is_deleted = 1 WHERE user_id = '${req?.user_id}' AND 
                                book_id = '${book_id}'`;

          conn.query(cartDelete, function (error, cart) {
            if (!error && cart?.affectedRows > 0) {
              callback("1", { keyword: "delete_cart", content: "" }, []);
            } else {
              callback(
                "0",
                {
                  keyword: "error",
                  content: { error: "removing the cart quantity" },
                },
                []
              );
            }
          });
        }
      } else if (data?.length === 0) {
        const queryData = {
          user_id: req?.user_id,
          book_id: book_id,
          qty: quantity,
        };

        const cart = `INSERT INTO tbl_cart SET ?;`;

        conn.query(cart, queryData, function (error, cartData) {
          if (!error) {
            callback("1", { keyword: "success_cart", content: "" }, []);
          } else {
            callback(
              "0",
              { keyword: "error", content: { error: "adding to cart" } },
              []
            );
          }
        });
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "checking the cart" } },
          []
        );
      }
    });
  },

  listingCart: function (req, callback) {
    const { book_id } = req?.body;

    let bookCondition = "";
    if (book_id !== undefined && book_id !== null && book_id !== "") {
      bookCondition = `AND c.book_id = '${book_id}'`;
    } else {
      bookCondition = ``;
    }

    const cart = `SELECT 
                      c.*, b.*, CONCAT('${constant.THUMBNAIL}', b.thumbnail) AS thumbnail_image,
                      CONCAT('${constant.BOOK}', b.book_pdf) AS book 
                  FROM 
                      tbl_cart c 
                  JOIN 
                      tbl_book b 
                  ON 
                      c.book_id = b.id 
                  WHERE 
                      c.user_id = '${req?.user_id}' ${bookCondition} AND c.is_active = 1 AND 
                      c.is_deleted = 0 AND b.is_active = 1 AND b.is_deleted = 0;`;

    conn.query(cart, function (error, result) {
      if (!error) {
        callback("1", { keyword: "success_cart", content: "" }, result);
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "listing cart" } },
          []
        );
      }
    });
  },

  // Order
  order: function (req, callback) {
    const { charge } = req?.body;

    const getCart = `SELECT 
                          c.*, b.* 
                      FROM 
                          tbl_cart c
                      JOIN
                          tbl_book b
                      ON
                          c.book_id = b.id
                      WHERE 
                          c.user_id = '${req?.user_id}' AND c.is_active = 1 AND c.is_deleted = 0 AND 
                          b.is_active = 1 AND b.is_deleted = 0;`;

    conn?.query(getCart, function (error, cart) {
      if (!error && cart.length > 0) {
        const sub_total = cart.reduce((a, v) => (a = a + v.qty * v.price), 0);
        const orderData = {
          user_id: req?.user_id,
          order_no: `BOOK${Date.now()}`,
          total_qty: cart.reduce((a, v) => (a = a + v.qty), 0),
          sub_total: sub_total,
          fixed_charges: charge,
          grand_total: sub_total + charge,
          status: "pending",
        };
        const order = `INSERT INTO tbl_order SET ?;`;
        conn.query(order, orderData, function (error, orderData) {
          if (!error) {
            asyncLoop(
              cart,
              (item, next) => {
                const detailsData = {
                  order_id: orderData.insertId,
                  book_id: item.book_id,
                  qty: item.qty,
                  per_book_price: item.price,
                  total: item.qty * item.price,
                };
                const detailsQuery = `INSERT INTO tbl_order_details SET ?`;
                conn?.query(
                  detailsQuery,
                  [detailsData],
                  function (error, result) {
                    if (error) {
                      next(error);
                    } else {
                      next();
                    }
                  }
                );
              },
              function (error) {
                if (error) {
                  callback(
                    "0",
                    {
                      keyword: "error",
                      content: { error: "adding order details" },
                    },
                    []
                  );
                } else {
                  const cartUpdate = `UPDATE tbl_cart SET is_deleted = 1 WHERE user_id = '${req?.user_id}';`;

                  conn?.query(cartUpdate, function (error, result) {
                    if (!error && result.affectedRows > 0) {
                      callback(
                        "1",
                        { keyword: "order_placed", content: "" },
                        []
                      );
                    } else {
                      callback(
                        "0",
                        {
                          keyword: "error",
                          content: { error: "deleting the cart" },
                        },
                        []
                      );
                    }
                  });
                }
              }
            );
          } else {
            callback(
              "0",
              { keyword: "error", content: { error: "placing the order" } },
              []
            );
          }
        });
      } else if (!error) {
        callback("0", { keyword: "no_data", content: "" }, []);
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "fetching the cart" } },
          []
        );
      }
    });
  },
};

module.exports = home;

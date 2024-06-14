const conn = require("../../../../config/database");
const common = require("../../../../config/common");
const constant = require("../../../../config/constant");
const asyncLoop = require("node-async-loop");

const home = {
  // Dashboard counts
  counts: function (callback) {
    const query = `SELECT COUNT(id) AS total_books FROM tbl_book WHERE is_active = 1 AND is_deleted = 0;
                    SELECT COUNT(id) AS pending_orders FROM tbl_order WHERE is_active = 1 AND 
                        is_deleted = 0 AND status = 'pending';
                    SELECT COUNT(id) AS rejected_orders FROM tbl_order WHERE is_active = 1 AND 
                        is_deleted = 0 AND status = 'rejected';
                    SELECT COUNT(id) AS approved_order FROM tbl_order WHERE is_active = 1 AND 
                        is_deleted = 0 AND status = 'accepted';
                    SELECT COUNT(id) AS cancelled_order FROM tbl_order WHERE is_active = 1 AND 
                        is_deleted = 0 AND status = 'cancelled';`;

    conn?.query(query, function (error, result) {
      if (!error) {
        const counts = [
          {
            books: result[0][0].total_books,
            pending: result[1][0].pending_orders,
            rejected: result[2][0].rejected_orders,
            approved: result[3][0].approved_order,
            cancelled: result[4][0].cancelled_order,
          },
        ];
        callback("1", { keyword: "count_success", content: "" }, counts);
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "getting the counts" } },
          []
        );
      }
    });
  },

  // List books
  listBooks: function (request, callback) {
    const { search, page, limit } = request;

    let condition = "";
    if (search !== undefined && search !== null && search !== "") {
      condition = `AND (title LIKE '%${search}%' OR author LIKE '%${search}%' OR tags LIKE '%${search}%')`;
    } else {
      condition = "";
    }

    let pageCondition = "";
    if (page !== null) {
      const offset = parseInt(page * limit);
      pageCondition = `LIMIT ${limit} OFFSET ${offset}`;
    } else {
      pageCondition = "";
    }

    const books = `SELECT
                        *, CONCAT('${constant.BOOK}', book_pdf) AS book, 
                        CONCAT('${constant.THUMBNAIL}', thumbnail) AS thumbnail_image
                    FROM
                        tbl_book
                    WHERE
                        is_active = 1 AND is_deleted = 0 ${condition}
                    ORDER BY
                        created_at
                    ${pageCondition};
                  SELECT 
                        COUNT(*) AS total
                    FROM
                        tbl_book
                    WHERE 
                        is_active = 1 AND is_deleted = 0 ${condition}`;

    conn?.query(books, function (error, book) {
      if (!error && book[0]?.length > 0 && book[1]?.length > 0) {
        callback("1", { keyword: "list_books", content: "" }, book);
      } else if (!error) {
        callback("2", { keyword: "no_data", content: "" }, []);
      } else {
        callback(
          "0",
          {
            keyword: "error",
            content: { error: "fetching books details" },
          },
          []
        );
      }
    });
  },

  // Add book
  addBook: function (request, callback) {
    const { title, author, thumbnail, book_pdf, total_pages, price, tags } =
      request;

    const data = {
      title: title,
      author: author,
      thumbnail: thumbnail,
      book_pdf: book_pdf,
      total_pages: total_pages,
      price: price,
      tags: tags,
    };

    const add = `INSERT INTO tbl_book SET ?;`;

    conn?.query(add, [data], function (error, book) {
      if (!error && book.insertId > 0) {
        callback("1", { keyword: "book_add_success", content: "" }, []);
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "adding the book" } },
          []
        );
      }
    });
  },

  // Delete book
  deleteBook: function (request, callback) {
    const { id } = request;

    const deleteQuery = `UPDATE tbl_book SET is_deleted = 1 WHERE id = '${id}';`;

    conn?.query(deleteQuery, function (error, deleted) {
      if (!error && deleted?.affectedRows > 0) {
        callback("1", { keyword: "delete_success", content: "" }, []);
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "deleting the book" } },
          []
        );
      }
    });
  },

  // Edit book
  editBook: function (request, callback) {
    const { id, price } = request;

    const editQuery = `UPDATE tbl_book SET price = '${price}' WHERE id = '${id}';`;

    conn.query(editQuery, function (error, edited) {
      if (!error && edited?.affectedRows > 0) {
        callback("1", { keyword: "edit_success", content: "" }, []);
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "editing the book details" } },
          []
        );
      }
    });
  },

  // Orders lisitng
  listOrders: function (req, callback) {
    const {
      is_id,
      is_pending,
      is_accepted,
      is_rejected,
      is_cancelled,
      page,
      limit,
    } = req?.body;

    let pageCondition = "";
    if (page !== null) {
      const offset = parseInt(page * limit);
      pageCondition = `LIMIT ${limit} OFFSET ${offset}`;
    } else {
      pageCondition = "";
    }

    const userCondition = is_id ? `AND o.user_id = '${req?.user_id}'` : "";
    const pendingCondition = is_pending ? `AND o.status = 'pending'` : "";
    const acceptedCondition = is_accepted ? `AND o.status = 'accepted'` : "";
    const rejectedCondition = is_rejected ? `AND o.status ='rejected'` : "";
    const orderByCondition = is_pending ? "ASC" : "DESC";
    const cancelCondition = is_cancelled
      ? `AND o.status = 'cancelled'`
      : is_id
      ? ""
      : `AND o.status != 'cancelled'`;

    const orderQuery = `SELECT o.*, u.name, u.email FROM tbl_order o JOIN tbl_user u ON o.user_id = u.id 
                          WHERE o.is_active = 1 AND o.is_deleted = 0 ${cancelCondition}
                          ${userCondition} ${pendingCondition} ${acceptedCondition} ${rejectedCondition} 
                          ORDER BY created_at ${orderByCondition} ${pageCondition};
                        SELECT COUNT(o.id) AS total_orders FROM tbl_order o WHERE o.is_active = 1 AND 
                          o.is_deleted = 0 ${cancelCondition} ${userCondition} ${pendingCondition} 
                          ${acceptedCondition} ${rejectedCondition};`;

    conn?.query(orderQuery, function (error, orders) {
      if (!error && orders[0]?.length > 0 && orders[1]?.length > 0) {
        asyncLoop(
          orders[0],
          function (item, next) {
            const query = `SELECT od.*, od.is_deleted AS deleted, b.*, 
                            CONCAT('${constant.THUMBNAIL}', thumbnail) AS thumbnail_image, 
                            CONCAT('${constant.BOOK}', book_pdf) AS book FROM tbl_order_details od JOIN 
                            tbl_book b ON od.book_id = b.id WHERE od.order_id = '${item.id}';`;

            conn?.query(query, function (error, orderDetails) {
              if (!error && orderDetails?.length > 0) {
                item.order_details = orderDetails;
                next();
              } else {
                next(error);
              }
            });
          },
          function (error) {
            if (error) {
              callback(
                "0",
                { keyword: "error", content: { error: "fetching orders" } },
                []
              );
            } else {
              callback("1", { keyword: "list_order", content: "" }, orders);
            }
          }
        );
      } else if (!error) {
        callback("2", { keyword: "no_data", content: "" }, []);
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "fetching orders" } },
          []
        );
      }
    });
  },

  // Response order
  responseOrder: function (request, callback) {
    const { order_id, book_id, response, comment } = request;
    const reason = comment || null;

    const data = {
      status: response,
      comment: reason,
    };

    if (book_id === null) {
      const query = `UPDATE tbl_order SET ? WHERE id = '${order_id}';`;

      conn?.query(query, [data], function (error, order) {
        if (!error && order?.affectedRows > 0) {
          if (response === "cancelled") {
            callback("1", { keyword: "cancel_success", content: "" }, []);
          } else {
            callback("1", { keyword: "response_success", content: "" }, []);
          }
        } else {
          callback(
            "0",
            { keyword: "error", content: { error: "responding the order" } },
            []
          );
        }
      });
    } else {
      const query1 = `SELECT od.*, o.* FROM tbl_order_details od JOIN tbl_order o On od.order_id = o.id 
                      WHERE od.book_id = '${book_id}' AND od.order_id = '${order_id}' AND od.is_active = 1 
                      AND od.is_deleted = 0 AND o.is_active = 1 AND o.is_deleted = 0;`;

      conn?.query(query1, function (error, details) {
        if (!error && details.length > 0) {
          const query2 = `UPDATE tbl_order_details SET status = '${response}', comment = '${reason}' 
                          WHERE book_id = '${book_id}' AND order_id = '${order_id}';`;

          const updateOrder = {
            total_qty: details[0].total_qty - details[0].qty,
            sub_total: details[0].sub_total - details[0].total,
            grand_total: details[0].grand_total - details[0].total,
          };

          const query3 = `UPDATE tbl_order SET ? WHERE id = '${order_id}';`;

          conn?.query(query2, function (error, result) {
            if (!error && result.affectedRows > 0) {
              conn?.query(query3, [updateOrder], function (error, order) {
                if (!error && order.affectedRows > 0) {
                  callback("1", { keyword: "book_rejected", content: "" }, []);
                } else {
                  callback(
                    "0",
                    { keyword: "book_reject_order_fail", content: "" },
                    []
                  );
                }
              });
            } else {
              callback(
                "0",
                { keyword: "error", content: { error: "rejecting the book" } },
                []
              );
            }
          });
        } else if (!error) {
          callback("2", { keyword: "no_data", content: "" }, []);
        } else {
          callback(
            "0",
            { keyword: "error", content: { error: "responding the order" } },
            []
          );
        }
      });
    }
  },
};

module.exports = home;

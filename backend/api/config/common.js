const middleware = require("../middleware/validate");
const conn = require("./database");

const common = {
  // Response
  response: (req, res, code, message, data) => {
    middleware?.getMessage(req?.lang, message, function (translated_message) {
      const response = {
        code: code,
        message: translated_message,
        data: data,
      };

      res.status(200).send(response);
    });
  },

  // Check unique username
  uniqueUsername: function (id, username, callback) {
    let condition = "";
    if (id !== null) {
      condition = `AND id != '${id}'`;
    } else {
      condition = "";
    }

    const checkUniqueUsername = `SELECT 
                                      * 
                                  FROM 
                                      tbl_user 
                                  WHERE 
                                      username = '${username}' AND role = 'user' ${condition} 
                                      AND is_active = 1 AND is_deleted = 0;`;

    conn?.query(checkUniqueUsername, function (error, isUniqueUsername) {
      if (!error && isUniqueUsername?.length === 0) {
        callback(true, []);
      } else if (!error) {
        callback(false, isUniqueUsername);
      } else {
        callback(false, []);
      }
    });
  },

  // Check unique mobile number
  uniqueMobile: function (id, mobile, callback) {
    let condition = "";
    if (id !== null) {
      condition = `AND id != '${id}'`;
    } else {
      condition = "";
    }

    const checkUniqueMobile = `SELECT 
                                    * 
                                FROM 
                                    tbl_user 
                                WHERE 
                                    username = '${mobile}' AND role = 'user' ${condition} 
                                    AND is_active = 1 AND is_deleted = 0;`;

    conn?.query(checkUniqueMobile, function (error, isUniqueMobile) {
      if (!error && isUniqueMobile?.length === 0) {
        callback(true, []);
      } else if (!error) {
        callback(false, isUniqueMobile);
      } else {
        callback(false, []);
      }
    });
  },

  // Check unique email
  uniqueEmail: function (id, email, callback) {
    let condition = "";
    if (id !== null) {
      condition = `AND id != '${id}'`;
    } else {
      condition = "";
    }

    const checkUniqueEmail = `SELECT 
                                    * 
                                FROM 
                                    tbl_user 
                                WHERE 
                                    email = '${email}' AND role = 'user' ${condition} 
                                    AND is_active = 1 AND is_deleted = 0;`;

    conn?.query(checkUniqueEmail, function (error, isUniqueEmail) {
      if (!error && isUniqueEmail?.length === 0) {
        callback(true, []);
      } else if (!error) {
        callback(false, isUniqueEmail);
      } else {
        callback(false, []);
      }
    });
  },

  // Get userdata
  getUser: function (id, callback) {
    const userData = `SELECT 
                            * 
                        FROM 
                            tbl_user 
                        WHERE 
                            id = '${id}' AND is_active = 1 AND is_deleted = 0;`;

    conn?.query(userData, function (error, userInfo) {
      if (!error && userInfo?.length > 0) {
        callback(userInfo);
      } else {
        callback([]);
      }
    });
  },

  // Generate Token
  generateToken: function (length = 32) {
    const possible = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
    let text = ``;

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  },

  // Check cart
  checkCart: function (user_id, book_id, callback) {
    const checkCart = `SELECT 
                            * 
                        FROM 
                            tbl_cart 
                        WHERE 
                            user_id = '${user_id}' AND book_id = '${book_id}' AND 
                            is_active = 1 AND is_deleted = 0;`;

    conn.query(checkCart, function (error, result) {
      if (!error && result.length > 0) {
        callback(true, result);
      } else if (!error) {
        callback(false, []);
      } else {
        callback(false, [error]);
      }
    });
  },
};

module.exports = common;

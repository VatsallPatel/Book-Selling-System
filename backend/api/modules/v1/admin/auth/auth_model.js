const conn = require("../../../../config/database");
const md5 = require("md5");
const common = require("../../../../config/common");

const auth = {
  // Login
  login: function (request, callback) {
    const { email, password } = request;

    const login = `SELECT 
                        * 
                    FROM 
                        tbl_user 
                    WHERE 
                        email = '${email}' AND password = '${md5(
      password
    )}' AND role = 'admin' AND is_active = 1 AND is_deleted = 0;`;

    conn.query(login, function (error, userData) {
      if (!error && userData?.length > 0) {
        const user_id = userData[0]?.id;
        const token = common?.generateToken();

        const updateToken = `UPDATE tbl_user SET token = '${token}' WHERE id = '${user_id}';`;

        conn?.query(updateToken, function (error, userInfo) {
          if (!error && userInfo?.affectedRows > 0) {
            userData[0].token = token;

            callback("1", { keyword: "login_success", content: "" }, userData);
          } else {
            callback(
              "0",
              { keyword: "error", content: { error: "login" } },
              []
            );
          }
        });
      } else if (!error) {
        callback("0", { keyword: "invalid_credentials", content: "" }, []);
      } else {
        callback("0", { keyword: "error", content: { error: "login" } }, []);
      }
    });
  },

  // Logout
  logout: function (user_id, callback) {
    const logoutUser = `UPDATE tbl_user SET token = null WHERE id = '${user_id}';`;

    conn?.query(logoutUser, function (error, logout) {
      if (!error && logout?.affectedRows > 0) {
        callback("1", { keyword: "logout_success", content: "" }, []);
      } else {
        callback("0", { keyword: "error", content: { error: "logout" } }, []);
      }
    });
  },
};

module.exports = auth;

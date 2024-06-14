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
    )}' AND role = 'user' AND is_active = 1 AND is_deleted = 0;`;

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
        console.log(error);
        callback("0", { keyword: "error", content: { error: "login" } }, []);
      }
    });
  },

  // Country code
  country_code: function (callback) {
    const countryCode = `SELECT * FROM tbl_cc;`;

    conn?.query(countryCode, function (error, countryCodes) {
      if (!error && countryCodes.length > 0) {
        callback(
          "1",
          { keyword: "country_code_success", content: "" },
          countryCodes
        );
      } else if (!error) {
        callback("2", { keyword: "no_data", content: "" }, []);
      } else {
        callback(
          "0",
          {
            keyword: "error",
            content: { error: "fetching the country codes" },
          },
          []
        );
      }
    });
  },

  // Signup
  signup: function (request, callback) {
    const { name, username, country_code, mobile_number, email, password } =
      request;

    const userData = {
      name: name,
      username: username,
      country_code: country_code,
      mobile_number: mobile_number,
      email: email,
      password: md5(password),
      role: "user",
    };
    const signup = `INSERT INTO tbl_user SET ?;`;

    common?.uniqueEmail(null, email, function (response, data) {
      if (response === true) {
        common?.uniqueMobile(null, mobile_number, function (response, data) {
          if (response === true) {
            common?.uniqueUsername(null, username, function (response, data) {
              if (response === true) {
                userData.token = common?.generateToken();

                conn?.query(signup, [userData], function (error, registered) {
                  if (!error && registered?.insertId > 0) {
                    common?.getUser(registered?.insertId, function (userData) {
                      callback(
                        "1",
                        { keyword: "signup_success", content: "" },
                        userData
                      );
                    });
                  } else {
                    callback(
                      "0",
                      { keyword: "error", content: { error: "signup" } },
                      []
                    );
                  }
                });
              } else if (response === false && data?.length > 0) {
                callback("0", { keyword: "username_exists", content: "" }, []);
              } else {
                callback(
                  "0",
                  {
                    keyword: "error",
                    content: { error: "checking unique username" },
                  },
                  []
                );
              }
            });
          } else if (response === false && data?.length > 0) {
            callback("0", { keyword: "mobile_exists", content: "" }, []);
          } else {
            callback(
              "0",
              {
                keyword: "error",
                content: { error: "checking unique mobile number" },
              },
              []
            );
          }
        });
      } else if (response === false && data?.length > 0) {
        callback("0", { keyword: "email_exists", content: "" }, []);
      } else {
        callback(
          "0",
          { keyword: "error", content: { error: "checking unique email" } },
          []
        );
      }
    });
  },
};

module.exports = auth;

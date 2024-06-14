const Validator = require("Validator");
const { default: localizify } = require("localizify");
var en = require("../languages/en");
const { t } = require("localizify");
const bypass = new Array("login", "signup", "country-code", "admin-login");
const conn = require("../config/database");

const middleware = {
  // Check validation rules
  checkValidation: function (res, request, rules, messages) {
    const v = Validator.make(request, rules, messages);

    if (v.fails()) {
      const errors = v.getErrors();

      let error;

      for (let key in errors) {
        error = errors[key][0];
        break;
      }

      const response = {
        code: 0,
        message: error,
        data: [],
      };
      
      res.status(200).send(response);

      return false;
    } else {
      return true;
    }
  },

  // Validate API-KEY
  validateApiKey: function (req, res, callback) {
    const apiKey = req?.headers["api-key"] || "";
    let response;

    if (apiKey != "") {
      try {
        if (apiKey != "" && apiKey == process.env.API_KEY) {
          callback();
        } else {
          response = {
            code: "-1",
            message: t("invalid_key"),
          };

          res.status(401).send(response);
        }
      } catch (error) {
        response = {
          code: "-1",
          message: t("invalid_key"),
        };

        res.status(401).send(response);
      }
    } else {
      response = {
        code: "-1",
        message: t("invalid_key"),
      };

      res.status(401).send(response);
    }
  },

  // Validate Header Token
  validateHeaderToken: function (req, res, callback) {
    const headerToken = req?.headers["header-token"] || "";
    const path_data = req?.path?.split("/");

    if (bypass.indexOf(path_data[4]) === -1) {
      if (headerToken !== "") {
        try {
          const findToken = `SELECT 
                                  * 
                              FROM 
                                  tbl_user 
                              WHERE 
                                  token = '${headerToken}' AND is_active = 1 AND is_deleted = 0;`;
          let response;

          conn?.query(findToken, function (error, token) {
            if (!error && token.length > 0) {
              req.user_id = token[0]?.id;
              callback();
            } else {
              response = {
                code: "-1",
                message: t("invalid_token"),
                data: [],
              };

              res.status(401).send(response);
            }
          });
        } catch (error) {
          response = {
            code: "-1",
            message: t("invalid_token"),
            data: [],
          };

          res.status(401).send(response);
        }
      } else {
        response = {
          code: "-1",
          message: t("invalid_token"),
          data: [],
        };

        res.status(401).send(response);
      }
    } else {
      callback();
    }
  },

  // Extracting language
  extractHeaderLanguage: function (req, res, callback) {
    let header_lang =
      req?.headers["accept-language"] != undefined &&
      req?.headers["accept-language"] != ""
        ? req?.headers["accept-language"]
        : "en";
    req.lang = header_lang;
    req.language = header_lang == "en" ? en : en;

    localizify.add("en", en).add("en", en).setLocale(header_lang);

    callback();
  },

  // Convert language
  getMessage: function (language, message, callback) {
    callback(t(message.keyword, message.content));
  },
};

module.exports = middleware;

import { FetchWrapper } from "../Utils/FetchWrapper";
import { URIConstants } from "../Utils/URIConstants";

export function adminLogin(body) {
  return FetchWrapper(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_ADMINAUTH}${URIConstants.ADMINLOGIN_URI}`,
    body,
    "POST"
  );
}

export function login(body) {
  return FetchWrapper(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_AUTH}${URIConstants.LOGIN_URI}`,
    body,
    "POST"
  );
}

export function countryCode(body) {
  return FetchWrapper(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_AUTH}${URIConstants.COUNTRYCODE_URI}`,
    body,
    "POST"
  );
}

export function signup(body) {
  return FetchWrapper(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_AUTH}${URIConstants.SIGNUP_URI}`,
    body,
    "POST"
  );
}

export function logoutUser(body) {
  return FetchWrapper(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_ADMINAUTH}${URIConstants.LOGOUT_URI}`,
    body,
    "POST"
  );
}

export function listBooks(body) {
  return FetchWrapper(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_ADMINHOME}${URIConstants.LISTBOOKS_URI}`,
    body,
    "POST"
  );
}

export function deleteBook(body) {
  return FetchWrapper(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_ADMINHOME}${URIConstants.DELETEBOOK_URI}`,
    body,
    "POST"
  );
}

export function addBook(body) {
  return FetchWrapper(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_ADMINHOME}${URIConstants.ADDBOOK_URI}`,
    body,
    "POST"
  );
}

export function editDetails(body) {
  return FetchWrapper(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_ADMINHOME}${URIConstants.EDITBOOK_URI}`,
    body,
    "POST"
  );
}

export function getCart(body) {
  return FetchWrapper(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}${URIConstants.CART_URI}`,
    body,
    "POST"
  );
}

export function addToCart(body) {
  return FetchWrapper(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}${URIConstants.ADDTOCART_URI}`,
    body,
    "POST"
  );
}

export function order(body) {
  return FetchWrapper(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_HOME}${URIConstants.ORDER_URI}`,
    body,
    "POST"
  );
}

export function getCounts(body) {
  return FetchWrapper(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_ADMINHOME}${URIConstants.COUNTS_URI}`,
    body,
    "POST"
  );
}

export function listOrders(body) {
  return FetchWrapper(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_ADMINHOME}${URIConstants.GETORDERS_URI}`,
    body,
    "POST"
  );
}

export function responseResult(body) {
  return FetchWrapper(
    `${process.env.REACT_APP_API_URL}${process.env.REACT_APP_API_ADMINHOME}${URIConstants.RESPONSEORDER_URI}`,
    body,
    "POST"
  );
}

var messages = {
  required: ":attr is required",
  invaild: ":attr is invalid",

  invalid_key: "Invalid API-KEY",
  invalid_token: "Invalid header token",

  error: "Oops, something went wrong in {error}",
  no_data: "No data found",

  invalid_credentials: "Invalid credentials",
  login_success: "Login successful",

  signup_success: "Signup successful",
  email_exists: "Email is already registered",
  mobile_exists: "Mobile number is already registered",
  username_exists:
    "This username is not available. Kindly use another username",

  logout_success: "Logout Successful",

  country_code_success: "Country codes listed successfully",

  book_add_success: "Book added successfully",
  list_books: "Books listed successfully",
  delete_success: "Deleted the book successfully",
  edit_success: "Edited the book details successfully",

  success_cart: "Added to cart successfully",
  delete_cart: "Cart item deleted successfully",

  order_placed: "Order placed successfully",
  list_order: "Order listed successfully",

  response_success: "Order responded successfully",
  cancel_success: "Cancelled the order successfully",

  book_rejected:
    "Book rejected successfully and the order is updated successfully",
  book_reject_order_fail:
    "Book rejected successfully but something went wrong while updating the order details",
};

module.exports = messages;

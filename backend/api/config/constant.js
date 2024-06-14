const url = `http://localhost:${process.env.PORT}/`;

var globals = {
  THUMBNAIL: `${url}public/thumbnails/`,
  BOOK: `${url}public/books/`,
};

module.exports = globals;

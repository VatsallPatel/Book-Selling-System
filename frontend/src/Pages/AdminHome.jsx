import React, { useContext, useEffect, useState } from "react";
import { deleteBook, listBooks } from "../Service/Service";
import Loader from "../Components/Loader";
import Swal from "sweetalert2";
import { DarkModeContext } from "../Context/DarkModeContext";
import { Link, useNavigate } from "react-router-dom";
import Paginate from "../Components/Paginate";
import { Helmet } from "react-helmet";
import Search from "../Components/Search";
import moment from "moment";
import Cookies from "js-cookie";

function AdminHome() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const booksPerPage = 3;
  const role = Cookies.get("role") || "";

  useEffect(() => {
    if (role !== "admin") {
      navigate(`/`);
    }
  }, []);

  useEffect(() => {
    listBooks({
      search: search,
      page: currentPage,
      limit: booksPerPage,
    }).then((r) => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);

      if (r?.data[0]?.length > 0 && r?.data[1]?.length > 0 && r?.code === "1") {
        setBooks(r?.data[0]);
        setPageCount(Math.ceil(r?.data[1][0]?.total / booksPerPage));
      } else {
        setBooks([]);
      }
    });
  }, [search, currentPage]);

  function makeDelete(id) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
    });
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        allowOutsideClick: false,
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        confirmButtonColor: "green",
        cancelButtonText: "No, cancel!",
        cancelButtonColor: "red",
        background: darkMode ? "black" : "white",
        color: darkMode ? "white" : "black",
      })
      .then((result) => {
        if (result.isConfirmed) {
          deleteBook({ id: id }).then((r) => {
            if (r?.code === "1") {
              Swal.fire({
                title: "Deleted!",
                text: r?.message,
                icon: "success",
                showConfirmButton: false,
                timer: 1000,
                background: darkMode ? "black" : "white",
                color: darkMode ? "white" : "black",
              });

              const afterDeleteBooks = books.filter((item) => {
                if (item?.id !== id) {
                  return true;
                } else {
                  return false;
                }
              });
              setBooks(afterDeleteBooks);
            } else {
              swalWithBootstrapButtons.fire({
                title: "Oops!",
                text: r?.message,
                icon: "error",
                showConfirmButton: false,
                timer: 1000,
                background: darkMode ? "black" : "white",
                color: darkMode ? "white" : "black",
              });
            }
          });
        }
      });
  }

  return (
    <>
      <div
        className="p-0 m-0 col-10"
        style={
          darkMode
            ? { backgroundColor: "#333" }
            : { backgroundColor: "transparent" }
        }
      >
        {loading ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "85vh" }}
          >
            <Loader />
          </div>
        ) : (
          <div>
            <div
              className="d-flex align-items-center justify-content-center my-3"
              style={{ minHeight: "80vh" }}
            >
              <table
                className={`table border ${
                  darkMode ? "table-dark" : "border-dark"
                } text-center mx-5`}
              >
                <thead>
                  <tr>
                    <th colSpan="12" className="text-end">
                      <Link
                        to="/add-book"
                        className={`btn btn-secondary ${
                          darkMode ? "text-white" : "text-dark"
                        }`}
                        style={{ textDecoration: "none" }}
                      >
                        Add Book
                      </Link>
                    </th>
                  </tr>
                  <tr>
                    <th
                      scope="col"
                      colSpan="12"
                      className="text-center align-middle"
                    >
                      <Search values={{ setCurrentPage, setSearch }} />
                    </th>
                  </tr>

                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Title</th>
                    <th scope="col">Author</th>
                    <th scope="col">Thumbnail</th>
                    <th scope="col">Book</th>
                    <th scope="col">Total Pages</th>
                    <th scope="col">Price</th>
                    <th scope="col">Tags</th>
                    <th scope="col">Added Date</th>
                    <th scope="col">View</th>
                    <th scope="col">Edit</th>
                    <th scope="col">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {books?.length > 0 ? (
                    books?.map((v, i) => (
                      <tr key={i}>
                        <th scope="row" className="align-middle">
                          {v?.id}
                        </th>
                        <td className="align-middle">{v?.title}</td>
                        <td className="align-middle">{v?.author}</td>
                        <td className="align-middle">
                          <a
                            href={v?.thumbnail_image}
                            target="_blank"
                            title="Open Thumbnail"
                            rel="noopener noreferrer"
                          >
                            <img
                              src={v?.thumbnail_image}
                              alt="thumbnail"
                              className="img-thumbnail"
                            />
                          </a>
                        </td>
                        <td className="align-middle">
                          <a
                            href={v?.book}
                            target="_blank"
                            title="Open Book"
                            className="btn btn-secondary"
                            rel="noopener noreferrer"
                          >
                            See Book
                          </a>
                        </td>
                        <td className="align-middle">{v?.total_pages}</td>
                        <td className="align-middle">{v?.price}</td>
                        <td className="align-middle">{v?.tags}</td>
                        <td className="align-middle">
                          {moment(v?.created_at).format("DD/MM/YYYY")}
                        </td>
                        <td className="align-middle">
                          <button
                            type="button"
                            className={`btn btn-warning`}
                            onClick={() =>
                              navigate(`/admin-book-detail`, { state: v })
                            }
                          >
                            View
                          </button>
                        </td>
                        <td className="align-middle">
                          <button
                            type="button"
                            className={`btn btn-info`}
                            onClick={() =>
                              navigate(`/edit-detail`, { state: v })
                            }
                          >
                            Edit
                          </button>
                        </td>
                        <td className="align-middle">
                          <button
                            type="button"
                            className={`btn btn-danger align-middle`}
                            onClick={() => makeDelete(v?.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="12" className="text-center align-middle">
                        No Data Found!
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="12" className="text-center align-middle p-3">
                      <Paginate
                        values={{ pageCount, currentPage, setCurrentPage }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Helmet>
        <title>Admin Home</title>
        {darkMode && <body style={{ backgroundColor: "#333" }}></body>}
      </Helmet>
    </>
  );
}

export default AdminHome;

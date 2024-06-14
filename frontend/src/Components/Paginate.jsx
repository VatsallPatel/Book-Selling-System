import React, { useContext } from "react";
import ReactPaginate from "react-paginate";
import { DarkModeContext } from "../Context/DarkModeContext";

function Paginate({ values }) {
  const { pageCount, currentPage, setCurrentPage } = values;
  const { darkMode } = useContext(DarkModeContext);

  return (
    <ReactPaginate
      previousLabel={
        <button
          type="button"
          className={`btn btn-primary ${currentPage === 0 && "disabled"}`}
        >
          Previous
        </button>
      }
      nextLabel={
        <button
          type="button"
          className={`btn btn-primary ${
            currentPage === pageCount - 1 && "disabled"
          }`}
        >
          Next
        </button>
      }
      pageCount={pageCount}
      forcePage={currentPage}
      onPageChange={(e) => setCurrentPage(e.selected)}
      pageLinkClassName={darkMode ? "page-dark-link" : "page-link"}
      containerClassName={"pagination"}
      activeClassName={"active"}
    />
  );
}

export default Paginate;

import React, { useContext } from "react";
import { DarkModeContext } from "../Context/DarkModeContext";

function Search({ values }) {
  const { setCurrentPage, setSearch } = values;
  const { darkMode } = useContext(DarkModeContext);

  return (
    <>
      <form className="form-inline my-3 d-flex flex-row-reverse">
        <input
          className={`form-control mx-auto w-25 ${
            darkMode && "color-placeholder bg-dark text-white"
          }`}
          type="search"
          placeholder="Search"
          aria-label="Search"
          onChange={(e) =>
            setTimeout(() => {
              if (setCurrentPage !== null) {
                setCurrentPage(0);
              }
              setSearch(e.target.value);
            }, 1000)
          }
        />
      </form>
    </>
  );
}

export default Search;

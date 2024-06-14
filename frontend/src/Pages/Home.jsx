import React, { useContext, useEffect, useState } from "react";
import { listBooks } from "../Service/Service";
import Loader from "../Components/Loader";
import { DarkModeContext } from "../Context/DarkModeContext";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Search from "../Components/Search";
import Cookies from "js-cookie";

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { darkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const role = Cookies.get("role") || "";
  const setCurrentPage = null;

  useEffect(() => {
    if (role === "admin") {
      navigate("/admin-home");
    }
  }, []);

  useEffect(() => {
    listBooks({
      search: search,
      page: null,
    }).then((r) => {
      setTimeout(() => {
        setLoading(false);
      }, 1000);

      if (r?.data[0]?.length > 0 && r?.data[1]?.length > 0 && r?.code === "1") {
        console.log(r);
        setBooks(r?.data[0]);
      } else {
        setBooks([]);
      }
    });
  }, [search]);

  return (
    <>
      <div
        className="container-fluid p-0 m-0 listing"
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
            <Search values={{ setCurrentPage, setSearch }} />
            <div
              className="d-flex align-items-center justify-content-center my-3 mx-5"
              style={{ minHeight: "78vh" }}
            >
              <div className="row w-100 m-0 p-0">
                {books?.length > 0 ? (
                  books?.map((v, i) => (
                    <div className="col-md-4 col-12 mb-3" key={i}>
                      <div
                        className={`card w-100 m-0 p-3 ${
                          darkMode ? "bg-dark text-white" : "bg-white text-dark"
                        }`}
                        onClick={() => navigate("/book-detail", { state: v })}
                        style={{ width: "100%", height: "500px" }}
                      >
                        <img
                          className={`card-img-top border ${
                            darkMode ? "border-white" : "border-dark"
                          }`}
                          src={v?.thumbnail_image}
                          alt="Card image"
                          style={{ width: "100%", height: "60%" }}
                        />
                        <div className="card-body">
                          <h4 className="card-title">{v?.title}</h4>
                          <h5 className="card-title">{v?.author}</h5>
                          <p className="card-text">{v?.tags}</p>
                          <a
                            href={v?.book}
                            target="_blank"
                            title="Open Book"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                          >
                            See Book
                          </a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="d-flex justify-content-center">
                  <div
                  className={`alert ${
                    darkMode ? "alert-secondary" : "alert-warning"
                  } w-50`}
                >
                  No Books Found!
                </div>
                </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Helmet>
        <title>Home</title>
      </Helmet>
    </>
  );
}

export default Home;

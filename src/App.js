import React, { useState, useEffect } from "react";
import { Table, Pagination } from "react-bootstrap";
import axios from "axios";

function App() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [limit, setLimit] = useState(10);
  const [order, setOrder] = useState("desc");
  const [sortAttr, setSortAttr] = useState("title");
  const url = process.env.REACT_APP_URL;
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        `${url}?pageSize=${itemsPerPage}&offset=${offset}&order=${order}&sortAttr=${sortAttr}`
      );
      setData(result.data);
    };
    fetchData();
  }, [itemsPerPage, offset, order, sortAttr]);
  const handlePageChange = (page) => {
    if (page < 1) {
      setCurrentPage(1);
      setOffset(offset <= 0 ? 0 : offset - itemsPerPage);
    } else if (page > totalPages) {
      setCurrentPage(totalPages);
      setOffset(offset <= 0 ? itemsPerPage : itemsPerPage + offset);
    } else {
      setCurrentPage(page);
    }
    // setOffset(offset == 0 ? itemsPerPage : itemsPerPage + offset)
  };

  const handleLimitChange = (e) => {
    setLimit(parseInt(e.target.value));
    setCurrentPage(1);
    setItemsPerPage(parseInt(e.target.value));
  };

  const handleSortChange = (attr) => {
    if (sortAttr === attr) {
      setOrder(order === "desc" ? "asc" : "desc");
    } else {
      setSortAttr(attr);
      setOrder("desc");
    }
    setCurrentPage(1);
  };

  const currentItems = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const pageButtons = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === currentPage - 1 ||
      i === currentPage ||
      i === currentPage + 1 ||
      i === totalPages
    ) {
      pageButtons.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
          style={{
            borderRadius: "0",
            minWidth: "40px",
            minHeight: "40px",
            margin: "5px",
          }}
        >
          {i}
        </Pagination.Item>
      );
    }
  }

  const previousPageButton = (
    <Pagination
      disabled={currentPage === 1}
      onClick={() => handlePageChange(currentPage - 1)}
      style={{
        borderRadius: "0",
        minWidth: "40px",
        minHeight: "40px",
        margin: "5px",
      }}
    />
  );

  const nextPageButton = (
    <Pagination
      disabled={currentPage === totalPages}
      onClick={() => handlePageChange(currentPage + 1)}
      style={{
        borderRadius: "0",
        minWidth: "40px",
        minHeight: "40px",
        margin: "5px",
      }}
    />
  );

  return (
    <>
      <div className="limit-input">
        <label htmlFor="limit-input">Limit per page: </label>
        <input
          type="number"
          min="1"
          max="100"
          value={limit}
          onChange={handleLimitChange}
          id="limit-input"
          style={{ marginLeft: "5px" }}
        />
      </div>
      <p>
        Page {Math.ceil(1+ offset/10)} of : {Math.ceil(1000 / limit)}
      </p>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSortChange("film.rental_rate")}>
              Rental rate{" "}
              {sortAttr === "film.rental_rate" &&
                (order === "desc" ? "▼" : "▲")}
            </th>
            <th onClick={() => handleSortChange("name")}>
              Category {sortAttr === "name" && (order === "desc" ? "▼" : "▲")}
            </th>
            <th onClick={() => handleSortChange("title")}>
              Title {sortAttr === "title" && (order === "desc" ? "▼" : "▲")}
            </th>

            <th onClick={() => handleSortChange("rating")}>
              Rating {sortAttr === "rating" && (order === "desc" ? "▼" : "▲")}
            </th>
            <th onClick={() => handleSortChange("nbOfRentals")}>
              Number of rentals{" "}
              {sortAttr === "nbOfRentals" && (order === "desc" ? "▼" : "▲")}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item) => (
            <tr key={item.id}>
              <td>{item.rental_rate}</td>
              <td>{item.name}</td>
              <td>{item.title}</td>
              <td>{item.rating}</td>
              <td>{item.nbOfRentals}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        className="justify-content-center"
        itemsPerPage={itemsPerPage}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      >
        <Pagination.Prev
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />
        {pageButtons}
        <Pagination.Next
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </Pagination>
    </>
  );
}

export default App;

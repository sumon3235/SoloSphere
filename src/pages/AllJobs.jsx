/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import axios from "axios";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  // get All jobs Count from DataBase
  useEffect(() => {
    fetch(`${import.meta.env.VITE_APIURL}/jobs-count`)
      .then((res) => res.json())
      .then((data) => setCount(data.count));
  }, []);
  console.log(count);

  const numberOfPage = Math.ceil(count / itemsPerPage);
  const pages = [...Array(numberOfPage).keys()];

  useEffect(() => {
    const fetchAllTheJobs = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_APIURL}/get-allJobs?filter=${filter}&search=${search}&sort=${sort}&page=${currentPage}&size=${itemsPerPage}`,
      );
      setJobs(data);
    };
    fetchAllTheJobs();
    console.log(filter);
    console.log(search);
    console.log(sort);
  }, [filter, search, sort, currentPage, itemsPerPage]);

  const handleSubmitSearch = (e) => {
    e.preventDefault();
  };
  const handleReset = () => {
    setFilter("");
    setSearch("");
    setSort("");
  };

  return (
    <div className="container px-6 py-10 mx-auto min-h-[calc(100vh-306px)] flex flex-col justify-between">
      <div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-5 ">
          <div>
            <select
              onChange={(e) => setFilter(e.target.value)}
              value={filter}
              name="category"
              id="category"
              className="border p-4 rounded-lg"
            >
              <option value="">Filter By Category</option>
              <option value="Web Development">Web Development</option>
              <option value="Graphics Design">Graphics Design</option>
              <option value="Digital Marketing">Digital Marketing</option>
            </select>
          </div>

          <form onSubmit={handleSubmitSearch}>
            <div className="flex p-1 overflow-hidden border rounded-lg    focus-within:ring focus-within:ring-opacity-40 focus-within:border-blue-400 focus-within:ring-blue-300">
              <input
                defaultValue={search}
                onBlur={(e) => setSearch(e.target.value)}
                className="px-6 py-2 text-gray-700 placeholder-gray-500 bg-white outline-none focus:placeholder-transparent"
                type="text"
                name="search"
                placeholder="Enter Job Title"
                aria-label="Enter Job Title"
              />

              <button className="px-1 md:px-4 py-3 text-sm font-medium tracking-wider text-gray-100 uppercase transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:bg-gray-600 focus:outline-none">
                Search
              </button>
            </div>
          </form>

          <div>
            <select
              name="category"
              onChange={(e) => setSort(e.target.value)}
              value={sort}
              id="category"
              className="border p-4 rounded-md"
            >
              <option disabled value="">
                Sort By Deadline
              </option>
              <option value="dsc">Descending Order</option>
              <option value="asc">Ascending Order</option>
            </select>
          </div>
          <button onClick={handleReset} className="btn">
            Reset
          </button>
        </div>
        <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job}></JobCard>
          ))}
        </div>
      </div>

      {/* Pagination btn */}
      <div className="flex justify-center items-center my-12 gap-3">
        {/* Previous Button */}
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {pages.map((page) => (
          <div key={page} className="text-center my-7">
            <button
              onClick={() => setCurrentPage(page)}
              className={
                currentPage === page
                  ? "bg-blue-600 text-white px-4 py-2 rounded-md"
                  : "px-4 py-2 bg-gray-200 rounded-md"
              }
            >
              {page}
            </button>
          </div>
        ))}
        {/* Next Button */}
        <button
          disabled={currentPage === numberOfPage - 1}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AllJobs;

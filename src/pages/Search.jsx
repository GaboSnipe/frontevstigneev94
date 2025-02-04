import axios from "../axios";
import React, { useEffect, useState } from "react";
import { ProductElement, SearchPagination } from "../components";
import { nanoid } from "nanoid";

const Search = () => {
  const [isAdmin, setISAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    axios.get('/auth/me')
      .then(response => {
        if (response.data.roles.includes("ADMIN")) {
          setISAdmin(true);
        }
      })
      .catch(error => {
        console.error('Ошибка при получении данных:', error);
      });
  }, []);
  const handleSearch = async (e) => {
    e.preventDefault();
    setCurrentPage(prevState => 1);
    setSearchTerm(prevState => e.target.search.value);
    try {
      const response = await axios(
        `/products?q=${e.target.search.value}&_page=${currentPage}`
      );
      const data = response.data;
      setProducts(data);
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleSearchPagination = async () => {
    try {
      const response = await axios(
        `/products?q=${searchTerm}&_page=${currentPage}`
      );
      const data = response.data;
      setProducts(data);
    } catch (error) {
      console.log(error.response);
    }
  }

  return (
    <>

      <form
        className="form-control max-w-7xl mx-auto py-10 px-10"
        onSubmit={handleSearch}
      >
        <div className="input-group">
          <input
            type="text"
            placeholder="поиск тут..."
            className="input input-bordered input-lg w-full outline-0 focus:outline-0"
            name="search"
          />
          <button
            type="submit"
            className="btn btn-square btn-lg bg-blue-600 hover:bg-blue-500 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>
      {searchTerm && products.length !== 0 && <h2 className="text-center text-6xl my-10 max-lg:text-4xl max-sm:text-2xl max-sm:my-5 text-accent-content">поиск результата по запросу "{searchTerm}"</h2>}
      {products.length === 0 && searchTerm && <h2 className="text-center text-6xl my-10 max-lg:text-4xl max-sm:text-2xl max-sm:my-5 text-accent-content">ничего не найдено по запросу "{searchTerm}"</h2>}
      <div className="grid grid-cols-4 px-2 max-w-7xl mx-auto gap-y-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 shop-products-grid">
        {products && Array.isArray(products) &&
          products.map((product) => (
            <ProductElement
              isAdmin={isAdmin}
              key={nanoid()}
              id={product._id}
              title={product.name}
              image={`https://backendevstigneev94.onrender.com${product.imageUrl}`}
              rating={product.rating}
              price={product.price}
              brandName={product.brandName}
            />
          ))}


      </div>
      <SearchPagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        products={products}
        handleSearchPagination={handleSearchPagination}
      />
    </>
  );
};

export default Search;

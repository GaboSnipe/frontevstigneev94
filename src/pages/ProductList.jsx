import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axios";
import { nanoid } from "nanoid";
import { SingleProductReviews } from "../components";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const loginState = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const getProducts = async () => {
    try {
      const response = await axios.get("/products");
      setProducts(response.data);
      console.log(products);
    } catch (error) {
      toast.error(error.response?.data?.message || "Ошибка при получении данных");
    }
  };
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    axios.get('/auth/me')
      .then(response => {
        if (response.data.roles.includes("ADMIN")) {
          setIsAdmin(true);
        } else {
          navigate("/");
        }
      })
      .catch(error => {
        console.error('Ошибка при получении данных:', error);
      });
  }, [navigate]);

  useEffect(() => {
    getUserInfo(products.review);
    if (!loginState) {
      toast.error("Вы должны быть залогинены");
      navigate("/");
    } else {
      getProducts();
    }
  }, [loginState, navigate]);

  const getUserInfo = (review) => {
    axios.get(`/user/${review?.userId}`)
      .then(response => {
        setUserObj(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных:', error);
      });
    };
  const handleReviewDelete = (productId, reviewIndex) => {
    const updatedProducts = products.map(product => {
      if (product._id === productId) {
        product.reviews.splice(reviewIndex, 1);
      }
      return product;
    });
    setProducts(updatedProducts);
  };

  return (
    <div className="order-history-main max-w-7xl mx-auto mt-10 px-20 max-md:px-10">
      {products.length === 0 ? (
        <div className="text-center">
          <h1 className="text-4xl text-accent-content">
            Товары не найдены
          </h1>
          <Link
            to="/admin-panel"
            className="btn bg-blue-600 hover:bg-blue-500 text-white mt-10"
          >
            Назад
          </Link>
        </div>
      ) : (
        products.map(product => (
          <div key={nanoid()} className="collapse collapse-plus bg-base-200 mb-2">
            <input type="checkbox" name={`my-accordion-${product._id}`} />
            <div className="collapse-title text-xl font-medium text-accent-content">
              {product.name}
            </div>
            <div className="collapse-content">
              <div className="overflow-x-auto">
                <table className="table max-sm:table-xs table-pin-rows table-pin-cols">
                  <thead>
                    <tr className="text-accent-content">
                      <th>Категория</th>
                      <th>Описание</th>
                      <th>Доступные размеры</th>
                      <th>В наличии</th>
                      <th>Изображение</th>
                      <th>Дополнительные изображения</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-accent-content">
                      <td>{product.category}</td>
                      <td>{product.description}</td>
                      <td>{product.availableSizes.join(", ")}</td>
                      <td>{product.isInStock ? "Да" : "Нет"}</td>
                      <td>
                        <img src={`https://backendevstigneev94.onrender.com${product.imageUrl}`} alt={product.name} className="w-20 h-20 object-cover" />
                      </td>
                      <td>
                        {product.additionalImageUrls && product.additionalImageUrls.length > 0 ? (
                          product.additionalImageUrls.map((url, imgIndex) => (
                            <img key={nanoid()} src={`https://backendevstigneev94.onrender.com${url}`} alt={`${product.name} ${imgIndex}`} className="w-20 h-20 object-cover mb-2" />
                          ))
                        ) : (
                          <span>Нет дополнительных изображений</span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {product.reviews.length > 0 && (
              <>
                <SingleProductReviews productData={product} />
               </>
               )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;

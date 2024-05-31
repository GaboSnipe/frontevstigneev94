import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axios";
import { nanoid } from "nanoid";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const loginState = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const getProducts = async () => {
    try {
      const response = await axios.get("/products");
      setProducts(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Ошибка при получении данных");
    }
  };

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
    if (!loginState) {
      toast.error("Вы должны быть залогинены");
      navigate("/");
    } else {
      getProducts();
    }
  }, [loginState, navigate]);

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
              <h3 className="text-2xl font-medium mt-4">Отзывы:</h3>
              {product.reviews.map((review, reviewIndex) => (
                <div key={nanoid()} className="review my-4 p-4 bg-base-300 rounded-lg">
                  <div className="flex items-center mb-2">
                    <img src={review.userImage} alt={review.username} className="w-10 h-10 rounded-full mr-2" />
                    <div>
                      <h4 className="text-lg font-medium">{review.username}</h4>
                      <p className="text-sm text-gray-500">{review.location}</p>
                    </div>
                  </div>
                  <div className="rating mb-2">
                    {Array.from({ length: review.rating }).map((_, starIndex) => (
                      <span key={starIndex} className="text-yellow-500">★</span>
                    ))}
                    {Array.from({ length: 5 - review.rating }).map((_, starIndex) => (
                      <span key={starIndex} className="text-gray-300">★</span>
                    ))}
                  </div>
                  <h5 className="text-lg font-medium">{review.reviewTitle}</h5>
                  <p>{review.reviewText}</p>
                  <p className="text-sm text-gray-500">{review.date}</p>
                  {isAdmin && (
                    <button
                      onClick={() => handleReviewDelete(product._id, reviewIndex)}
                      className="btn btn-error mt-2"
                    >
                      Удалить отзыв
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductList;

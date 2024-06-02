import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../features/cart/cartSlice";
import { toast } from "react-toastify";
import axios from "../axios";

const ProductElement = ({ id, title, image, rating, price, brandName, isAdmin }) => {
  const isEditable = true;
  const product = {
    id, title, image, rating, price, brandName, amount: 1
  };

  const [showConfirmation, setShowConfirmation] = useState(false);

  

  const removeProduct = async () => {
    try {
      const response = await axios.delete(`/products/${id}`);
      toast.success('Продукт успешно удален:');
      return true;
    } catch (error) {
      toast.error('Ошибка при удалении продукта:', error);
      return false;
    }
  };


  const handleRemoveProduct = () => {
    setShowConfirmation(true);
  };

  const confirmRemoveProduct = () => {
    removeProduct();
    setShowConfirmation(false);
  };

  const cancelRemoveProduct = () => {
    setShowConfirmation(false); // Закрываем модальное окно без удаления
  };


  return (
    <div className="max-w-2xl">
      <div className="shadow-md rounded-lg max-w-sm bg-base-100">
        <Link to={`/shop/product/${id}`} onClick={() => window.scrollTo(0, 0)}>
          <img
            className="rounded-t-lg p-8"
            src={`${image}`}
            alt="product image"
          />
        </Link>
        <div className="px-5 pb-5">
          <Link to={`/shop/product/${id}`} onClick={() => window.scrollTo(0, 0)}>
            <h3 className="font-semibold text-xl tracking-tight mb-5 text-accent-content">
              {title}
            </h3>
          </Link>
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-accent-content">₽{price}</span>
            {isAdmin && (
              <>
                <button
                  type="button"
                  onClick={handleRemoveProduct}
                  className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:border-red-700 focus:ring-red active:bg-red-700 transition ease-in-out duration-150"
                >
                  Удалить
                </button>
                <Link
                  to={`/productcreate/${id}`}
                  className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:border-yellow-700 focus:ring-yellow active:bg-yellow-700 transition ease-in-out duration-150"
                >
                  Изменить
                </Link>
                {showConfirmation && (
                  <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-75 z-50">
                    <div className="bg-white p-8 rounded-md shadow-lg">
                      <p>Вы уверены, что хотите удалить продукт?</p>
                      <div className="mt-4 flex justify-center">
                        <button
                          onClick={confirmRemoveProduct}
                          className="px-4 py-2 mr-4 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          Да
                        </button>
                        <button
                          onClick={cancelRemoveProduct}
                          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductElement;

import React, { useState, useRef } from 'react';
import { CartItemsList, CartTotals } from '../components';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Payd from './Payd';
import Payfinal from './Payfinal';
import axios from '../axios'; // Убедитесь, что axios импортирован

const Cart = () => {
  const [ver, setVer] = useState(false);
  const [showThirdButton, setShowThirdButton] = useState(false);
  const [selectedFinalItem, setSelectedFinalItem] = useState(null);
  const [formData, setFormData] = useState(null);
  const formRef = useRef(null);
  
  const navigate = useNavigate();
  const loginState = useSelector((state) => state.auth.isLoggedIn);
  const { cartItems, total } = useSelector((state) => state.cart); // Добавьте total из состояния Redux

  useEffect(() => {
        if (!loginState) {
          navigate("/")
        }
  })

  const isCartEmpty = () => {
    if (cartItems.length === 0) {
      toast.error("Ваша корзина пуста");
    } else {
      setVer(true);
    }
  };
  const clearUserCart = async (userId) => {
    try {
      const response = await axios.delete(`/clear-cart/${userId}`);

    } catch (error) {
      console.error('Произошла ошибка при очистке корзины пользователя:', error);
    }
  };

  const saveToOrderHistory = async (formData, selectedFinalItem) => {
    try {
      const response = await axios.post("/orders", {
        userId: localStorage.getItem("id"),
        orderStatus: "в процесе обработки",
        cartItems: cartItems,
        formData: formData,
        selectedItem: selectedFinalItem
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Произошла ошибка при сохранении заказа");
    }
  };

  const handleFormSubmit = (data) => {
    setFormData(data);
    setShowThirdButton(true);
  };

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.submitForm();
    }
  };

  const handleThirdButtonClick = () => {
    if (!selectedFinalItem) {
      toast.error("выберите способ оплаты");
    } else {
      saveToOrderHistory(formData, selectedFinalItem);
      clearUserCart(localStorage.getItem("id"));
      navigate("/thank-you");
    }
  };
  
  const handleFinalItemSelect = (item) => {
    setSelectedFinalItem(item);
  };


  return (
    <>
      <div className='mt-8 grid gap-8 lg:grid-cols-12 max-w-7xl mx-auto px-10'>
        <div className='lg:col-span-8'>
          {ver ? (
            showThirdButton ? (
              <Payfinal onSelectItem={handleFinalItemSelect} />
            ) : (
              <Payd ref={formRef} onFormSubmit={handleFormSubmit} />
            )
          ) : (
            <CartItemsList />
          )}
        </div>
        <div className='lg:col-span-4 lg:pl-4'>
          <CartTotals />
          {loginState ? (
            <>
              {ver ? (
                showThirdButton ? (
                  <button onClick={handleThirdButtonClick} className='btn bg-green-600 hover:bg-green-500 text-white btn-block mt-8'>
                    Оплатить
                  </button>
                ) : (
                  <button onClick={handleSubmit} className='btn bg-blue-600 hover:bg-blue-500 text-white btn-block mt-8'>
                    <span className="inline-block mr-2">Продолжить</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-4 h-4 inline-block"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </button>
                )
              ) : (
                <button onClick={isCartEmpty} className='btn bg-blue-600 hover:bg-blue-500 text-white btn-block mt-8'>
                  Приобрести сейчас
                </button>
              )}
            </>
          ) : (
            <Link to='/login' className='btn bg-blue-600 hover:bg-blue-500 btn-block text-white mt-8'>
              Залогиньтесь
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;

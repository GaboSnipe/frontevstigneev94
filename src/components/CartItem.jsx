import { useDispatch } from "react-redux";
import { removeItem, updateCartAmount } from "../features/cart/cartSlice";
import { toast } from "react-toastify";
import axios from "../axios";
import React, { useState, useEffect } from "react";

const CartItem = ({ cartItem }) => {
  const [userObj, setuserObj] = useState(null);

  const { id, title, price, image, amount, brandName, selectedSize } = cartItem;

  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('/auth/me')
      .then(response => {
        setuserObj(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных:', error);
      });
  }, []);

  const removeFromCartHandler = async (product) => {
    if (!userObj) {
      console.error('User object is not set');
      return;
    }
    try {
      await axios.put(`/users/${userObj._id}/cart/remove`, { item: product.id });
      const updatedUserObj = await axios.get('/auth/me');
      dispatch(removeItem({ userObj: updatedUserObj.data }));
      toast.success('Элемент удален из списка желаний');
    } catch (error) {
      console.error('Ошибка при удалении элемента из списка желаний:', error);
      toast.error('Произошла ошибка при удалении элемента из списка желаний');
    }
  };

  return (
    <article
      key={id}
      className="mb-12 flex flex-col gap-y-4 sm:flex-row flex-wrap border-b border-base-300 pb-6 last:border-b-0"
    >
      {/* IMAGE */}
      <img
        src={`https://backendevstigneev94.onrender.com${image}`}
        alt={title}
        className="h-24 w-24 rounded-lg sm:h-32 sm:w-32 object-cover"
      />
      {/* INFO */}
      <div className="sm:ml-16 sm:w-48">
        {/* TITLE */}
        <h3 className="capitalize font-medium text-accent-content">{title}</h3>
        {/* COMPANY */}
        <h4 className="mt-2 capitalize text-sm text-accent-content">
          Производитель: {brandName}
        </h4>
        <h4 className="mt-2 capitalize text-sm text-accent-content">
          Тип: {selectedSize}
        </h4>
      </div>
      <div className="sm:ml-12">
        {/* AMOUNT */}
        <div className="form-control max-w-xs">
          <label htmlFor="amount" className="label p-0">
            <span className="label-text text-accent-content">Количество</span>
          </label>
          <input
            name="number"
            id="amount"
            className="mt-2 input input-bordered input-sm w-full max-w-xs text-accent-content"
            value={amount}
            onChange={(event) => dispatch(updateCartAmount({ id: id, amount: event.target.value }))}
          />
        </div>
        {/* REMOVE */}
        <button
          className="mt-2 link link-warning link-hover text-sm text-accent-content"
          onClick={() => removeFromCartHandler(cartItem)}
        >
          Удалить
        </button>
      </div>

      {/* PRICE */}
      <p className="font-medium sm:ml-auto text-accent-content">&#x20bd;{(price * amount).toFixed(2)}</p>
    </article>
  );
};

export default CartItem;

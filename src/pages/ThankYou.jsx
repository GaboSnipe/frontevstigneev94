import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";
import { toast } from "react-toastify";
import { store } from "../store";
import { calculateTotals, clearCart } from "../features/cart/cartSlice";

const ThankYou = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const loginState = useSelector((state) => state.auth.isLoggedIn);
  const { total } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const saveToOrderHistory = async () => {
    try {
      const response = await axios.post("/orders", {
        userId: localStorage.getItem("id"),
        orderStatus: "in progress",
        subtotal: total,
        cartItems: cartItems,
      });
    } catch (err) {
      toast.error(err.response);
    }
  };

  if (cartItems.length > 0) {
    saveToOrderHistory();
    store.dispatch(clearCart());
    store.dispatch(calculateTotals());
  }

  useEffect(() => {
    if (!loginState) {
      toast.error("вы должны быть залогинени");
      navigate("/");
    }
  }, []);


  return (
    <>
      <div className="thankyou-content text-center text-accent-content px-10 max-w-7xl mx-auto">
        <h2 className="text-6xl max-sm:text-4xl">
          спасибо за покупку!
        </h2>

        <h3 className="text-2xl mt-10 max-sm:text-xl">
          надеюс вам понравится покупка и вы вернетесь ише
        </h3>
        <h3 className="text-2xl mt-5 max-sm:text-xl">
           Вот что вы можете сделать дальше:
        </h3>
        <ul className="text-xl mt-5 text-blue-500 max-sm:text-lg">
          <li className="hover:text-blue-600 cursor-pointer">
            <Link to="/order-history">&rarr; посмотреть историю покупок &larr;</Link>
          </li>
          <li className="hover:text-blue-600 cursor-pointer">
            <Link to="/">&rarr; посмотреть больше продуктои и купить &larr;</Link>
          </li>
        </ul>

        <h4 className="text-xl mt-5 max-sm:text-lg">
          спасибо за вашу покупку!
        </h4>
      </div>
    </>
  );
};

export default ThankYou;

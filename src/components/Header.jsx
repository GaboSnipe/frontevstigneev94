import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaHeadphones, FaRegEnvelope, FaHeart, FaSun, FaMoon, FaWindowClose } from "react-icons/fa";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";
import { AiFillShopping } from "react-icons/ai";
import "../styles/Header.css";
import { useDispatch, useSelector } from "react-redux";
import { changeMode } from "../features/auth/authSlice";
import { store } from "../store";
import axios from "../axios";
import { clearWishlist, updateWishlist } from "../features/wishlist/wishlistSlice";
import { fetchAuthMe, selectIsAuth } from "../redux/slices/auth";
import { calculateTotals, updateCart } from "../features/cart/cartSlice";

const Header = () => {
  const { amount, total } = useSelector((state) => state.cart);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setISAdmin] = useState(false);
  const [userObj, setuserObj] = useState(null);
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.auth);
  const loginState = useSelector((state) => state.auth.isLoggedIn);

  const fetchWishlist = async () => {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      if (loginState) {
        try {
          const getResponse = await axios.get(`/auth/me`);
          
          const userObj = getResponse.data;
          if (getResponse.data.roles.includes("ADMIN")) {
            setISAdmin(true);
          }
          setuserObj(userObj);
          store.dispatch(updateWishlist({ userObj }));
          store.dispatch(updateCart({ userObj }));
          store.dispatch(calculateTotals({ userObj }));
          return;
        } catch (error) {
          attempts += 1;
          console.error(`Attempt ${attempts} failed:`, error);
          if (attempts >= maxAttempts) {
            console.error('Max attempts reached. Could not fetch wishlist.');
          }
        }
      } else {
        store.dispatch(clearWishlist());
        return;
      }
    }
  };

  useEffect(() => {
    setIsLoggedIn(loginState);
    setISAdmin(false);
    fetchWishlist();
  }, [loginState]);

  
  

  return (
    <>
      <div className="navbar bg-base-100 max-w-7xl mx-auto">
        <div className="flex-1">
          <Link
            to="/"
            className="btn btn-ghost normal-case text-2xl font-black text-accent-content"
          >
            <AiFillShopping />
            Sania's Shop
          </Link>
        </div>
        <div className="flex-none">
          <Link
            to="/search"
            className="btn btn-ghost btn-circle text-accent-content"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
          </Link>
          <button
            className="text-accent-content btn btn-ghost btn-circle text-xl"
            onClick={() => dispatch(changeMode())}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          {isLoggedIn && (
            <Link
              to="/wishlist"
              className="btn btn-ghost btn-circle text-accent-content"
            >
              <FaHeart className="text-xl" />
            </Link>
          )}
          {isLoggedIn && (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
              </label>
              <div
                tabIndex={0}
                className="mt-3 z-[1] card card-compact dropdown-content w-52 bg-base-100 shadow"
              >
                <div className="card-body">
                  <span className="font-bold text-lg text-accent-content">
                    {amount} вещей
                  </span>
                  <span className="text-info text-accent-content">
                    общая цена: &#x20bd;{total.toFixed(2)}
                  </span>
                  <div className="card-actions">
                    <Link
                      to="/cart"
                      className="btn bg-blue-600 btn-block text-white hover:bg-blue-500 text-base-content"
                    >
                      посмотреть корзину
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
          {isLoggedIn && (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img src={`https://backendevstigneev94.onrender.com${userObj?.avatarUrl}`} />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <Link
                    to="/user-profile"
                    className="justify-between text-accent-content"
                  >
                    Профиль
                  </Link>
                </li>
                <li>
                  <Link to="/order-history" className="text-accent-content">
                    История Покупок
                  </Link>
                </li>
                {isAdmin &&
                <li>
                  <Link to="/admin-panel" className="text-accent-content  text-purple-600 hover:text-purple-500">
                    Админ Панель
                  </Link>
                </li>}
                <li>
                  <Link to="/login" className="text-accent-content text-red-600 hover:text-red-500">
                    Выйти
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="navbar-bottom-menu border-y border-gray-800">
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="my-drawer" className="btn drawer-button">
              <HiMiniBars3BottomLeft className="text-4xl" />
            </label>
          </div>
          <div className="drawer-side z-10">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content mt-4">
              <label htmlFor="my-drawer" className="btn drawer-button">
                <FaWindowClose className="text-3xl ml-auto" />
              </label>
              <li className="text-xl">
                <NavLink className="text-accent-content" to="/">
                  Дом
                </NavLink>
              </li>
              <li className="text-xl">
                <NavLink className="text-accent-content" to="/shop">
                  Каталог
                </NavLink>
              </li>
              {!isLoggedIn && (
                <>
                  <li className="text-xl">
                    <NavLink className="text-accent-content" to="/login">
                      Войти
                    </NavLink>
                  </li>
                  <li className="text-xl">
                    <NavLink className="text-accent-content" to="/register">
                      Регистрация
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="container text-2xl navlinks-container">
          <NavLink className="text-accent-content" to="/">
            Дом
          </NavLink>
          <NavLink className="text-accent-content" to="/shop">
            Каталог
          </NavLink>
          {!isLoggedIn && (
            <>
              <NavLink className="text-accent-content" to="/login">
                Войти
              </NavLink>
              <NavLink className="text-accent-content" to="/register">
                Регистрация
              </NavLink>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;

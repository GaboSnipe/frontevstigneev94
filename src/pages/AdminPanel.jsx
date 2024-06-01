import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useSelector } from "react-redux";
import { Link, useNavigate, NavLink } from "react-router-dom";
import "../styles/globalstyles.css";
import { toast } from "react-toastify";
import { FaHeadphones, FaRegEnvelope, FaHeart, FaSun, FaMoon, FaWindowClose } from "react-icons/fa";
import { HiMiniBars3BottomLeft } from "react-icons/hi2";

const AdminPanel = () => {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState('');
  const [delEmail, setDelEmail] = useState("");
  const [isAdmin, setISAdmin] = useState(false);
  const loginState = useSelector((state) => state.auth.isLoggedIn);

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/auth/me')
      .then(response => {
        if (response.data.roles.includes("ADMIN")) {
          setISAdmin(true);
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
      toast.error("вы должны быть залогинены");
      navigate("/");
    }
  }, [loginState, navigate]);

  const addToBlackList = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/blacklist', { email, reason });
      toast.success(response.data.message);
      setEmail('');
      setReason('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Произошла ошибка при добавлении в черный список');
    }
  };
  const removeFromBlackList = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete('/blacklist/remove', { data: { email: delEmail } });
      toast.success(response.data.message);
      setDelEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Произошла ошибка при удалении из черного списка');
    }
  };

  return (
    <div>
      <div className="navbar-bottom-menu">
        <div className="container d-flex justify-content-center align-items-center mt-5 text-2xl navlinks-container">
          <NavLink className="btn bg-purple-600 hover:bg-purple-500 text-white btn-sm mx-2" to="/productlist">
            Товары
          </NavLink>
          <NavLink className="btn bg-purple-600 hover:bg-purple-500 text-white btn-sm mx-2" to="/userlist">
            Пользователи
          </NavLink>
          <NavLink className="btn bg-purple-600 hover:bg-purple-500 text-white btn-sm mx-2" to="/orderlist">
            Заказы
          </NavLink>
        </div>
      </div>
      <div className="flex justify-center items-start p-10 xs:p-0 mx-auto md:w-full md:max-w-6xl space-x-10">
        {/* Форма добавления в черный список */}
        <div className="w-1/2 p-5">
          <div className="text-2xl">
            <p className="text-accent-content">Добавление почты в черный список</p>
          </div>
          <form className="px-5 py-7" onSubmit={addToBlackList}>
            <label className="font-semibold text-sm pb-1 block text-accent-content">Почта</label>
            <input
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            />
            <label className="font-semibold text-sm pb-1 block text-accent-content">Причина</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            />
            <button
              type="submit"
              className="transition duration-200 bg-blue-600 hover:bg-blue-500 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
            >
              <span className="inline-block mr-2">Подтвердить</span>
            </button>
          </form>
        </div>
        {/* Форма удаления из черного списка */}
        <div className="w-1/2 p-5">
          <div className="text-2xl">
            <p className="text-accent-content">Добавление почты в черный список</p>
          </div>
          <form className="px-5 py-7" onSubmit={removeFromBlackList}>
            <label className="font-semibold text-sm pb-1 block text-accent-content">Почта</label>
            <input
              value={delEmail}
              required
              onChange={(e) => setDelEmail(e.target.value)}
              type="email"
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            />
            <button
              type="submit"
              className="transition duration-200 bg-blue-600 hover:bg-blue-500 focus:bg-blue-700 focus:shadow-sm focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 text-white w-full py-2.5 rounded-lg text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
            >
              <span className="inline-block mr-2">Подтвердить</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

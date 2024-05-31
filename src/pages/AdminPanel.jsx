import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../styles/globalstyles.css"
import { toast } from "react-toastify";


const AdminPanel = () => {
  const [isAdmin, setISAdmin] = useState(false);
  const loginState = useSelector((state) => state.auth.isLoggedIn);


  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/auth/me')
      .then(response => {
        if (response.data.roles.includes("ADMIN")) {
          setISAdmin(true);
        }else{
          navigate("/");
        }
      })
      .catch(error => {
        console.error('Ошибка при получении данных:', error);
      });
  }, []);

  useEffect(() => {
    if (!loginState) {
      toast.error("вы должны быть залогинены");
      navigate("/");
    } else {
    }
  }, []);
  return (
      <div className="container">
        <div className="btn bg-blue-600 hover:bg-blue-500 text-white" style={{ marginTop: '100px', marginBottom: '100px' }}>
          <Link to="/productlist">Товары</Link>
        </div>
                <div className="btn bg-blue-600 hover:bg-blue-500 text-white" style={{ marginTop: '100px', marginBottom: '100px' }}>
          <Link to="/userlist">Пользователи</Link>
        </div>
        <div className="btn bg-blue-600 hover:bg-blue-500 text-white" style={{ marginTop: '100px', marginBottom: '100px' }}>
          <Link to="/orderlist">Заказы</Link>
        </div>
      </div>
  );
};

export default AdminPanel;

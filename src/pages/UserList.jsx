import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axios";
import { nanoid } from "nanoid";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const loginState = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const getAllUsers = async () => {
    try {
      const response = await axios.get("/users");
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Ошибка при получении данных");
    }
  };

  const handleSearch = () => {
    const filtered = users.filter(user => {
      const fullName = `${user.name} ${user.lastname}`;
      return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        new Date(user.createdAt).toLocaleDateString().includes(searchTerm);
    });
    setFilteredUsers(filtered);
  };

  const makeAdmin = async (userId) => {
    try {
      await axios.post(`/users/${userId}/admin`);
      toast.success("Пользователь успешно сделан администратором");
      getAllUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Ошибка при сделке пользователя администратором");
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
      getAllUsers();
    }
  }, [loginState, navigate]);

  return (
    <div className="order-history-main max-w-7xl mx-auto mt-10 px-20 max-md:px-10">
      <div className="flex items-center justify-between mb-5">
        <input
          type="text"
          placeholder="Поиск"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button onClick={handleSearch} className="btn bg-blue-600 hover:bg-blue-500 text-white">
          Поиск
        </button>
      </div>
      {filteredUsers.length === 0 ? (
        <div className="text-center">
          <h1 className="text-4xl text-accent-content">
            Пользователи не найдены
          </h1>
          <Link
            to="/admin-panel"
            className="btn bg-blue-600 hover:bg-blue-500 text-white mt-10"
          >
            Назад
          </Link>
        </div>
      ) : (
        filteredUsers.map((user, index) => (
          <div
            key={nanoid()}
            className="collapse collapse-plus bg-base-200 mb-2"
          >
            <input type="radio" name={`my-accordion-${index}`} />
            <div className="collapse-title text-xl font-medium text-accent-content">
              Пользователь: {user.name} {user.lastname}
            </div>
            <div className="collapse-content">
              <div className="overflow-x-auto">
                <table className="table max-sm:table-xs table-pin-rows table-pin-cols">
                  <thead>
                    <tr className="text-accent-content">
                      <th>Аватар</th>
                      <th>Имя</th>
                      <th>Фамилия</th>
                      <th>Email</th>
                      <th>Телефон</th>
                      <th>Дата создания</th>
                      {isAdmin && <th>Действия</th>}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-accent-content" key={nanoid()}>
                      <td>
                        <img src={`https://backendevstigneev94.onrender.com${user.avatarUrl}`} alt="avatar" className="w-10 h-10 rounded-full" />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.lastname}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      {isAdmin && (
                        <td>
                          {user.roles.includes("ADMIN") ? (
                            <span className="text-green-600">Администратор</span>
                          ) : (
                            <button onClick={() => makeAdmin(user._id)} className="btn bg-blue-600 hover:bg-blue-500 text-white">Сделать администратором</button>
                          )}
                        </td>
                      )}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserList;

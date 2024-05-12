import React, { useEffect, useState } from "react";
import axios from "../axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import '../styles/globalstyles.css';

const Profile = () => {
  const inputFileRef = React.useRef(null);

  const [userData, setUserData] = useState({});
  const loginState = useSelector((state) => state.auth.isLoggedIn);
  const wishItems = useSelector((state) => state.wishlist.wishItems);
  const [userFormData, setUserFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const navigate = useNavigate();
  const [id, setId] = useState("");

  const getUserData = async () => {
    try {
      const response = await axios(`/auth/me`);
      const data = response.data;
      setUserFormData({
        id: data._id,
        name: data.name,
        lastname: data.lastname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        password: data.password,
      });
      setId(data._id);
    } catch (error) {
      toast.error("Ошибка: ", error.response);
    }
  };
  const handleChangeFile = async (event) => {
    try {
     const userData = new FormData();
     const file = event.target.files[0];
     formData.append('image', file);
     const { data } = await axios.post('/upload', userData);
     setImageUrl(data.url);
    }catch (err) {
     console.warn(err);
     alert('oshibka')
    }
 
   };

  useEffect(() => {
    if (loginState) {
      getUserData();
    } else {
      toast.error("Вы должны быть залогинены");
      navigate("/");
    }
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const putResponse = await axios.put(`/user/${id}`, {
        name: userFormData.name,
        lastname: userFormData.lastname,
        email: userFormData.email,
        phone: userFormData.phone,
        address: userFormData.address,
        password: userFormData.password,
      });
      const putData = putResponse.data;
      toast.success("Данные успешно обновлены");
    } catch (error) {
      if (error.response && error.response.data && Array.isArray(error.response.data)) {
        // Извлекаем сообщение об ошибке из объекта ошибки и выводим его
        const errorMessage = error.response.data[0].msg;
        toast.error(errorMessage);
      } else {
        toast.error("Произошла ошибка при обновлении данных");
      }
    }
  }

  return (
    <>
      <form className="max-w-7xl mx-auto text-center px-10 " onSubmit={updateProfile}>
        <div className="grid grid-cols-3 max-lg:grid-cols-1">
        <div className="form-control w-full lg:max-w-xs">
            <label className="label">
              <span className="label-text">Имя</span>
            </label>
            <input
              type="text"
              placeholder="Пиши тут"
              className="input input-bordered w-full lg:max-w-xs"
              value={userFormData.name}
              onChange={(e) => { setUserFormData({ ...userFormData, name: e.target.value }) }}
            />
          </div>

          <div className="form-control w-full lg:max-w-xs">
            <label className="label">
              <span className="label-text">Фамилия</span>
            </label>
            <input
              type="text"
              placeholder="Пиши тут"
              className="input input-bordered w-full lg:max-w-xs"
              value={userFormData.lastname}
              onChange={(e) => { setUserFormData({ ...userFormData, lastname: e.target.value }) }}
            />
          </div>

          <div className="form-control w-full lg:max-w-xs">
            <label className="label">
              <span className="label-text">Почта</span>
            </label>
            <input
              type="email"
              placeholder="Пиши тут"
              className="input input-bordered w-full lg:max-w-xs"
              value={userFormData.email}
              onChange={(e) => { setUserFormData({ ...userFormData, email: e.target.value }) }}
            />
          </div>
        
          <div className="form-control w-full lg:max-w-xs">
            <label className="label">
              <span className="label-text">Номер</span>
            </label>
            <input
              type="tel"
              placeholder="Пиши тут"
              className="input input-bordered w-full lg:max-w-xs"
              value={userFormData.phone}
              onChange={(e) => { setUserFormData({ ...userFormData, phone: e.target.value }) }}
            />
          </div>

          <div className="form-control w-full lg:max-w-xs">
            <label className="label">
             <img onClick ={()=> inputFileRef.current.click()}  className="centered-image" variant="outlined" size="large" src="https://xsgames.co/randomusers/avatar.php?g=male" />
            </label>
            <input ref={inputFileRef} type="file" className="input input-bordered w-full lg:max-w-xs" onChange={handleChangeFile} hidden />
          </div>

          <div className="form-control w-full lg:max-w-xs">
            <label className="label">
              <span className="label-text">Пароль</span>
            </label>
            <input
              type="password"
              placeholder="Пиши тут"
              className="input input-bordered w-full lg:max-w-xs"
              value={userFormData.password}
              onChange={(e) => { setUserFormData({ ...userFormData, password: e.target.value }) }}
            />
          </div>
          </div>
        <button
          className="burr btn btn-lg bg-blue-600 hover:bg-blue-500 text-white mt-10"
          type="submit"
          onClick={updateProfile}
        >
          Обновить данные
        </button>
      </form>
    </>
  );
};

export default Profile;
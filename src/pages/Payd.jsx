import React, { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";
import { toast } from "react-toastify";
import { store } from "../store";
import { calculateTotals } from "../features/cart/cartSlice";
import MapWithMarker from "./MapWithMarker";

const Payd = forwardRef(({ onFormSubmit }, ref) => {
  const { cartItems, total } = useSelector((state) => state.cart);
  const loginState = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    region: "",
    city: "",
    street: "",
    postalCode: "",
    fullName: "",
    phoneNumber: "",
    location: null, // добавляем для хранения координат
  });

  useEffect(() => {
    if (!loginState) {
      toast.error("вы должны быть залогинены");
      navigate("/");
    }
  }, [loginState, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleMapClick = (location) => {
    setFormData((prevState) => ({
      ...prevState,
      location, // сохраняем координаты в formData
    }));
  };

  const validateForm = () => {
    const { region, city, street, postalCode, fullName, phoneNumber, location } = formData;
    if (!region || !city || !street || !postalCode || !fullName || !phoneNumber || !location) {
      toast.error("Все поля должны быть заполнены");
      return false;
    }
    // Дополнительная валидация (например, проверки длины, формата и т.д.)
    return true;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onFormSubmit(formData);
    }
  };

  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit,
  }));

  return (
    <div className="flex">
      <div className="w-1/2">
        <div className="max-w-sm">
          <form className="px-3 py-3">
            <label className="font-semibold text-xs pb-1 block text-accent-content">
              Регион
            </label>
            <input
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="rounded-lg px-3 py-2 mb-3 text-sm w-full"
              required
            />
            <label className="font-semibold text-sm pb-1 block text-accent-content">
              Город
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="rounded-lg px-3 py-2 mb-3 text-sm w-full"
              required
            />
            <label className="font-semibold text-sm pb-1 block text-accent-content">
              Улица, квартира, дом
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="rounded-lg px-3 py-2 mb-3 text-sm w-full"
              required
            />
            <label className="font-semibold text-sm pb-1 block text-accent-content">
              Почтовый индекс
            </label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="rounded-lg px-3 py-2 mb-3 text-sm w-full"
              required
            />
            <label className="font-semibold text-sm pb-1 block text-accent-content">
              Ф.И.О
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="rounded-lg px-3 py-2 mb-3 text-sm w-full"
              required
            />
            <label className="font-semibold text-sm pb-1 block text-accent-content">
              Номер телефона
            </label>
            <input
              type="phone"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="rounded-lg px-3 py-2 mb-3 text-sm w-full"
              required
            />
          </form>
        </div>
      </div>
      <div className="w-1/2">
        <MapWithMarker onMapClick={handleMapClick} />
      </div>
    </div>
  );
});

export default Payd;

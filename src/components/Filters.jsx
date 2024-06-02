import React, { useEffect, useState } from "react";
import FormInput from "./FormInput";
import { useDispatch, useSelector } from "react-redux";

import { Form, Link } from "react-router-dom";
import FormRange from "./FormRange";
import FormSelect from "./FormSelect";
import FormDatePicker from "./FormDatePicker";
import FormCheckbox from "./FormCheckbox";
import axios from "../axios";



const Filters = () => {
  const [selectCategoryList, setSelectCategoryList] = useState(["все"]);
  const [selectBrandList, setSelectBrandList] = useState(["все"]);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [isAdmin, setISAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setSelectCategoryList(prev => [...prev, ...response.data]);
      } catch (error) {
        console.error("Ошибка при получении категорий:", error);
      }
    };

    const fetchBrands = async () => {
      try {
        const response = await axios.get("/brands");
        setSelectBrandList(prev => [...prev, ...response.data]);
      } catch (error) {
        console.error("Ошибка при получении брендов:", error);
      }
    };
    const fetchMaxPrice = async () => {
      try {
        const response = await axios.get("/max-price");
        const roundedMaxPrice = Math.ceil(response.data.maxPrice);  // Округление до большего числа
        setMaxPrice(roundedMaxPrice);
      } catch (error) {
        console.error("Ошибка при получении максимальной цены:", error);
      }
    };


    
    fetchCategories();
    fetchBrands();
    fetchMaxPrice();
  }, []);
  return (
    <Form className="bg-base-200 rounded-md px-8 py-4 grid gap-x-4  gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 items-center">
      {/* SEARCH */}
      <FormInput
        type="search"
        label="поиск по названию"
        name="search"
        size="input-sm"
        defaultValue=""
      />
      {/* CATEGORIES */}
      <FormSelect
        label="категории"
        name="category"
        list={selectCategoryList}
        size="select-sm"
        defaultValue="all"
      />
      {/* COMPANIES */}
      <FormSelect
        label="поиск по производителю"
        name="brand"
        list={selectBrandList}
        size="select-sm"
        defaultValue="all"
      />
      {/* PRICE */}
      <FormRange
        name="price"
        label="Цена"
        size="range-sm"
        price={maxPrice}
      />
      {/* In stock */}
      <FormCheckbox
        label="только продукт в наличии"
        name="isInStock"
        defaultValue="false"
      />

      {/* BUTTONS */}

      <button
        type="submit"
        className="btn bg-blue-600 hover:bg-blue-500 text-white btn-sm"
      >
        Поиск
      </button>
      <Link to="/shop?page=1" className="btn btn-primary btn-sm">
        Сбросить
      </Link>
      {isAdmin &&
      <Link to="/productcreate" className="btn bg-green-500 text-white p-2 hover:bg-green-600 btn-sm">
        Добавить товар
      </Link> }
    </Form>
  );
};

export default Filters;

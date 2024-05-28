import React, { useEffect, useState } from "react";
import FormInput from "./FormInput";
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
        поиск
      </button>
      <Link to="/shop?page=1" className="btn btn-primary btn-sm">
        сбросить
      </Link>
    </Form>
  );
};

export default Filters;

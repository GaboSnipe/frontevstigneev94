import React, { useEffect } from "react";
import "../styles/Landing.css";
import { Hero, ProductElement, Stats } from "../components";
import { useLoaderData, useNavigate } from "react-router-dom";
import axios from "../axios";

export const landingLoader = async () => {
  try {
    const response = await axios.get('/products?_page=1&_limit=8');
    const data = response.data;
    return { products: data };
  } catch (error) {
    console.error("Ошибка получения товаров:", error);
    return { products: [] }; // Возвращаем пустой массив в случае ошибки
  }
};

const Landing = () => {
  const { products } = useLoaderData();
  const navigate = useNavigate();

  return (
    <main>
      <Hero />
      <Stats />

      {products.length > 0 && (
        <div className="selected-products">
          
          <h2 className="text-6xl text-center my-12 max-md:text-4xl text-accent-content">
            Наши товары
          </h2>
          <div className="selected-products-grid max-w-7xl mx-auto">
            {products.map((product) => (
              <ProductElement
                key={product._id}
                id={product._id}
                title={product.name}
                image={`https://backendevstigneev94.vercel.app${product.imageUrl}`}
                price={product.price}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
};

export default Landing;

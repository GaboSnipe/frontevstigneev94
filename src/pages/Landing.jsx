import React, { useEffect } from "react";
import "../styles/Landing.css";
import { Hero, ProductElement, Stats } from "../components";
import { useLoaderData, useNavigate } from "react-router-dom";
import axios from "../axios";

export const landingLoader = async () => {
  try {
    const response = await axios(`/products?_page=1&_limit=4`);
    const data = response.data;
    return { products: data };
  } catch (error) {
    console.error("Ошибка получения товаров:", error);
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
                image={`https://raw.githubusercontent.com/GaboSnipe/backendevstigneev94/main${product.imageUrl}`}
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

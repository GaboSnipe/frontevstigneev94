import React, { useEffect, useState } from "react";
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
  const [isAdmin, setISAdmin] = useState(false);

  const { products } = useLoaderData();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/auth/me')
      .then(response => {
        if (response.data.roles.includes("ADMIN")) {
          setISAdmin(true);
        }
      })
      .catch(error => {
        console.error('Ошибка при получении данных:', error);
      });
  }, []);

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
                isAdmin={isAdmin}
                key={product._id}
                id={product._id}
                title={product.name}
                image={`https://backendevstigneev94.onrender.com${product.imageUrl}`}
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

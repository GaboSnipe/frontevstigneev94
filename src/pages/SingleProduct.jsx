import axios from "../axios";
import React, { useState, useEffect } from "react";
import {
  QuantityInput,
  SelectSize,
  SingleProductRating,
  SingleProductReviews,
} from "../components";
import { FaHeart } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { Link, useLoaderData } from "react-router-dom";
import parse from "html-react-parser";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import {
  updateWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";
import { toast } from "react-toastify";
import { store } from "../store";

export const singleProductLoader = async ({ params }) => {
  const { id } = params;
  const response = await axios(`/products/${id}`);
  return { productData: response.data };
};

const SingleProduct = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState(0);
  const { wishItems } = useSelector((state) => state.wishlist);
  const [userObj, setuserObj] = useState(null);

  const dispatch = useDispatch();
  const loginState = useSelector((state) => state.auth.isLoggedIn);
  const [rating, setRating] = useState([
    "empty star",
    "empty star",
    "empty star",
    "empty star",
    "empty star",
  ]);

  const { productData } = useLoaderData();

  useEffect(() => {
    axios.get('/auth/me')
      .then(response => {
        setuserObj(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных:', error);
      });
  }, []);
  

  const product = {
    id: productData?._id + size,
    title: productData?.name,
    image: productData?.imageUrl,
    price: productData?.price,
    brandName: productData?.brandName,
    amount: quantity,
    selectedSize: size || productData?.availableSizes[0],
    isInWishList: wishItems.includes(productData?._id),
  };


  for (let i = 0; i < productData?.rating; i++) {
    rating[i] = "full star";
  }

  let ratings = [];
  if (productData.reviews && productData.reviews.length > 0) {
    productData.reviews.forEach((review) => {
      ratings.push(review.rating);
    });
  } else {
    ratings.push(0);
  }
  let sumOfRatings = ratings.reduce((total, rating) => total + rating, 0);
  let averageRating = sumOfRatings / ratings.length;

  const addToWishlistHandler = async (product) => {
    try {
      await axios.post(`/users/${userObj._id}/wishlist`, { item: productData._id });
      // Получите обновленный объект пользователя
      const updatedUserObj = await axios.get(`/auth/me`);
      store.dispatch(updateWishlist({ userObj: updatedUserObj.data }));
      toast.success('Элемент добавлен в список желаний');
    } catch (error) {
      console.log(error);
      toast.error('Произошла ошибка при добавлении элемента в список желаний');
    }
  };
  
  const removeFromWishlistHandler = async (product) => {
    try {
      await axios.put(`/users/${userObj._id}/wishlist/remove`, { item: productData._id });
      // Получите обновленный объект пользователя
      const updatedUserObj = await axios.get(`/auth/me`);
      store.dispatch(removeFromWishlist({ userObj: updatedUserObj.data }));
      toast.success('Элемент удален из списка желаний');
    } catch (error) {
      console.error('Ошибка при удалении элемента из списка желаний:', error);
      toast.error('Произошла ошибка при удалении элемента из списка желаний');
    }
  };
  const addToCartHandler = async (product) => {
    try {
      await axios.post(`/users/${userObj._id}/wishlist`, { item: productData._id });
      // Получите обновленный объект пользователя
      const updatedUserObj = await axios.get(`/auth/me`);
      store.dispatch(updateWishlist({ userObj: updatedUserObj.data }));
      toast.success('Элемент добавлен в список желаний');
    } catch (error) {
      console.log(error);
      toast.error('Произошла ошибка при добавлении элемента в список желаний');
    }
  };
  
  
  

  return (
    <>
      <div className="grid grid-cols-2 max-w-7xl mx-auto mt-5 max-lg:grid-cols-1 max-lg:mx-5">
        <div className="product-images flex flex-col justify-center max-lg:justify-start">
          <img
            src={`https://raw.githubusercontent.com/GaboSnipe/backendevstigneev94/main/${productData?.additionalImageUrls[currentImage]}`}
            className="w-96 text-center border border-gray-600 cursor-pointer"
            alt={productData.name}
          />
          <div className="other-product-images mt-1 grid grid-cols-3 w-96 gap-y-1 gap-x-2 max-sm:grid-cols-2 max-sm:w-64">
            {productData?.additionalImageUrls.map((imageObj, index) => (
              <img
                src={`https://raw.githubusercontent.com/GaboSnipe/backendevstigneev94/main${imageObj}`}
                key={nanoid()}
                onClick={() => setCurrentImage(index)}
                alt={productData.name}
                className="w-32 border border-gray-600 cursor-pointer"
              />
            ))}
          </div>
        </div>
        <div className="single-product-content flex flex-col gap-y-5 max-lg:mt-2">
          <h2 className="text-5xl max-sm:text-3xl text-accent-content">
            {productData?.name}
          </h2>
          <SingleProductRating rating={ratings} productData={productData} />
          <p className="text-3xl text-error">₽{productData?.price}</p>
          <div className="text-xl max-sm:text-lg text-accent-content">
            {parse(productData?.description)}
          </div>
          <div className="text-2xl">
            <SelectSize sizeList={productData?.availableSizes} size={size} setSize={setSize} />
          </div>
          <div>
            <label htmlFor="Quantity" className="sr-only">Количество</label>
            <div className="flex items-center gap-1">
              <QuantityInput quantity={quantity} setQuantity={setQuantity} />
            </div>
          </div>
          <div className="flex flex-row gap-x-2 max-sm:flex-col max-sm:gap-x">
            <button
              className="btn bg-blue-600 hover:bg-blue-500 text-white"
              onClick={() => {
                if (loginState) {
                  
                  dispatch(addToCart(product));
                } else {
                  toast.error("вы должны быть залогинени");
                }
              }}
            >
              <FaCartShopping className="text-xl mr-1" />
              добавить в корзину
            </button>

            {product.isInWishList ? (
              <button
                className="btn bg-blue-600 hover:bg-blue-500 text-white"
                onClick={() => {
                  if (loginState) {
                    removeFromWishlistHandler(product);
                  } else {
                    toast.error("вы должны быть залогинени");
                  }
                }}
              >
                <FaHeart className="text-xl mr-1" />
                удалить из списка желаный
              </button>
            ) : (
              <button
                className="btn bg-blue-600 hover:bg-blue-500 text-white"
                onClick={() => {
                  if (loginState) {
                    addToWishlistHandler(product);
                  } else {
                    toast.error("вы должны быть залогинени");
                  }
                }}
              >
                <FaHeart className="text-xl mr-1" />
                добавить в список желаный
              </button>
            )}
          </div>
          <div className="other-product-info flex flex-col gap-x-2">
            <div className="badge bg-gray-700 badge-lg font-bold text-white p-5 mt-2">
              производитель: {productData?.brandName}
            </div>
            <div
              className={
                productData?.isInStock
                  ? "badge bg-gray-700 badge-lg font-bold text-white p-5 mt-2"
                  : "badge bg-gray-700 badge-lg font-bold text-white p-5 mt-2"
              }
            >
              наличие в складе : {productData?.isInStock ? "да" : "нет"}
            </div>
            <div className="badge bg-gray-700 badge-lg font-bold text-white p-5 mt-2">
              код продукта: {productData?.productCode}
            </div>
            <div className="badge bg-gray-700 badge-lg font-bold text-white p-5 mt-2">
              категория: {productData?.category}
            </div>
            <div className="badge bg-gray-700 badge-lg font-bold text-white p-5 mt-2">
              дата производство: {productData?.productionDate?.substring(0, 10)}
            </div>
          </div>
        </div>
      </div>
      <SingleProductReviews rating={ratings} productData={productData} />
    </>
  );
};

export default SingleProduct;

import axios from "../axios";
import React, { useState, useEffect } from "react";
import {
  QuantityInput,
  SelectSize,
  SingleProductRating,
  SingleProductReviews,
  CreateReviews
} from "../components";
import { FaHeart, FaCartShopping } from "react-icons/fa6";
import { Link, useLoaderData } from "react-router-dom";
import parse from "html-react-parser";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateCartAmount } from "../features/cart/cartSlice";
import {
  updateWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";
import { toast } from "react-toastify";
import { store } from "../store";
import { selectIsAuth } from "../redux/slices/auth";

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
  const [isAdmin, setISAdmin] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);


  const [rating, setRating] = useState([
    "empty star",
    "empty star",
    "empty star",
    "empty star",
    "empty star",
  ]);

  const { productData } = useLoaderData();

  

  const handleRemoveProduct = () => {
    setShowConfirmation(true);
  };

  const confirmRemoveProduct = () => {
    removeProduct();
    setShowConfirmation(false);
  };

  const cancelRemoveProduct = () => {
    setShowConfirmation(false); // Закрываем модальное окно без удаления
  };
  
  const removeProduct = async () => {
    try {
      const response = await axios.delete(`/products/${productData._id}`);
      toast.success('Продукт успешно удален:');
      return true;
    } catch (error) {
      toast.error('Ошибка при удалении продукта:', error);
      return false;
    }
  };


  useEffect(() => {
    axios.get('/auth/me')
      .then(response => {
        setuserObj(response.data);
        if (response.data.roles.includes("ADMIN")) {
          setISAdmin(true);
        }
      })
      .catch(error => {
        console.error('Ошибка при получении данных:', error);
      });

    // Calculate the average rating
    let sumOfRatings = 0;
    if (productData.reviews && productData.reviews.length > 0) {
      sumOfRatings = productData.reviews.reduce((total, review) => total + review.rating, 0);
    }
    const averageRating = sumOfRatings / productData.reviews.length;
    
    // Set the rating stars
    const newRating = Array.from({ length: 5 }, (_, index) => 
      index < Math.round(averageRating) ? "full star" : "empty star"
    );
    setRating(newRating);

  }, [productData.reviews]);

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

  const addToWishlistHandler = async (product) => {
    try {
      await axios.post(`/users/${userObj._id}/wishlist`, { item: productData._id });
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
      await axios.post(`/users/${userObj._id}/cart`, { item: product });
      const updatedUserObj = await axios.get(`/auth/me`);
      store.dispatch(addToCart( product ));
      toast.success('товар добавлен в корзину');
    } catch (error) {
      console.log(error);
      toast.error('Произошла ошибка при добавлении элемента в корзину');
    }
  };

  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <>
      <div className="grid grid-cols-2 max-w-7xl mx-auto mt-5 max-lg:grid-cols-1 max-lg:mx-5">
        <div className="product-images flex flex-col justify-center max-lg:justify-start">
          <img
            src={`https://backendevstigneev94.onrender.com${productData?.additionalImageUrls[currentImage]}`}
            className="w-96 text-center border border-gray-600 cursor-pointer"
            alt={productData.name}
          />
          <div className="other-product-images mt-1 grid grid-cols-3 w-96 gap-y-1 gap-x-2 max-sm:grid-cols-2 max-sm:w-64">
            {productData?.additionalImageUrls.map((imageObj, index) => (
              <img
                src={`https://backendevstigneev94.onrender.com${imageObj}`}
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
          <SingleProductRating rating={rating} productData={productData} />
            <p className="text-3xl text-error">₽{productData?.price}</p>
          <div className="expandable-text">
            <p className={isExpanded ? 'expanded' : 'collapsed'}>
              {isExpanded ? productData?.description : `${productData?.description.substring(0, 200)}...`}
            </p>
            <button className="toggle-button" onClick={toggleExpand}>
              {isExpanded ? 'показать больше' : 'показать меньше'}
            </button>
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
                  addToCartHandler(product);
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
          <div>
          {isAdmin && (
                <>
                  <button
                    type="button"
                    onClick={handleRemoveProduct}
                    className="btn ml-2 inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:border-red-700 focus:ring-red active:bg-red-700 transition ease-in-out duration-150"
                  >
                    Удалить
                  </button>
                  <Link
                    to={`/productcreate/${productData._id}`}
                    className="btn ml-2 inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:border-yellow-700 focus:ring-yellow active:bg-yellow-700 transition ease-in-out duration-150"
                  >
                    Изменить
                  </Link>
                  {showConfirmation && (
                    <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-75 z-50">
                      <div className="bg-white p-8 rounded-md shadow-lg">
                        <p>Вы уверены, что хотите удалить продукт?</p>
                        <div className="mt-4 flex justify-center">
                          <button
                            onClick={confirmRemoveProduct}
                            className="px-4 py-2 mr-4 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            Да
                          </button>
                          <button
                            onClick={cancelRemoveProduct}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                          >
                            Отмена
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
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
      {loginState &&
      <CreateReviews productData={productData}/>}
      <SingleProductReviews productData={productData} />
    </>
  );
};

export default SingleProduct;

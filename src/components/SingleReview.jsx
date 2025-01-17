import React, { useEffect, useState } from "react";
import axios from "../axios";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";

const removeComent = async (reviewObj, productData) => {
  try {
    const response = await axios.delete(`/products/${productData._id}/reviews/${reviewObj.userId}`);
      toast.success("Коментарый успешно удалён");
  } catch (error) {
    console.error('Ошибка при удалении отзыва:', error.response?.data?.message || error.message);
  }
};

const SingleReview = ({ reviewObj, isAdmin, productData }) => {
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    axios.get(`/user/${reviewObj?.userId}`)
      .then(response => {
        setUserObj(response.data);
      })
      .catch(error => {
        console.error('Ошибка при получении данных:', error);
      });
  }, [reviewObj]);

  const rating = Array.from({ length: 5 }, (_, i) => {
    return i < reviewObj?.rating ? "full star" : "empty star";
  });
  return (
    <article className="mb-10">
        <div className="flex items-center mb-4">
          <img
            className="w-10 rounded-full"
            src={`https://https://backendevstigneev94.onrender.com${userObj?.avatarUrl}`}
            alt=""
          />
            <div className="font-medium dark:text-white flex items-center">
              <p>{userObj?.name} {userObj?.lastname}</p>
              {isAdmin &&
              <button className="btn btn-xs btn-error text-sm ml-2" onClick={() => removeComent(reviewObj, productData)}>
                удалить коментарии
              </button>}
            </div>

        </div>
      <div className="flex items-center mb-1 space-x-1 rtl:space-x-reverse">
        {rating.map((item) => (
          <svg
            key={nanoid()}
            className={`w-4 h-4 ${item === "full star" ? "text-yellow-300" : "text-gray-300 dark:text-gray-500"}`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 22 20"
          >
            <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
          </svg>
        ))}
        <h3 className="ms-2 text-sm font-semibold text-accent-content">
          {reviewObj.reviewTitle}
        </h3>
      </div>
      <footer className="mb-5 text-sm text-accent-content">
        <p>
          Дата :  <time dateTime={reviewObj.date}>{reviewObj.date}</time>
        </p>
      </footer>
      <p className="mb-2 text-accent-content">{reviewObj.reviewText}</p>
    </article>
  );
};

export default SingleReview;

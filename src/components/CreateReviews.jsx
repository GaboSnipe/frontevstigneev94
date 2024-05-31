import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "../axios";
import { nanoid } from "nanoid";
import { useSelector } from "react-redux";


const CreateReviews = ({ productData }) => {
  const currentDate = new Date();
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);
  const userId = useSelector((state) => state.auth.usId);
  
  const [formData, setFormData] = useState({
    rating: 0,
    reviewTitle: "",
    reviewText: "",
    userId: userId,
    date: formattedDate
  });

  const rating = Array(5).fill("empty star");
  for (let i = 0; i < formData.rating; i++) {
    rating[i] = "full star";
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleStarClick = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      rating: index + 1
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/products/${productData._id}`, formData);
      toast.success("Отзыв успешно отправлен!");
      // Очистка формы после успешной отправки
      setFormData({
        rating: 0,
        reviewTitle: "",
        reviewText: "",
        userId: userId,
        date: formattedDate
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Ошибка при отправке отзыва");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-4">Оставить отзыв</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex items-center">
          <label className="block text-sm font-medium text-gray-700">Рейтинг:</label>
          <div className="flex items-center ml-2">
            {rating.map((star, index) => (
              <button
                key={nanoid()}
                type="button"
                onClick={() => handleStarClick(index)}
                className={`mask ${star === "full star" ? " mask mask-star bg-orange-400" : " mask mask-star bg-gray-400"} h-6 w-6`}
              ></button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700">
            Заголовок отзыва
          </label>
          <input
            type="text"
            id="reviewTitle"
            name="reviewTitle"
            value={formData.reviewTitle}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700">
            Текст отзыва
          </label>
          <textarea
            id="reviewText"
            name="reviewText"
            value={formData.reviewText}
            onChange={handleChange}
            className="mt-1 p-2 block w-full border-gray-300 rounded-md"
            rows="4"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Отправить отзыв
        </button>
      </form>
    </div>
  );
};

export default CreateReviews;

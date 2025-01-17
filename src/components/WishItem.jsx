import React, { useState, useEffect } from "react";

import { FaHeartCrack } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import { removeFromWishlist } from "../features/wishlist/wishlistSlice";
import axios from "../axios";
import { store } from "../store";
import { toast } from "react-toastify";


const WishItem = ({ item, counter }) => {
const dispatch = useDispatch();
const [userObj, setuserObj] = useState(null);
const [pd, setpd] = useState(0);

useEffect(() => {
  axios.get('/auth/me')
    .then(response => {
      setuserObj(response.data);
    })
    .catch(error => {
      console.error('Ошибка при получении данных:', error);
    });
}, []);
axios.get(`/products/${item}`)
  .then(response => {
    setpd(response.data);
  })
  .catch(error => {
    console.error('Ошибка при запросе данных продукта:', error);
  });
  const removeFromWishlistHandler = async (product) => {
    try {
      await axios.put(`/users/${userObj._id}/wishlist/remove`, { item: product });
      const updatedUserObj = await axios.get(`/auth/me`);
      store.dispatch(removeFromWishlist({ userObj: updatedUserObj.data }));
      toast.success('Элемент удален из списка желаний');
    } catch (error) {
      console.error('Ошибка при удалении элемента из списка желаний:', error);
      toast.error('Произошла ошибка при удалении элемента из списка желаний');
    }
  };
  return (
    <tr className="hover cursor-pointer">
      <th className="text-accent-content">{ counter + 1 }</th>
      <td className="imgaad mx-auto max-w-7xl">
        <img src={`https://https://backendevstigneev94.onrender.com${pd.imageUrl}`} alt={pd.name} />
      </td>
      <td className="text-accent-content">{ pd.name }</td>
      <td>
        <button className="btn btn-xs btn-error text-sm" onClick={() => removeFromWishlistHandler(item)}>
          <FaHeartCrack />
          удалить из списка желании
        </button>
      </td>
    </tr>
  );
};

export default WishItem;

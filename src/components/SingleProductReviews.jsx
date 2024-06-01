import React, { useEffect, useState } from "react";
import SingleReview from "./SingleReview";
import { nanoid } from "nanoid";
import axios from "../axios";


const SingleProductReviews = ({ productData }) => {
  const [isAdmin, setISAdmin] = useState(false);
  
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

  const [isCom, setisCom] = useState(false);
  useEffect(() => {
    if(productData?.reviews?.length == 0){
      setisCom(false);
    }else{
      setisCom(true);
    }
  }, []);
  return (
    <div className="product-reviews max-w-7xl mt-10 mx-auto">

      <div className="product-reviews-comments mt-20 px-10">
        {isCom ?
        (<h2 className="text-4xl text-accent-content text-center mb-5 max-sm:text-2xl">Коментарии</h2>)
        : (<h2 className="text-4xl text-accent-content text-center mb-5 max-sm:text-2xl">Коментартев покачто нет</h2>)
        }
        
        {productData.reviews.map((item) => (
          <SingleReview key={nanoid()} reviewObj={item} isAdmin={isAdmin} productData={productData} />
        ))}
        {productData?.totalReviewCount > 3 && (
          <button className="btn bg-blue-600 hover:bg-blue-500 w-full text-white">
            загрузить больше коментариев
          </button>
        )}
      </div>
    </div>
  );
};

export default SingleProductReviews;

import React from "react";
import { WishItem } from "../components";
import { useDispatch, useSelector } from "react-redux";


const Wishlist = () => {
    const { wishItems } = useSelector((state) => state.wishlist); 
    const dispatch = useDispatch();
  return (
    <>
      <div className="max-w-7xl mx-auto">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th className="text-accent-content text-sm">Изображения</th>
                <th className="text-accent-content text-sm">Названия</th>
              </tr>
            </thead>
            <tbody>
              { wishItems.map((item, index) => (
                <WishItem item={item} key={index} counter={index} />
              )) }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Wishlist;

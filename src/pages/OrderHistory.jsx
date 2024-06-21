import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axios";
import { nanoid } from "nanoid";

const OrderHistory = () => {
  const [subtotals, setSubtotals] = useState([]);
  const loginState = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  const getOrderHistory = async () => {
    try {
      const response = await axios.get(`/orders/${localStorage.getItem("id")}`);
      const data = response.data;
      setOrders(
        data.filter((order) => order.userId === localStorage.getItem("id"))
      );
    } catch (error) {
      toast.error(error.response);
    }
  };

  useEffect(() => {
    if (!loginState) {
      toast.error("вы должны быть залогинены");
      navigate("/");
    } else {
      getOrderHistory();
    }
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      // Вычисляем subtotal для каждого заказа
      const orderSubtotals = orders.map(order =>
        order.cartItems.reduce((acc, product) => acc + (product.price * product.amount), 0)
      );
  
      setSubtotals(orderSubtotals);
    }
  }, [orders]);

  return (
    <div className="order-history-main max-w-7xl mx-auto mt-10 px-20 max-md:px-10">
      {orders?.length === 0 ? (
        <div className="text-center">
          <h1 className="text-4xl text-accent-content">
            У вас нету покупок в истории
          </h1>
          <Link
            to="/shop"
            className="btn bg-blue-600 hover:bg-blue-500 text-white mt-10"
          >
            Сделай свою первую покупку
          </Link>
        </div>
      ) : (
        orders.map((order, index) => (
          <div
            key={nanoid()}
            className="collapse collapse-plus bg-base-200 mb-2"
          >

            <input type="checkbox" name={`my-accordion-${index}`} />
            <div className="collapse-title text-xl font-medium text-accent-content">
              Заказ {order.id} - {order.orderStatus}
            </div>
            <div className="collapse-content">
              <div className="overflow-x-auto">
                <table className="table max-sm:table-xs table-pin-rows table-pin-cols">
                  {/* head */}
                  <thead>
                    <tr className="text-accent-content">
                      <th>Покупка</th>
                      <th>Картинка</th>
                      <th>Имя</th>
                      <th>Тип</th>
                      <th>Количество</th>
                      <th>Цена</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.cartItems.map((product, counter) => (
                      <tr className="text-accent-content" key={nanoid()}>
                        <th>{counter + 1}</th>
                        <th>
                          <img src={`https://backendevstigneev94-production.up.railway.app${product.image}`} alt="" className="w-10" />
                        </th>
                        <td>{product.title}</td>
                        <td>{product.selectedSize}</td>
                        <td>{product.amount}</td>
                        <td>&#x20bd;{(product.price * product.amount).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="5" className="text-center">
                        <h4 className="text-md text-accent-content">
                          Цена: { Math.round(subtotals[index]) }
                        </h4>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="5" className="text-center">
                        <h3 className="text-md text-accent-content">
                          Доставка: &#x20bd;{ Math.round(subtotals[index] / 20) }
                        </h3>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="5" className="text-center">
                        <h3 className="text-xl text-accent-content">
                          - Итоговая цена: &#x20bd;{ Math.round(subtotals[index] + (subtotals[index] / 20)) } -
                        </h3>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;

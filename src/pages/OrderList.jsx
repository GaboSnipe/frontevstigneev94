import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../axios";
import { nanoid } from "nanoid";

const OrderList = () => {
  const [subtotals, setSubtotals] = useState([]);
  const loginState = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const getOrderHistory = async () => {
    try {
      const response = await axios.get("/orders");
      setOrders(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Ошибка при получении заказов");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/orders/${orderId}`, { orderStatus: newStatus });
      toast.success("Статус заказа успешно обновлен");
      getOrderHistory(); // Обновляем список заказов после изменения статуса
    } catch (error) {
      toast.error(error.response?.data?.message || "Ошибка при обновлении статуса заказа");
    }
  };

  useEffect(() => {
    axios.get('/auth/me')
      .then(response => {
        if (response.data.roles.includes("ADMIN")) {
          setIsAdmin(true);
        } else {
          navigate("/");
        }
      })
      .catch(error => {
        console.error('Ошибка при получении данных:', error);
      });
  }, [navigate]);

  useEffect(() => {
    if (!loginState) {
      toast.error("Вы должны быть залогинены");
      navigate("/");
    } else {
      getOrderHistory();
    }
  }, [loginState, navigate]);

  useEffect(() => {
    if (orders.length > 0) {
      // Вычисляем subtotal для каждого заказа
      const orderSubtotals = orders.map(order =>
        order.cartItems.reduce((acc, product) => acc + (product.price * product.amount), 0)
      );

      setSubtotals(orderSubtotals);
    }
  }, [orders]);

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (filterStatus ? order.orderStatus === filterStatus : true) &&
      (searchTerm
        ? order._id.toLowerCase().includes(searchLower) ||
          order.userId.toLowerCase().includes(searchLower) ||
          order.formData.fullName.toLowerCase().includes(searchLower) ||
          order.formData.phoneNumber.toLowerCase().includes(searchLower) ||
          order.formData.city.toLowerCase().includes(searchLower) ||
          order.formData.postalCode.toLowerCase().includes(searchLower) ||
          order.formData.region.toLowerCase().includes(searchLower) ||
          order.formData.street.toLowerCase().includes(searchLower) ||
          order.cartItems.some(product =>
            product.title.toLowerCase().includes(searchLower) ||
            product.id.toLowerCase().includes(searchLower)
          )
        : true)
    );
  });

  return (
    <div className="order-history-main max-w-7xl mx-auto mt-10 px-20 max-md:px-10">
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Поиск"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="select select-bordered"
        >
          <option value="">Все статусы</option>
          <option value="в процесе обработки">в процессе обработки</option>
          <option value="отправлен">отправлен</option>
          <option value="доставлен">доставлен</option>
          <option value="отменен">отменен</option>
        </select>
      </div>
      {filteredOrders.length === 0 ? (
        <div className="text-center">
          <h1 className="text-4xl text-accent-content">
            Заказы не найдены
          </h1>
          <Link
            to="/admin-panel"
            className="btn bg-blue-600 hover:bg-blue-500 text-white mt-10"
          >
            Назад
          </Link>
        </div>
      ) : (
        filteredOrders.map((order, index) => (
          <div
            key={nanoid()}
            className="collapse collapse-plus bg-base-200 mb-2"
          >
            <input type="checkbox" name={`my-accordion-${index}`} />
            <div className="collapse-title text-xl font-medium text-accent-content">
              Заказ {order?._id} - {order?.orderStatus}
            </div>
            <div className="collapse-content">
              <div className="overflow-x-auto">
                <table className="table max-sm:table-xs table-pin-rows table-pin-cols">
                  <thead>
                    <tr className="text-accent-content">
                      <th>покупка</th>
                      <th>картинка</th>
                      <th>имя</th>
                      <th>тип</th>
                      <th>количество</th>
                      <th>цена</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.cartItems.map((product, counter) => (
                      <tr className="text-accent-content" key={nanoid()}>
                        <th>{counter + 1}</th>
                        <th>
                          <img src={`https://backendevstigneev94.onrender.com${product?.image}`} alt="" className="w-10" />
                        </th>
                        <td>{product?.title}</td>
                        <td>{product?.selectedSize}</td>
                        <td>{product?.amount}</td>
                        <td>₽{(product?.price * product?.amount).toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td colSpan="5" className="text-center">
                        <h4 className="text-md text-accent-content">
                          Оплата: {Math.round(subtotals[index])}
                        </h4>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="5" className="text-center">
                        <h3 className="text-md text-accent-content">
                          Доставка: ₽{Math.round(subtotals[index] / 20)}
                        </h3>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="5" className="text-center">
                        <h3 className="text-xl text-accent-content">
                          Итоговая цена: ₽{Math.round(subtotals[index] + (subtotals[index] / 20))}
                        </h3>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="6" className="text-center">
                        <h3 className="text-xl text-accent-content">
                          Данные покупателя
                        </h3>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2">Имя:</td>
                      <td colSpan="4">{order?.formData?.fullName}</td>
                    </tr>
                    <tr>
                      <td colSpan="2">Телефон:</td>
                      <td colSpan="4">{order?.formData?.phoneNumber}</td>
                    </tr>
                    <tr>
                      <td colSpan="2">Город:</td>
                      <td colSpan="4">{order?.formData?.city}</td>
                    </tr>
                    <tr>
                      <td colSpan="2">Почтовый индекс:</td>
                      <td colSpan="4">{order?.formData?.postalCode}</td>
                    </tr>
                    <tr>
                      <td colSpan="2">Регион:</td>
                      <td colSpan="4">{order?.formData?.region}</td>
                    </tr>
                    <tr>
                      <td colSpan="2">Улица:</td>
                      <td colSpan="4">{order?.formData?.street}</td>
                    </tr>
                    <tr>
                      <td colSpan="2">Координаты:</td>
                      <td colSpan="4">
                        Широта: {order?.formData?.location?.lat !== undefined ? order.formData.location.lat : 'не указано'}, 
                        Долгота: {order?.formData?.location?.lng !== undefined ? order.formData.location.lng : 'не указано'}
                      </td>

                    </tr>
                    <tr>
                      <td colSpan="2">Выбранный метод оплаты:</td>
                      <td colSpan="4">{order?.selectedItem}</td>
                    </tr>
                    <tr>
                      <td colSpan="2">ID пользователя:</td>
                      <td colSpan="4">{order?.userId}</td>
                    </tr>
                    {isAdmin && (
                      <tr>
                        <td colSpan="2">Статус заказа:</td>
                        <td colSpan="4">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order?._id, e.target.value)}
                            className="select select-bordered"
                          >
                            <option value="в процесе обработки">в процессе обработки</option>
                            <option value="отправлен">отправлен</option>
                            <option value="доставлен">доставлен</option>
                            <option value="отменен">отменен</option>
                          </select>
                        </td>
                      </tr>
                    )}
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

export default OrderList;

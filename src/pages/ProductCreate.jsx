import axios from "../axios";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useParams } from 'react-router-dom';

const ProductCreate = () => {
  const { id } = useParams();
  const productId = id;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isInStock, setIsInStock] = useState(false);
  const [productionDate, setProductionDate] = useState("");
  const [brandName, setBrandName] = useState("");
  const [productCode, setProductCode] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [additionalImageUrls, setAdditionalImageUrls] = useState([]);
  const [price, setPrice] = useState(0);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [size, setSize] = useState("");
  const dispatch = useDispatch();
  
  const isAdmin = useSelector((state) => state.auth.user?.roles.includes("ADMIN"));

  const handleAddSize = () => {
    if (size) {
      setAvailableSizes([...availableSizes, size]);
      setSize("");
    }
  };

  useEffect(() => {
    // Функция для получения данных о товаре с сервера
    
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/products/${productId}`);
        const productData = response.data;
        setName(productData.name);
        setDescription(productData.description);
        setCategory(productData.category)
        setIsInStock(productData.isInStock);
        setProductionDate(productData.productionDate)
        setBrandName(productData.brandName)
        setProductCode(productData.productCode)
        setImageUrl(productData.imageUrl)
        setAdditionalImageUrls(productData.additionalImageUrls)
        setPrice(productData.price);
        setAvailableSizes(productData.availableSizes)
      } catch (error) {
        console.error("Ошибка при получении данных о товаре:", error);
        toast.error("Произошла ошибка при получении данных о товаре");
      }
    };
    if(productId){
       fetchProduct();
      }
  }, [productId]);

  const handleCreateProduct = async () => {
    try {
      const formattedDate = productionDate ? format(new Date(productionDate), 'yyyy-MM-dd') : "";
      const productData = {
        name,
        description,
        isInStock,
        category,
        availableSizes,
        productionDate: formattedDate, // Вот здесь происходит форматирование даты
        price,
        brandName,
        productCode,
        imageUrl,
        additionalImageUrls,
      };
  
      if (productId) {
        const response = await axios.put(`/products/${productId}`, productData);
        toast.success("Товар успешно изменен");
      } else {
        const response = await axios.post("/products", productData);
        toast.success("Товар успешно создан");
      }
  
      // Очистка формы после успешного создания или обновления товара
      setName("");
      setDescription("");
      setCategory("");
      setIsInStock(false);
      setProductionDate("");
      setBrandName("");
      setProductCode("");
      setImageUrl("");
      setAdditionalImageUrls([]);
      setPrice(0);
      setAvailableSizes([]);
      setSize("");
    } catch (error) {
      console.error("Ошибка при обновлении товара:", error);
      toast.error("Произошла ошибка при обновлении товара");
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImageUrl(response.data.url);
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
      toast.error("Произошла ошибка при загрузке изображения");
    }
  };
  const handleRemoveSize = (index) => {
    const updatedSizes = [...availableSizes];
    updatedSizes.splice(index, 1);
    setAvailableSizes(updatedSizes);
  };

  const handleAdditionalImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    try {
      const response = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAdditionalImageUrls([...additionalImageUrls, response.data.url]);
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
      toast.error("Произошла ошибка при загрузке изображения");
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = additionalImageUrls.filter((_, i) => i !== index);
    setAdditionalImageUrls(updatedImages);
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-4xl w-full p-5">
      {productId ? (
          <h1 className="text-5xl mb-5">Редактирование товара</h1>
        ) : (
          <h1 className="text-5xl mb-5">Создание товара</h1>
        )}
        <form className="grid grid-cols-1 gap-y-5">
          <div>
            <label htmlFor="name" className="block text-xl font-medium text-white-700">Название</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 text-sm w-full"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-xl font-medium text-white-700">Описание</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 text-sm w-full"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-xl font-medium text-white-700">Категория</label>
            <input
              id="category"
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 text-sm w-full"
            />
          </div>
          <div>
            <label htmlFor="isInStock" className="block text-xl font-medium text-white-700">Наличие на складе</label>
            <input
              id="isInStock"
              type="checkbox"
              checked={isInStock}
              onChange={(e) => setIsInStock(e.target.checked)}
              className="mt-1 block"
            />
          </div>
          <div>
          <label htmlFor="productionDate" className="block text-xl font-medium text-white-700">Дата производства</label>
          <input
            id="productionDate"
            type="date"
            value={productionDate}
            onChange={(e) => setProductionDate(e.target.value)}
            className="border rounded-lg px-3 py-2 mt-1"
          />
        </div>
          <div>
            <label htmlFor="brandName" className="block text-xl font-medium text-white-700">Производитель</label>
            <input
              id="brandName"
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 text-sm w-full"
            />
          </div>
          <div>
            <label htmlFor="productCode" className="block text-xl font-medium text-white-700">Код продукта</label>
            <input
              id="productCode"
              type="text"
              value={productCode}
              onChange={(e) => setProductCode(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 text-sm w-full"
            />
          </div>
          <div>
            <label htmlFor="imageUpload" className="block text-xl font-medium text-white-700">Главное изображение товара</label>
            <input
              id="imageUpload"
              type="file"
              onChange={handleImageUpload}
              className="mt-1 block w-full border-white-300 rounded-md shadow-sm"
            />
            {imageUrl && <img src={`https://https://backendevstigneev94.onrender.com${imageUrl}`} alt="Main product" className="mt-2 w-32 border border-white-600" />}
          </div>
          <div>
            <label htmlFor="additionalImageUpload" className="block text-xl font-medium text-white-700">Дополнительные изображения</label>
            <input
              id="additionalImageUpload"
              type="file"
              onChange={handleAdditionalImageUpload}
              className="mt-1 block w-full border-white-300 rounded-md shadow-sm"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {additionalImageUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img src={`https://https://backendevstigneev94.onrender.com${url}`} alt={`product-${index}`} className="w-32 border border-white-600" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 p-1 bg-red-600 text-white rounded-full"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="price" className="block text-xl font-medium text-white-700">Цена</label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="border rounded-lg px-3 py-2 mt-1 text-sm w-full"
            />
          </div>
          <div>
            <label htmlFor="availableSizes" className="block text-xl font-medium text-white-700">Доступные размеры</label>
            <input
              id="availableSizes"
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 text-sm w-full"
            />
            <button type="button" onClick={handleAddSize} className="mt-2 inline-flex items-center px-4 py-2 border border-white-300 shadow-sm text-sm font-medium rounded-md text-white bg-white-700 hover:bg-white-800">Добавить размер</button>
            <div className="mt-2 flex flex-wrap gap-2">
            {availableSizes.map((size, index) => (
              <div key={index} className="flex items-center">
                <span className="border rounded-lg px-3 py-2 mt-1 text-sm w-full">{size}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSize(index)}
                  className="ml-2 inline-flex items-center px-3 py-1 border border-transparent text-xs leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:border-red-700 focus:ring-red active:bg-red-700 transition ease-in-out duration-150"
                >
                  Удалить
                </button>
              </div>
            ))}
            </div>
          </div>
          <div>
            <button type="button" onClick={handleCreateProduct} className="inline-flex items-center px-4 py-2 border border-white-300 shadow-sm text-sm font-medium rounded-md text-white bg-white-700 hover:bg-white-800">{productId ? (<p>Применить изменения</p>) : (<p>Создать товар</p>)}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreate;

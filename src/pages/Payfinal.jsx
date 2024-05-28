import React, { useState } from 'react';

const Payfinal = ({ onSelectItem }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = (image) => {
    setSelectedImage(image);
    onSelectItem(image); // Передаем выбранный элемент в родительский компонент
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="selected-products-grid mx-auto">
        <div style={{ width: '23vw' }}>
        <img
          src={`${process.env.REACT_APP_API_URL}/uploads/1.png`}
          onClick={() => handleImageSelect("СБП")}
          className={`h-24 w-24 rounded-lg sm:h-32 sm:w-32 object-cover ${selectedImage === "СБП" ? 'border-3 border-darkorange' : ''}`}
          style={{
            marginBottom: '10px',
            cursor: 'pointer',
            width: '100%'
            }}
          />
        </div>
        <div style={{ width: '23vw' }}>
          <img
            src={`${process.env.REACT_APP_API_URL}/uploads/2.png`}
            onClick={() => handleImageSelect("Юмоней")}
            className="h-24 w-24 rounded-lg sm:h-32 sm:w-32 object-cover"
            style={{
              border: selectedImage === "Юмоней" ? '3px solid DarkOrchid' : 'none',
              marginBottom: '10px',
              cursor: 'pointer',
              width: '100%'
            }}
          />
        </div>
      </div>
      <div className="selected-products-grid mx-auto">
        <div style={{ width: '23vw' }}>
          <img
            src={`${process.env.REACT_APP_API_URL}/uploads/3.png`}
            onClick={() => handleImageSelect("Банковская карта")}
            className="h-24 w-24 rounded-lg sm:h-32 sm:w-32 object-cover"
            style={{
              border: selectedImage === "Банковская карта" ? '3px solid black' : 'none',
              marginBottom: '10px',
              cursor: 'pointer',
              width: '100%'
            }}
          />
        </div>
        <div style={{ width: '23vw' }}>
          <img
            src={`${process.env.REACT_APP_API_URL}/uploads/4.png`}
            onClick={() => handleImageSelect("Сбер пей")}
            className="h-24 w-24 rounded-lg sm:h-32 sm:w-32 object-cover"
            style={{
              border: selectedImage === "Сбер пей" ? '3px solid DarkGreen' : 'none',
              marginBottom: '10px',
              cursor: 'pointer',
              width: '100%'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Payfinal;
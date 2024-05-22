import React, { useEffect, useState } from 'react'
import CartItem from './CartItem';
import { useSelector } from 'react-redux';

const CartItemsList = () => {
    
    const { cartItems } = useSelector(state => state.cart);

  return (
    <>
      {cartItems.map((item) => {
        console.log(item);
        return <CartItem key={item.id} cartItem={item} />;
      })}
    </>
  )
}

export default CartItemsList
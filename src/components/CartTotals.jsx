import React from 'react'
import { useSelector } from 'react-redux';

const CartTotals = () => {
  const { amount } = useSelector((state) => state.cart);
  const { total } = useSelector((state) => state.cart);
  const tax = total / 5;
  const shipping = Math.round(total/20);
  return (
    <div className='card bg-base-200'>
      <div className='card-body'>
        {/* SUBTOTAL */}
        <p className='flex justify-between text-xs border-b border-base-300 pb-2 text-accent-content'>
          <span>Промежуточный итог</span>
          <span className='font-medium'>&#x20bd;{ Math.round(total) }</span>
        </p>
        {/* SHIPPING */}
        <p className='flex justify-between text-xs border-b border-base-300 pb-2 text-accent-content'>
          <span>Доставка</span>
          <span className='font-medium'>&#x20bd;{ shipping }</span>
        </p>

        {/* Order Total */}
        <p className='flex justify-between text-sm mt-4 pb-2 text-accent-content'>
          <span>Итоговая цена</span>
          <span className='font-medium'>&#x20bd;{ Math.round(total + shipping) }</span>
        </p>
      </div>
    </div>
  )
}

export default CartTotals
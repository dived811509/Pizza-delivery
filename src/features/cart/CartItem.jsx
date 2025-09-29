//import Button from "../../ui/Button";
import { useSelector } from "react-redux";
import { formatCurrency } from "../../utils/helpers";
import DeleteItem from "./DeleteItem";
import UpdateItemQuantity from "./UpdateItemQuantity";
import { getCurrentQuantityByID } from "./cartSlice";
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

function CartItem({ item }) {
  const { pizzaId, name, quantity, totalPrice } = item;
const currentQuantity = useSelector(getCurrentQuantityByID(pizzaId));
  return (
    <li className="py-3 sm:flex sm:items-center sm:justify-between">
      <p className="mb-1">
        {quantity}&times; {name}
      </p>
      <div className="flex items-center justify-between">
        <p>{formatCurrency(totalPrice)}</p>
        <UpdateItemQuantity pizzaId={pizzaId}/>
<DeleteItem pizzaId={pizzaId}/>
      </div>
    </li>
  );
}

export default CartItem;

// Test ID: IIDSAT
/* eslint-disable no-unused-vars */
import OrderItem from "./OrderItem"
import { useFetcher, useLoaderData } from "react-router-dom";
import { getOrder } from "../../services/apiRestaurant";
import {
  calcMinutesLeft,
  formatCurrency,
  formatDate,
} from "../../utils/helpers";
import { useEffect } from "react";
import UpdateOrder from "./UpdateOrder";

function Order() {
  const order = useLoaderData();
const fetcher = useFetcher();
useEffect(function(){
  if(!fetcher.data && fetcher.state === "idle") fetcher.load("/menu");
},[fetcher]);
  const {
    id,
    status,
    priority,
    priorityPrice,
    orderPrice,
    estimatedDelivery,
    cart,
  } = order;

  const deliveryIn = calcMinutesLeft(estimatedDelivery);

  return (
    <div className="space-y-8 px-4 py-6">
      <div className="flex items-center justify-between flex-wrap">
        <h2 className="text-xl font-semibold">order # {id} Status</h2>
        <div className="space-x-2">
          {priority && (<span className="rounded-full bg-red-500 px-3 py-1 text-sm font-semibold uppercase text-red-50 tracking tracking-wide ">Priority</span>)}
          <span className="rounded-full bg-green-500 px-3 py-1 text-sm font-semibold uppercase  tracking tracking-wide text-green-50">{status} order</span>
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2 bg-stone-200 px-6 py-5">
        <p className="font-medium">
          {deliveryIn >= 0
            ? `Only ${deliveryIn} minutes left 😃`
            : "Order should have arrived"}
        </p>
        <p className="text-xs text-stone-500">(Estimated delivery: {formatDate(estimatedDelivery)})</p>
      </div>
<ul className="divide-stone-200 divide-y border-b border-t">{cart.map(item=><OrderItem item={item} key={item.id} isLoadingIngredients={fetcher.state === "loading"} ingredients = {fetcher.data?.find((el) => el.id === item.pizzaId).ingredients}/>)}</ul>
      <div className="space-y-2 bg-stone-200 px-6 py-5">
        <p className="text-sm font-medium text-stone-600">Price pizza: {formatCurrency(orderPrice)}</p>
        {priority && <p>Price priority: {formatCurrency(priorityPrice)}</p>}
        <p className="font-bold">To pay on delivery: {formatCurrency(orderPrice + priorityPrice)}</p>
      </div>
      {!priority && <UpdateOrder order = {order}/>}
    </div>
  );
}

export async function loader({ params }) {
  const order = await getOrder(params.orderId);
  return order;
}

export default Order;

/* eslint-disable react-refresh/only-export-components, no-unused-vars */

import { updateOrder } from "../../services/apiRestaurant";
import Button from "../../ui/Button";
import { useFetcher } from "react-router-dom";

export default function UpdateOrder() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="patch" className="text-right">
      <Button type="primary">Make priority</Button>
    </fetcher.Form>
  );
}

export async function action({ request, params }) {
  const data = { priority: true };
  await updateOrder(params.orderId, data);
  return null;
}

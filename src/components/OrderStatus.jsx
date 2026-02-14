import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { orderService } from "../services/api";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { CheckCircle2, Clock, Truck, Package } from "lucide-react";
import { Button } from "./ui/button";

const statusConfig = {
  "Order Received": {
    icon: Package,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  Preparing: {
    icon: Clock,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  "Out for Delivery": {
    icon: Truck,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  Delivered: {
    icon: CheckCircle2,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
};

const OrderStatus = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let intervalId = null;

    const fetchOrder = async () => {
      try {
        const response = await orderService.getById(orderId);
        setOrder(response.data);
        return response.data;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setLoading(false);
      }
    };

    fetchOrder().then((data) => {
      // Only poll while order is not Delivered
      if (data?.status !== "Delivered") {
        intervalId = setInterval(async () => {
          const updated = await fetchOrder();
          if (updated?.status === "Delivered" && intervalId) {
            clearInterval(intervalId);
          }
        }, 5000);
      }
    });

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading order status...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">
          Error: {error || "Order not found"}
        </div>
      </div>
    );
  }

  const statusInfo =
    statusConfig[order.status] || statusConfig["Order Received"];
  const StatusIcon = statusInfo.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Status</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold">{order._id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer Name</p>
              <p className="font-semibold">{order.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivery Address</p>
              <p className="font-semibold">{order.customerAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-semibold">{order.customerPhone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="font-semibold text-lg text-green-600">
                ${order.totalAmount.toFixed(2)}
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/")} className="w-full">
              Back to Menu
            </Button>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <div
                className={`${statusInfo.bgColor} ${statusInfo.color} p-6 rounded-full mb-4`}
              >
                <StatusIcon className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{order.status}</h2>
              <p className="text-gray-500 text-center">
                {order.status === "Order Received" &&
                  "Your order has been received and is being processed."}
                {order.status === "Preparing" &&
                  "Your order is being prepared in the kitchen."}
                {order.status === "Out for Delivery" &&
                  "Your order is on the way to you!"}
                {order.status === "Delivered" &&
                  "Your order has been delivered. Enjoy your meal!"}
              </p>
            </div>
            <div className="mt-8 space-y-4">
              <h3 className="font-semibold mb-4">Order Items</h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-2">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between ">
                <span>Total Amount </span>
                <p className="font-semibold text-lg text-green-600">
                  ${order.totalAmount.toFixed(2)}
                </p>{" "}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OrderStatus;

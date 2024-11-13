"use client";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Chain, MatchedOrder } from "@gardenfi/orderbook";
import { OrderStatus } from "@gardenfi/core";
import { useGarden } from "@gardenfi/react-hooks";
import { API, parseStatus } from "../utils/helper";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { cardVariants } from "@/utils/animations";

function TransactionsComponent() {
  const { garden, orderBook } = useGarden();
  const [orders, setOrders] = useState<MatchedOrder[]>([]);
  const [blockNumbers, setBlockNumbers] = useState<Record<Chain, number> | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!orderBook) return;
    const res = await orderBook.fetchOrders(true, false, {
      per_page: 6,
    });
    setOrders(res.val.data);
  }, [orderBook]);

  useEffect(() => {
    fetchOrders();
    const intervalId = setInterval(fetchOrders, 10000);
    return () => clearInterval(intervalId);
  }, [fetchOrders]);

  useEffect(() => {
    if (!orderBook) return;
    const fetchBlockNumbers = async () => {
      const res = await axios.get<{ [key in Chain]: number }>(API().data.blockNumbers("testnet"));
      setBlockNumbers(res.data);
    };
    fetchBlockNumbers();
  }, [garden, orderBook]);

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="h-full w-full overflow-hidden ml-20 pl-4 pb-4"
    >
      <Card className="w-full h-full overflow-hidden">
        <CardHeader>
          <CardTitle>Swap History</CardTitle>
        </CardHeader>
        <CardContent className="h-full overflow-y-auto no-scrollbar">
          {orders.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar">
              {orders.map((order) => (
                <motion.div
                  key={order.created_at}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Card className="overflow-hidden shadow-sm">
                    <OrderComponent order={order} status={parseStatus(order, blockNumbers)} />
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <p>No transactions found.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

type Order = {
  order: MatchedOrder;
  status?: OrderStatus;
};

const OrderComponent: React.FC<Order> = ({ order, status }) => {
  const [isInitiating, setIsInitiating] = useState(false);
  const { evmInitiate } = useGarden();

  const handleInitiate = async () => {
    if (!evmInitiate) return;
    setIsInitiating(true);
    const res = await evmInitiate(order);
    if (res.ok) {
      console.log("Initiated");
      status = OrderStatus.InitiateDetected;
    } else {
      alert("Failed to initiate");
    }
    setIsInitiating(false);
  };

  const { source_swap, destination_swap } = order;

  const wbtcAmount = source_swap.amount;
  const btcAmount = destination_swap.amount;
  const fromLabel = source_swap.asset.toLowerCase() === "btc" ? "BTC" : "WBTC";
  const toLabel = fromLabel === "BTC" ? "WBTC" : "BTC";
  const userFriendlyStatus = status ? getUserFriendlyStatus(status) : StatusLabel.Pending;

  return (
    <CardContent>
      <p>
        <strong>Order ID:</strong> {source_swap.swap_id}
      </p>
      <p>
        <strong>From:</strong> {fromLabel} - {wbtcAmount}
      </p>
      <p>
        <strong>To:</strong> {toLabel} - {btcAmount}
      </p>
      <p>
        <strong>Status:</strong> {userFriendlyStatus}
      </p>
      {userFriendlyStatus === StatusLabel.Initiate && (
        <button
          className={`button-${isInitiating ? "black" : "white"}`}
          disabled={isInitiating}
          onClick={handleInitiate}
        >
          {isInitiating ? "Initiating..." : "Initiate"}
        </button>
      )}
    </CardContent>
  );
};

enum StatusLabel {
  Completed = "Completed",
  Pending = "In progress...",
  Expired = "Expired",
  Initiate = "Awaiting initiate",
}

const getUserFriendlyStatus = (status: OrderStatus): StatusLabel => {
  switch (status) {
    case OrderStatus.Redeemed:
    case OrderStatus.Refunded:
    case OrderStatus.CounterPartyRedeemed:
    case OrderStatus.CounterPartyRedeemDetected:
      return StatusLabel.Completed;
    case OrderStatus.Matched:
      return StatusLabel.Initiate;
    case OrderStatus.DeadLineExceeded:
      return StatusLabel.Expired;
    default:
      return StatusLabel.Pending;
  }
};

export default TransactionsComponent;

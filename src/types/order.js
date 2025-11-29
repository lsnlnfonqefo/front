export const OrderItemSchema = {
  productId: "string",
  productName: "string",
  productImage: "string",
  size: "number",
  price: "number",
  quantity: "number",
};

export const OrderSchema = {
  id: "string",
  userId: "string",
  items: ["OrderItemSchema"],
  totalAmount: "number",
  orderDate: "Date",
  status: "string",
};

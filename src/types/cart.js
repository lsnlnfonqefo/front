export const CartItemSchema = {
  id: "string",
  productId: "string",
  productName: "string",
  productImage: "string",
  size: "number",
  price: "number",
  quantity: "number",
};

export const CartSchema = {
  items: ["CartItemSchema"],
  totalQuantity: "number",
  totalPrice: "number",
};

export type CartItem = {
  productId: string;
  name: string;
  imageUrl: string | null;
  sizeLabel: string | null;
  unitPrice: number;
  quantity: number;
};

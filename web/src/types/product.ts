export type Product = {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  stock: number;
  sales: number;
  rating?: number;
};

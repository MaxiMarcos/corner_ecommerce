export interface ProductVariant {
  id: number;
  size: string;
  color: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
}

export interface Product {
  id: number;
  name: string;
  imageUrl: string;
  totalStock: number;
  lowStock: boolean;
  categoryId: number;
  supplierId: number;
  variants: ProductVariant[];
}

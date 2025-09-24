export interface Item {
  id?: number;
  name: string;
  category_id: number | null;
  price: number;
  created_at: string;
}

export interface ItemCategory {
  id?: number;
  name: string;
}

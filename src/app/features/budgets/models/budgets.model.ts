import { State } from '@features/states/models/states.model';

export interface Budget {
  id: number;
  name: string;
  subtotal: number;
  iva: number;
  total: number;
  created_at: string;
  conditions: string;

  company_id?: number | null;
  company_name: string;
  company_address: string;
  company_nif: string;
  company_phone: string;
  company_email: string;

  client_id?: number | null;
  client_name: string;
  client_address: string;
  client_phone: string;
  client_email: string;

  status_id?: number | null;
  status: State;

  user_id?: number | null;

  items?: BudgetItem[];
}

export interface BudgetWithPrice
  extends Omit<Budget, 'subtotal' | 'iva' | 'total'> {
  price: BudgetPrice;
}

export interface BudgetItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  budget_id?: number | null;
}

export interface BudgetPrice {
  subtotal: number;
  iva: number;
  total: number;
}

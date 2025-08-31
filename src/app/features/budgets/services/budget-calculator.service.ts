import { Injectable } from '@angular/core';
import { BudgetItem, BudgetPrice } from '../models/budgets.model';

@Injectable({
  providedIn: 'root',
})
export class BudgetCalculatorService {
  calculateSubtotal(items: BudgetItem[]): number {
    if (!items?.length) return 0;

    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  calculateTotal(subtotal: number, iva: number): number {
    return subtotal * (1 + iva / 100);
  }

  calculatePrice(items: BudgetItem[], iva: number): BudgetPrice {
    const subtotal = this.calculateSubtotal(items);
    const total = this.calculateTotal(subtotal, iva);
    return { subtotal, iva, total };
  }
}


export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum IncomeCategory {
  SALARY = 'Salary',
  FREELANCE = 'Freelance',
  ROI = 'ROI',
  OTHER = 'Other'
}

export enum ExpenseType {
  FIXED = 'Fixed',
  VARIABLE = 'Variable'
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  note: string;
  expenseType?: ExpenseType;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
}

export interface CustomCategory {
  name: string;
  icon: string;
}

export interface Budget {
  category: string;
  limit: number;
  rollover: boolean;
  icon?: string;
}

export interface Quote {
  text: string;
  author: string;
  book?: string;
}

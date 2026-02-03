
import { Quote, Transaction, TransactionType, IncomeCategory, ExpenseType, Goal } from './types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: '1', type: TransactionType.INCOME, category: IncomeCategory.SALARY, amount: 5000, date: '2023-11-01', note: 'Monthly Salary' },
  { id: '2', type: TransactionType.INCOME, category: IncomeCategory.FREELANCE, amount: 1200, date: '2023-11-05', note: 'UI Design Project' },
  { id: '3', type: TransactionType.EXPENSE, category: 'Rent', amount: 1500, date: '2023-11-01', note: 'Monthly Rent', expenseType: ExpenseType.FIXED },
  { id: '4', type: TransactionType.EXPENSE, category: 'Groceries', amount: 400, date: '2023-11-10', note: 'Weekly Shopping', expenseType: ExpenseType.VARIABLE },
  { id: '5', type: TransactionType.INCOME, category: IncomeCategory.ROI, amount: 300, date: '2023-11-15', note: 'Dividends' },
];

export const INITIAL_GOALS: Goal[] = [
  { id: 'g1', name: 'New iPhone 16 Pro', targetAmount: 1200, currentAmount: 450, deadline: '2024-03-01', icon: '📱' },
  { id: 'g2', name: 'House Downpayment', targetAmount: 50000, currentAmount: 12500, deadline: '2026-12-31', icon: '🏠' },
  { id: 'g3', name: 'Dream Car', targetAmount: 35000, currentAmount: 2000, deadline: '2025-06-30', icon: '🚗' },
];

export const FINANCIAL_WISDOM: Quote[] = [
  { text: "Do not save what is left after spending, but spend what is left after saving.", author: "Warren Buffett" },
  { text: "The goal isn't more money. The goal is living life on your terms.", author: "Chris Brogan" },
  { text: "Beware of little expenses; a small leak will sink a great ship.", author: "Benjamin Franklin" },
  { text: "Money is a terrible master but an excellent servant.", author: "P.T. Barnum" },
  { text: "Financial freedom is available to those who learn about it and work for it.", author: "Robert Kiyosaki", book: "Rich Dad Poor Dad" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { text: "Too many people spend money they haven't earned, to buy things they don't want, to impress people they don't like.", author: "Will Rogers" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "The rich invest in time, the poor invest in money.", author: "Warren Buffett" },
  { text: "It’s not how much money you make, but how much money you keep.", author: "Robert Kiyosaki" },
  { text: "Annual income twenty pounds, annual expenditure nineteen nineteen and six, result happiness.", author: "Charles Dickens" },
  { text: "Rich people have small TVs and big libraries, and poor people have small libraries and big TVs.", author: "Zig Ziglar" },
  { text: "If you live for people's acceptance, you will die from their rejection.", author: "Lecrae" },
  { text: "You must gain control over your money or the lack of it will forever control you.", author: "Dave Ramsey" },
  { text: "Buy when everyone else is selling and hold until everyone else is buying.", author: "J. Paul Getty" },
  { text: "Opportunity is missed by most people because it is dressed in overalls and looks like work.", author: "Thomas Edison" },
  { text: "Never spend your money before you have it.", author: "Thomas Jefferson" },
  { text: "Formal education will make you a living; self-education will make you a fortune.", author: "Jim Rohn" },
  { text: "A budget is telling your money where to go instead of wondering where it went.", author: "Dave Ramsey", book: "The Total Money Makeover" },
  { text: "Working because you want to, not because you have to, is financial freedom.", author: "Tony Robbins" }
];

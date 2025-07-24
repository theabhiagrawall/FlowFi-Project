export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  balance: number;
};

export type Transaction = {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  from?: Partial<User>;
  to?: Partial<User>;
};

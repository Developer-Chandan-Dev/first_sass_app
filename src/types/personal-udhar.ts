export interface PersonalContact {
  _id: string;
  userId: string;
  name: string;
  phone?: string;
  email?: string;
  type: 'lent' | 'borrowed';
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PersonalTransaction {
  _id: string;
  userId: string;
  contactId: string;
  type: 'lent' | 'borrowed' | 'payment';
  amount: number;
  description?: string;
  date: Date;
  createdAt: Date;
}

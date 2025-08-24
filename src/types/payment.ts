 export interface PaymentUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  played_games: number;
  nationality: string | null;
  email_verified_at: string | null;
  status: number;
  total_purchases_amount: string;
  is_logged_in: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PaymentPackage {
  id: number;
  name: string;
  games_count: string;
  price: string;
  number_of_buys: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Payment {
  id: number;
  order_id: string;
  amount: string;
  currency: string;
  user_id: number;
  package_id: number;
  receiver_id: number;
  is_gift: boolean;
  status: number;
  transaction_ref: string;
  payment_method: string;
  paytabs_response: any;
  created_at: string | null;
  updated_at: string | null;
  user: PaymentUser;
  receiver: PaymentUser;
  package: PaymentPackage;
}

export interface PaginatedPayments {
  data: Payment[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

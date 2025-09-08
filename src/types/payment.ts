 
 export interface ApiResponse<T> {
  success: boolean;
  status: number;
  locale: string;
  message: string;
  data: T;
}

export interface Paginated<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

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
  is_first_game: number;
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
  receiver_id: number | null;
  is_gift: boolean;
  status: number;
  transaction_ref: string | null;
  payment_method: string | null;
  paytabs_response: any;
  created_at: string | null;
  updated_at: string | null;
  user: PaymentUser;
  receiver: PaymentUser | null;
  package: PaymentPackage;
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
  receiver_id: number | null;
  is_gift: boolean;
  status: number;
  transaction_ref: string | null;
  payment_method: string | null;
  paytabs_response: any;
  created_at: string | null;
  updated_at: string | null;
  user: PaymentUser;
  receiver: PaymentUser | null;
  package: PaymentPackage;
}



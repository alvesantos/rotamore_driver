export interface Ride {
  id: string;
  user_id: string;
  vehicle_id?: string;
  vehicle_name?: string;
  vehicle_brand?: string;
  vehicle_plate?: string;
  vehicle_color?: string;
  customer_name: string;
  customer_phone: string;
  passengers_count: number;
  pickup: string;
  destination: string;
  notes?: string;
  ride_date: string; // YYYY-MM-DD
  ride_time: string; // HH:MM
  price: number;
  status: string; // 'agendada' | 'concluida' | 'cancelada'
  created_at?: string;
  updated_at?: string;
}


export interface Trip {
  id: number
  confirmation_number: string
  bus_number: string
  status: string
  start_date: string
  end_date: string
  grand_total: number
  days: number
  miles: number
  drive_minutes: number
  is_multiday: number
  group_id: number | null
  leg_order: number
  maint_cost: number
  labor_cost: number
  fuel_cost: number
  vehicle_cost: number
  trip_profit: number
  profit_per_day: number
}

export interface Stop {
  stop_type: string
  address: string
  lat?: number
  lon?: number
}

export interface Group {
  id: number
  name: string
  trips: Trip[]
}

export interface BulkRouteEvent {
  conf: string
  status: 'ok' | 'error' | 'skipped' | 'done'
  miles?: number
  drive_minutes?: number
  failed?: string[]
  message?: string
}

export type StatusFilter = 'all' | 'active' | 'cancelled'
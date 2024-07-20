export interface ShipmentApiResponseModel {
  status_history?: {
    date_delivered: string | null
  }
  order_id?: string
  pack_id?: any
}
export interface CommonResponseMLApi extends ShipmentApiResponseModel {
  status_history?: {
    date_delivered: string | null
  }
  order_id?: string
  pack_id?: any
}

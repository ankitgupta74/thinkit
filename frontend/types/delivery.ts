export type VehicleType = "bike" | "scooter" | "car";

export interface DeliveryPartner {
  _id: string;

  name: string;
  email: string;
  phone: string;

  avatar: string;

  vehicleType: VehicleType;

  isActive: boolean;

  createdAt: string;
}

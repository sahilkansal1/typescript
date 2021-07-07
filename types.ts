export interface Roles {
  customerName: string;
  id: number;
  key: number;
  role: string;
  createdBy: number;
  modifiedBy: number;
  createdAt: Date;
  modifiedAt: Date;
}
export interface Customer {
  customerName: string;
  id: number;
  website: string;
  address: string;
  createdBy: number;
  modifiedBy: number;
  createdAt: Date;
  modifiedAt: Date;
}
export interface UserInterface {
  createdAt: Date;
  modifiedAt: Date;
  firstName: string;
  id: number;
  middleName: string;
  lastName: string;
  phoneNo: number;
  email: string;
  roles: number;
  customer: number;
  address: string;
}

export interface IFarm {
  id: number;
  name: string;
  city: string;
  state: string;
  total_area: number;
  arable_area: number;
  vegetation_area: number;
  active: boolean;
  created_on: Date;
  updated_on: Date;
  deleted_on: Date;
}

export interface IFarmer {
  id: number;
  name: string;
  code: string;
  farms: IFarm[];
  active: boolean;
  created_on: Date;
  updated_on: Date;
  deleted_on: Date;
}

export interface IFarm {
  id: number;
  name: string;
  city: string;
  state: IFarmState;
  total_area: string;
  arable_area: string;
  vegetation_area: string;
  active?: boolean;
  user: IFarmer;
  harvests?: IHarvest[] | number[];
  created_on?: Date;
  updated_on?: Date;
  deleted_on?: Date;
}

export interface IFarmState {
  name: string;
  code: string;
}

export interface IFarmer {
  id: number;
  name: string;
  code: string;
  farms?: IFarm[];

  active: boolean;
  created_on?: Date;
  updated_on?: Date;
  deleted_on?: Date;
}

export interface IHarvest {
  id: number;
  name: string;
  crops: number[];
}

export interface ICrop {
  id: number;
  name: string;
  harvest?: number;
  farm?: number;
}

export type INewFarmer = Omit<IFarmer, "id">;

export interface OptionItem {
  readonly label: string;
  readonly value: string;
}

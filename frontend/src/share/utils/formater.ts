import { IFarm } from "../interfaces/app_interfaces";
import cityItems from "./../../share/data/citystate.json";
export const formatCpfCnpj = (value: string) => {
  const cleanedValue = value.replace(/\D/g, ""); // remove caracteres não numéricos

  if (cleanedValue.length <= 11) {
    // CPF
    return cleanedValue
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  } else {
    // CNPJ
    return cleanedValue
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
};

export const getStateByCode = (code: string) => {
  const existingState = cityItems.estados.findIndex((item) => {
    return item.sigla === code;
  });
  if (existingState !== -1) {
    return cityItems.estados[existingState].nome || code;
  }
  return code;
};

export const groupBy = <T extends Record<string, unknown>>(
  objectArray: T[],
  property: keyof T
) => {
  return objectArray.reduce((acc: { [x: string]: T[] }, obj: T) => {
    const key = obj[property] as unknown as string;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {} as { [x: string]: T[] });
};

export const getRandonHex = () => {
  return "#" + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6);
};

export const sumFarmsByState = (farms: IFarm[]) => {
  const result: { [key: string]: number } = {};
  farms.forEach((farm) => {
    const stateName = farm.state.name;

    if (!result[stateName]) {
      result[stateName] = 0;
    }
    result[stateName] += 1;
  });
  return result;
};

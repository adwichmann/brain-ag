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

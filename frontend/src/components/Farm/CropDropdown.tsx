import { useMemo } from "react";
import { useSelector } from "react-redux";

import Select from "react-select/creatable";
import { RootState } from "../../store";

interface CropDropdownProps {
  onChange: (value: unknown) => void;
  onCreate: (inputValue: string) => void;
  value: unknown;
}

export function CropDropdown({ onChange, onCreate, value }: CropDropdownProps) {
  const crops = useSelector((state: RootState) => state.farm.crops || []);
  const options = useMemo(
    () =>
      crops.map((crop) => ({
        value: crop.id,
        label: crop.name,
      })),
    [crops]
  );

  const colourStylesRow = {
    indicatorSeparator: () => ({ display: "none" }),
  };
  return (
    <Select
      options={options}
      onCreateOption={onCreate}
      onChange={onChange}
      value={value}
      styles={colourStylesRow}
      isClearable
      isMulti
      formatCreateLabel={(inputText) => `"${inputText}" adicionar nova safra?`}
      placeholder="Selecione"
      noOptionsMessage={() => "Não existem items para selecionar"}
    />
  );
}

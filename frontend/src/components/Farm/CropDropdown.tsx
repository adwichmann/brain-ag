import { useMemo } from "react";
import { useSelector } from "react-redux";

import Select from "react-select/creatable";
import { RootState } from "../../store";
import { OptionItem } from "../../share/interfaces/app_interfaces";

interface CropDropdownProps {
  onChange: (value: OptionItem[]) => void;
  onCreate: (inputValue: string) => void;
  value: OptionItem[] | null | undefined;
}

export function CropDropdown({ onChange, onCreate, value }: CropDropdownProps) {
  const crops = useSelector((state: RootState) => state.farm.crops || []);
  const options = useMemo(
    () =>
      crops.map((crop) => ({
        value: crop.id.toString(),
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
      onChange={(newValue) => onChange(newValue as OptionItem[])}
      value={value}
      styles={colourStylesRow}
      isClearable
      isMulti
      formatCreateLabel={(inputText) =>
        `"${inputText}" adicionar nova cultura?`
      }
      placeholder="Selecione"
      noOptionsMessage={() => "Não existem items para selecionar"}
    />
  );
}

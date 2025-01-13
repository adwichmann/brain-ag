import { useMemo } from "react";
import { useSelector } from "react-redux";

import Select from "react-select/creatable";
import { RootState } from "../../store";
import { OptionItem } from "../../share/interfaces/app_interfaces";

interface HarvestDropdownProps {
  onChange: (value: OptionItem) => void;

  onCreate: (inputValue: string) => void;

  value: OptionItem | null | undefined;
}

export function HarvestDropdown({
  onChange,
  onCreate,
  value,
}: HarvestDropdownProps) {
  const harvests = useSelector((state: RootState) => state.farm.harvests || []);
  const options = useMemo(
    () =>
      harvests.map((hervest) => ({
        value: hervest.id.toString(),
        label: hervest.name,
      })),
    [harvests]
  );

  const colourStylesRow = {
    indicatorSeparator: () => ({ display: "none" }),
  };
  return (
    <Select
      options={options}
      onCreateOption={onCreate}
      onChange={(newValue) => onChange(newValue as unknown as OptionItem)}
      value={value}
      styles={colourStylesRow}
      placeholder="Selecione"
      formatCreateLabel={(inputText) => `"${inputText}" adicionar nova Safra`}
      noOptionsMessage={() => "Não existem items para selecionar"}
    />
  );
}

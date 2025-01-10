import { useMemo } from "react";
import { useSelector } from "react-redux";

import Select from "react-select/creatable";
import { RootState } from "../../store";

interface HarvestDropdownProps {
  onChange: (value: unknown) => void;
  onCreate: (inputValue: string) => void;
  value: unknown;
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
        value: hervest.id,
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
      onChange={onChange}
      value={value}
      styles={colourStylesRow}
      placeholder="Selecione"
      formatCreateLabel={(inputText) => `"${inputText}" adicionar nova Safra`}
      noOptionsMessage={() => "Não existem items para selecionar"}
    />
  );
}

import { useMemo } from "react";
import { useGetHarvestsQuery } from "../../store/apiSlice";
import Select from "react-select/creatable";
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
  const { data: harvests = [] } = useGetHarvestsQuery();
  const options = useMemo(
    () =>
      harvests.map((harvest) => ({
        value: harvest.id.toString(),
        label: harvest.name,
      })),
    [harvests]
  );

  const colourStylesRow = {
    control: (styles: any) => ({
      ...styles,
      backgroundColor: "transparent",
      borderColor: "hsl(var(--input))",
      color: "hsl(var(--foreground))",
      "&:hover": {
        borderColor: "hsl(var(--ring))",
      },
    }),
    menu: (styles: any) => ({
      ...styles,
      backgroundColor: "hsl(var(--background))",
      border: "1px solid hsl(var(--border))",
    }),
    option: (styles: any, { isFocused, isSelected }: any) => ({
      ...styles,
      backgroundColor: isSelected
        ? "hsl(var(--primary))"
        : isFocused
          ? "hsl(var(--accent))"
          : "transparent",
      color: isSelected
        ? "hsl(var(--primary-foreground))"
        : isFocused
          ? "hsl(var(--accent-foreground))"
          : "hsl(var(--foreground))",
      "&:active": {
        backgroundColor: "hsl(var(--primary))",
      },
    }),
    singleValue: (styles: any) => ({
      ...styles,
      color: "hsl(var(--foreground))",
    }),
    input: (styles: any) => ({
      ...styles,
      color: "hsl(var(--foreground))",
    }),
    placeholder: (styles: any) => ({
      ...styles,
      color: "hsl(var(--muted-foreground))",
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (styles: any) => ({
      ...styles,
      color: "hsl(var(--muted-foreground))",
      "&:hover": {
        color: "hsl(var(--foreground))",
      },
    }),
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

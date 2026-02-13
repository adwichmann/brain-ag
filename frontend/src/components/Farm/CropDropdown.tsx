import { useMemo } from "react";
import { useGetCropsQuery } from "../../store/apiSlice";
import Select from "react-select/creatable";
import { OptionItem } from "../../share/interfaces/app_interfaces";

interface CropDropdownProps {
  onChange: (value: OptionItem[]) => void;
  onCreate: (inputValue: string) => void;
  value: OptionItem[] | null | undefined;
}

export function CropDropdown({ onChange, onCreate, value }: CropDropdownProps) {
  const { data: crops = [] } = useGetCropsQuery();
  const options = useMemo(
    () =>
      crops.map((crop) => ({
        value: crop.id.toString(),
        label: crop.name,
      })),
    [crops]
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
    multiValue: (styles: any) => ({
      ...styles,
      backgroundColor: "hsl(var(--accent))",
      color: "hsl(var(--accent-foreground))",
    }),
    multiValueLabel: (styles: any) => ({
      ...styles,
      color: "hsl(var(--accent-foreground))",
    }),
    multiValueRemove: (styles: any) => ({
      ...styles,
      color: "hsl(var(--accent-foreground))",
      "&:hover": {
        backgroundColor: "hsl(var(--destructive))",
        color: "hsl(var(--destructive-foreground))",
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

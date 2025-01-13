import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { useNavigate } from "react-router-dom";
import {
  ICrop,
  IFarm,
  IFarmer,
  IHarvest,
  OptionItem,
} from "../../share/interfaces/app_interfaces";
import { useToast } from "../../hooks/use-toast";
import {
  createFarm,
  fetchFarmerData,
  updateFarm,
  fetchHarvestsData,
  createHarvest,
  fetchCropsData,
  createCrop,
  updateHarvest,
} from "../../store/farmActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import cityItems from "./../../share/data/citystate.json";
import { useCallback, useEffect, useState } from "react";
import { farmActions } from "../../store/farmSlice";

import { HarvestDropdown } from "./HarvestDropdown";
import { CropDropdown } from "./CropDropdown";

const FormSchema = z
  .object({
    name: z.string().min(5, {
      message: "Nome da fazenda deve ter ao menos 5 caracteres.",
    }),
    city: z.string().min(2, {
      message: "Cidade deve ser preenchida.",
    }),
    state: z.string().min(2, {
      message: "Estado deve ser preenchida",
    }),
    total_area: z.string().refine((val) => !Number.isNaN(parseFloat(val)), {
      message: "Área total deve ser preenchida",
    }),
    arable_area: z.string().refine((val) => !Number.isNaN(parseFloat(val)), {
      message: "Área agricultável deve ser preenchida",
    }),
    vegetation_area: z
      .string()
      .refine((val) => !Number.isNaN(parseFloat(val)), {
        message: "Área de vegetação deve ser preenchida",
      }),
    user: z.string(),
    feedback_area: z.string(),
  })
  .superRefine((values, ctx) => {
    if (
      parseFloat(values.arable_area) + parseFloat(values.vegetation_area) >
      parseFloat(values.total_area)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "*A soma das áreas agricultável e de vegetação não pode ser maior que a área total",
        path: ["feedback_area"],
      });
    }
  });

const FarmForm = ({
  create,
  closemodal,
}: {
  create?: boolean;
  closemodal?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const selectedFarm = useSelector(
    (state: RootState) => state.farm.selectedFarm
  );

  const farmers = useSelector((state: RootState) => state.farm.farmers);
  //const harvests = useSelector((state: RootState) => state.farm.harvests || []);
  const [selectedState, setSelectedState] = useState(
    selectedFarm?.state.code || ""
  );
  const [selectedCity, setSelectedCity] = useState<string[]>([]);

  const { toast } = useToast();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedHarvest, setSelectedHarvest] = useState<number | null>();
  const [selectedCrop, setSelectedCrop] = useState<number[]>([]);
  const [inputHarvestValue, setHarvestValue] = useState<OptionItem | null>();
  const [inputCropValue, setCropValue] = useState<OptionItem[]>([]);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: !create
      ? {
          name: selectedFarm?.name || "",
          city: selectedFarm?.city || "",
          state: selectedFarm?.state.code || "",
          total_area: selectedFarm?.total_area.toString() || "0",
          arable_area: selectedFarm?.arable_area.toString() || "0",
          vegetation_area: selectedFarm?.vegetation_area.toString() || "0",
          user: selectedFarm?.user?.name || "",
          feedback_area: "",
        }
      : {
          name: "",
          city: "",
          state: "",
          total_area: "0",
          arable_area: "0",
          vegetation_area: "0",
          user: "",
          feedback_area: "",
        },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (selectedFarm) {
      const farm: IFarm = {
        name: data.name,
        id: selectedFarm.id,
        active: true,
        user: selectedFarm.user,
        city: data.city,
        state: { code: data.state, name: "" },
        total_area: data.total_area,
        arable_area: data.arable_area,
        vegetation_area: data.vegetation_area,
        harvests: selectedHarvest ? [selectedHarvest] : [],
      };

      if (selectedHarvest) {
        const harvestUpdate: Omit<IHarvest, "name"> = {
          id: selectedHarvest,
          crops: selectedCrop,
        };
        dispatch(updateHarvest(harvestUpdate));
      }

      dispatch(updateFarm(farm));
      toast({
        title: "Fazenda atualizada com sucesso",
      });

      const timeout = setTimeout(() => {
        if (closemodal) closemodal(false);
        navigate("/farm");
      }, 500);

      return () => clearTimeout(timeout);
    } else {
      const farm: Omit<IFarm, "id"> = {
        name: data.name,
        active: true,
        user: +data.user as unknown as IFarmer,
        city: data.city,
        state: { code: data.state, name: "" },
        total_area: data.total_area,
        arable_area: data.arable_area,
        vegetation_area: data.vegetation_area,
        harvests: selectedHarvest ? [selectedHarvest] : [],
      };

      dispatch(createFarm(farm));
      if (selectedHarvest) {
        const harvestUpdate: Omit<IHarvest, "name"> = {
          id: selectedHarvest,
          crops: selectedCrop,
        };
        dispatch(updateHarvest(harvestUpdate));
      }
      toast({
        title: "Fazenda creada com sucesso",
      });

      const timeout = setTimeout(() => {
        if (closemodal) closemodal(false);
        navigate("/farm");
      }, 500);

      return () => clearTimeout(timeout);
    }
  };

  const handleStateChage = useCallback((value: string) => {
    setSelectedState(value);

    const existingCitys = cityItems.estados.findIndex((item) => {
      return item.sigla === value;
    });
    if (existingCitys !== -1) {
      setSelectedCity(cityItems.estados[existingCitys].cidades);
    }
  }, []);

  useEffect(() => {
    if (selectedState) {
      const existingCitys = cityItems.estados.findIndex((item) => {
        return item.sigla === selectedState;
      });
      if (existingCitys !== -1) {
        setSelectedCity(cityItems.estados[existingCitys].cidades);
      }
    }
  }, [handleStateChage, selectedState]);

  useEffect(() => {
    if (create) {
      dispatch(farmActions.setSelectedFarm(null));
    }
  }, [create, dispatch]);

  useEffect(() => {
    dispatch(fetchHarvestsData());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCropsData());
  }, [dispatch]);

  useEffect(() => {
    if (selectedFarm?.harvests && selectedFarm?.harvests.length > 0) {
      const _crops: OptionItem[] = [];
      const cropsId: number[] = [];

      if (selectedFarm?.harvests.length > 0) {
        selectedFarm?.harvests.map((harvest) => {
          const _harvest = harvest as IHarvest;
          if (_harvest.crops)
            if (
              _harvest?.crops &&
              _harvest.crops &&
              _harvest.crops.length > 0
            ) {
              _harvest.crops.map((crop) => {
                const _currentCrop = crop as unknown as ICrop;
                _crops.push({
                  label: _currentCrop.name,
                  value: _currentCrop.id.toString(),
                });
                cropsId.push(_currentCrop.id);
              });
            }
        });
      }

      const _harvest: IHarvest | undefined =
        selectedFarm &&
        selectedFarm?.harvests &&
        selectedFarm?.harvests[0] &&
        typeof selectedFarm?.harvests[0] !== "number"
          ? (selectedFarm?.harvests[0] as IHarvest)
          : undefined;
      if (_harvest) {
        setHarvestValue({
          value: (_harvest && _harvest.id.toString()) || "",
          label: (_harvest && _harvest.name) || "",
        });
        setSelectedHarvest(_harvest.id);
      }
      setCropValue(_crops);
      setSelectedCrop(cropsId);
    }
  }, [selectedFarm, selectedFarm?.harvests]);

  const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });
  const handleCreate = async (item: string) => {
    const timeout = setTimeout(() => {
      const newOption = createOption(item);

      const NewHarvert = {
        name: item,
        crops: [],
      };
      dispatch(createHarvest(NewHarvert)).then((harvest) =>
        setSelectedHarvest(harvest.id)
      );

      setHarvestValue(newOption);
    }, 1000);

    return () => clearTimeout(timeout);
  };

  const handleCreateCrop = (crop: string) => {
    if (inputHarvestValue) {
      const timeout = setTimeout(() => {
        const newOption = createOption(crop);

        const newCrop = {
          name: crop,
          harvest: selectedHarvest ?? undefined,
        };

        dispatch(createCrop(newCrop));
        setCropValue([...inputCropValue, newOption]);
        //setCropValue((prev) => [...prev, newOption]);
      }, 1000);

      return () => clearTimeout(timeout);
    }
  };

  const handleChangeHarvest = (item: OptionItem) => {
    setSelectedHarvest(+item.value);
    setHarvestValue({ value: item.value, label: item.label });
    setSelectedCrop([]);
    setCropValue([]);
  };

  const handleChangeCrop = (item: OptionItem[]) => {
    const cropsId: number[] = [];
    item.map((i) => {
      cropsId.push(+i.value);
    });

    setSelectedCrop(cropsId);
    setCropValue(item);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input
                  defaultValue={selectedFarm?.name || ""}
                  placeholder="Nome da fazenda"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {create ? (
          <FormField
            control={form.control}
            name="user"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Produtor</FormLabel>
                <Select
                  onValueChange={(value) => {
                    return field.onChange(value);
                  }}
                  // defaultValue={selectedFarm?.user?.name || ""}
                  onOpenChange={() => {
                    dispatch(fetchFarmerData());
                  }}
                  {...field}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o produtor" />
                  </SelectTrigger>
                  <SelectContent>
                    {farmers.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="user"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Produtor</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={selectedFarm?.user?.name || ""}
                    placeholder="Produtor"
                    readOnly={true}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex gap-6 grid-cols-1 lg:grid-cols-2">
          <FormItem className="w-2/4">
            <FormLabel>Safra</FormLabel>
            <FormControl></FormControl>
            <HarvestDropdown
              // onChange={(newValue) => setSelectedOption(newValue.value)}
              onChange={handleChangeHarvest}
              value={inputHarvestValue}
              onCreate={handleCreate}
            />
            <FormDescription>
              Selecione ou digite para criar uma nova safra
            </FormDescription>
          </FormItem>

          {inputHarvestValue && inputHarvestValue.value !== "" && (
            <FormItem className="w-full">
              <FormLabel>Culturas plantadas</FormLabel>
              <FormControl></FormControl>
              <CropDropdown
                // onChange={(newValue) => setSelectedOption(newValue.value)}
                onChange={handleChangeCrop}
                value={inputCropValue}
                onCreate={handleCreateCrop}
              />
              <FormDescription>
                Selecione ou digite para criar uma nova cultura
              </FormDescription>
            </FormItem>
          )}
        </div>

        {/* <AddSelect defaultValue={selectedOption} options={options} /> */}

        <div className="flex gap-6 grid-cols-1 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado</FormLabel>
                <Select
                  onValueChange={(value2) => {
                    handleStateChage(value2);
                    return field.onChange(value2);
                  }}
                  defaultValue={field.value}
                  {...field}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {cityItems.estados.map((item) => (
                      <SelectItem key={item.sigla} value={item.sigla}>
                        {item.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {selectedCity && selectedCity.length > 0 && (
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Cidade</FormLabel>
                  <Select
                    onValueChange={(value2) => {
                      return field.onChange(value2);
                    }}
                    defaultValue={field.value}
                    {...field}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCity.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          )}
        </div>
        <div className="flex gap-6 grid-cols-1 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="total_area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área total</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Área total da fazenda"
                    defaultValue={selectedFarm?.total_area || ""}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Área total da fazenda (em hectares)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arable_area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área agricultável</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Área agricultável"
                    defaultValue={selectedFarm?.arable_area || ""}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Área agricultável (em hectares)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vegetation_area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área de vegetação</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Área de vegetação"
                    defaultValue={selectedFarm?.vegetation_area || ""}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Área de vegetação (em hectares)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div></div>
        <FormField
          control={form.control}
          name="feedback_area"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <p {...field}></p>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-right">
          <Button
            type="button"
            onClick={() => {
              dispatch(farmActions.setSelectedFarm(null));
              if (closemodal) closemodal(false);
              return navigate("/farm");
            }}
            variant="link"
          >
            Voltar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Form>
  );
};

export default FarmForm;

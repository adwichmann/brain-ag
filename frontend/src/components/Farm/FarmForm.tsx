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
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  ICrop,
  IHarvest,
  OptionItem,
} from "../../share/interfaces/app_interfaces";
import { useToast } from "../../hooks/use-toast";
import {
  useCreateCropMutation,
  useCreateFarmMutation,
  useCreateHarvestMutation,
  useGetCropsQuery,
  useGetFarmersQuery,
  useGetHarvestsQuery,
  useUpdateFarmMutation,
  useUpdateHarvestMutation,
} from "../../store/apiSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useEffect, useState } from "react";
import { farmActions } from "../../store/farmSlice";

import { HarvestDropdown } from "./HarvestDropdown";
import { CropDropdown } from "./CropDropdown";
import { useBrazilianLocations } from "../../hooks/useBrazilianLocations";

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
    feedback_area: z.string().optional(),
  })
  .superRefine((values, ctx) => {
    const total = parseFloat(values.total_area);
    const arable = parseFloat(values.arable_area);
    const vegetation = parseFloat(values.vegetation_area);

    if (arable + vegetation > total) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "*A soma das áreas agricultável e de vegetação não pode ser maior que a área total",
        path: ["feedback_area"],
      });
    }
  });

type FarmFormValues = z.infer<typeof FormSchema>;

const FarmForm = ({
  create,
  closemodal,
}: {
  create?: boolean;
  closemodal?: (open: boolean) => void;
}) => {
  const selectedFarm = useAppSelector((state) => state.farm.selectedFarm);
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [selectedHarvest, setSelectedHarvest] = useState<number | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<number[]>([]);
  const [inputHarvestValue, setHarvestValue] = useState<OptionItem | null>(null);
  const [inputCropValue, setCropValue] = useState<OptionItem[]>([]);

  const { data: farmers = [] } = useGetFarmersQuery();
  useGetHarvestsQuery();
  useGetCropsQuery();

  const [createFarmMutation] = useCreateFarmMutation();
  const [updateFarmMutation] = useUpdateFarmMutation();
  const [updateHarvestMutation] = useUpdateHarvestMutation();
  const [createHarvestMutation] = useCreateHarvestMutation();
  const [createCropMutation] = useCreateCropMutation();

  const { states, cities, handleStateChange } = useBrazilianLocations(
    selectedFarm?.state ?? ""
  );

  const form = useForm<FarmFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: !create && selectedFarm
      ? {
        name: selectedFarm.name,
        city: selectedFarm.city,
        state: selectedFarm.state,
        total_area: selectedFarm.total_area.toString(),
        arable_area: selectedFarm.arable_area.toString(),
        vegetation_area: selectedFarm.vegetation_area.toString(),
        user: selectedFarm.user?.id.toString() ?? "",
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

  const onSubmit = async (data: FarmFormValues) => {
    try {
      const farmData = {
        name: data.name,
        city: data.city,
        state: data.state,
        total_area: data.total_area,
        arable_area: data.arable_area,
        vegetation_area: data.vegetation_area,
        harvests: selectedHarvest ? [{ id: selectedHarvest } as IHarvest] : [],
      };

      if (selectedFarm) {
        await updateFarmMutation({
          ...farmData,
          id: selectedFarm.id,
          user: selectedFarm.user.id,
        } as any).unwrap();
        toast({ title: "Fazenda atualizada com sucesso" });
      } else {
        await createFarmMutation({
          ...farmData,
          user: parseInt(data.user),
        } as any).unwrap();
        toast({ title: "Fazenda criada com sucesso" });
      }

      void (async () => {
        try {
          if (selectedHarvest) {
            await updateHarvestMutation({
              id: selectedHarvest,
              crops: selectedCrop.map(id => ({ id } as ICrop)),
            } as any).unwrap();
          }
        } catch {
          // Error handled by global toast or silently
        }
      })();

      setTimeout(() => {
        if (closemodal) closemodal(false);
        navigate("/farm");
      }, 500);
    } catch {
      toast({
        title: "Erro ao salvar fazenda",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (create) {
      dispatch(farmActions.setSelectedFarm(null));
    }
  }, [create, dispatch]);

  useEffect(() => {
    if (selectedFarm?.harvests && selectedFarm.harvests.length > 0) {
      const harvest = selectedFarm.harvests[0];
      setSelectedHarvest(harvest.id);
      setHarvestValue({
        value: harvest.id.toString(),
        label: harvest.name,
      });

      const crops = harvest.crops || [];
      setSelectedCrop(crops.map(c => c.id));
      setCropValue(crops.map(c => ({
        label: c.name,
        value: c.id.toString(),
      })));
    }
  }, [selectedFarm]);

  const handleCreateHarvest = async (name: string) => {
    try {
      const harvest = await createHarvestMutation({ name, crops: [] } as any).unwrap();
      setSelectedHarvest(harvest.id);
      setHarvestValue({ label: name, value: harvest.id.toString() });
    } catch {
      toast({ title: "Erro ao criar safra", variant: "destructive" });
    }
  };

  const handleCreateCrop = async (name: string) => {
    if (!selectedHarvest) return;
    try {
      const crop = await createCropMutation({ name } as any).unwrap();
      const newOption = { label: name, value: crop.id.toString() };
      setCropValue(prev => [...prev, newOption]);
      setSelectedCrop(prev => [...prev, crop.id]);
    } catch {
      toast({ title: "Erro ao criar cultura", variant: "destructive" });
    }
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
                <Input placeholder="Nome da fazenda" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produtor</FormLabel>
              {create ? (
                <Select onValueChange={(val) => {
                  void field.onChange(val);
                }} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o produtor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {farmers.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <FormControl>
                  <Input value={selectedFarm?.user?.name || ""} readOnly disabled />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-6">
          <FormItem className="w-1/2">
            <FormLabel>Safra</FormLabel>
            <HarvestDropdown
              onChange={(item) => {
                setSelectedHarvest(parseInt(item.value));
                setHarvestValue(item);
                setSelectedCrop([]);
                setCropValue([]);
              }}
              value={inputHarvestValue}
              onCreate={handleCreateHarvest}
            />
            <FormDescription>Selecione ou crie uma safra</FormDescription>
          </FormItem>

          {inputHarvestValue && (
            <FormItem className="w-1/2">
              <FormLabel>Culturas</FormLabel>
              <CropDropdown
                onChange={(items) => {
                  setCropValue(items);
                  setSelectedCrop(items.map(i => parseInt(i.value)));
                }}
                value={inputCropValue}
                onCreate={handleCreateCrop}
              />
              <FormDescription>Selecione as culturas</FormDescription>
            </FormItem>
          )}
        </div>

        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Estado</FormLabel>
                <Select
                  onValueChange={(val) => {
                    void field.onChange(val);
                    handleStateChange(val);
                    form.setValue("city", "");
                  }}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s.sigla} value={s.sigla}>
                        {s.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Cidade</FormLabel>
                <Select
                  onValueChange={(val) => {
                    void field.onChange(val);
                  }}
                  value={field.value}
                  disabled={!cities.length}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Cidade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="total_area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área Total (ha)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="arable_area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área Agricultável (ha)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vegetation_area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área Vegetação (ha)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          name="feedback_area"
          render={() => <FormMessage />}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              dispatch(farmActions.setSelectedFarm(null));
              if (closemodal) closemodal(false);
              navigate("/farm");
            }}
          >
            Cancelar
          </Button>
          <Button type="submit">Salvar Fazenda</Button>
        </div>
      </form>
    </Form>
  );
};

export default FarmForm;

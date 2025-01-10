import {
  Form,
  FormControl,
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

import { formatCpfCnpj } from "../../share/utils/formater";

import { createFarmer, updateFarmer } from "../../store/farmActions";
import { IFarmer, INewFarmer } from "../../share/interfaces/app_interfaces";
import { useToast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { farmActions } from "../../store/farmSlice";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "O nome deve conter ao menos 3 caracteres.",
  }),
  code: z
    .string()
    .min(14, {
      message: "CPF/CNPJ deve conter ao menos 11 caracteres.",
    })
    .max(18, {
      message: "CPF/CNPJ deve conter no máximo 14 caracteres.",
    }),
});

const FarmerForm = ({
  create,
  closemodal,
}: {
  create?: boolean;
  closemodal?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const selectedFarmer = useSelector(
    (state: RootState) => state.farm.selectedFarmer
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: !create && selectedFarmer?.name ? selectedFarmer?.name : "",
      code:
        !create && selectedFarmer?.code
          ? formatCpfCnpj(selectedFarmer?.code)
          : "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (selectedFarmer) {
      const farmer: IFarmer = {
        name: data.name,
        code: data.code,
        id: selectedFarmer?.id,
        farms: [],
        active: true,
      };

      dispatch(updateFarmer(farmer));
      toast({
        title: "Produtor atualizado com sucesso",
      });

      const timeout = setTimeout(() => {
        if (closemodal) closemodal(false);
        navigate("/");
      }, 300);

      return () => clearTimeout(timeout);
    } else {
      const farmer: INewFarmer = {
        name: data.name,
        code: data.code,
        farms: [],
        active: true,
      };

      dispatch(createFarmer(farmer));
      toast({
        title: "Produtor cadastrado com sucesso",
      });

      const timeout = setTimeout(() => {
        navigate("/");
      }, 300);
      if (closemodal) closemodal(false);
      return () => clearTimeout(timeout);
    }
  }

  useEffect(() => {
    if (create) {
      dispatch(farmActions.setSelectedFarmer(null));
    }
  }, [create, dispatch]);

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
                  //  defaultValue={selectedFarmer?.name || ""}
                  placeholder="Nome do produtor"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field: { onChange, ...props } }) => (
            <FormItem>
              <FormLabel>CPF/CNPJ</FormLabel>
              <FormControl>
                <Input
                  maxLength={18}
                  placeholder="CPF/CNPJ"
                  onChange={(e) => {
                    const { value } = e.target;
                    e.target.value = formatCpfCnpj(value);
                    onChange(e);
                  }}
                  {...props}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="text-right">
          <Button type="submit">Salvar</Button>
          <Button
            type="button"
            onClick={() => {
              if (closemodal) closemodal(false);
              return navigate("/");
            }}
            variant="link"
          >
            Voltar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default FarmerForm;

import { useAppDispatch } from "../store/hooks";
import { getStateByCode } from "../share/utils/formater";

import { useEffect, useState } from "react";
import { IFarm } from "../share/interfaces/app_interfaces";
import DataTable, { TableColumn } from "react-data-table-component";
import { useDeleteFarmMutation, useGetFarmsQuery } from "../store/apiSlice";
import { Button } from "../components/ui/button";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import FarmForm from "../components/Farm/FarmForm";
import { farmActions } from "../store/farmSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

import LoaderSpin from "../components/Loader";

const FarmPage = () => {
  const { data: farms, isLoading: loading } = useGetFarmsQuery();
  const [deleteFarmMutation] = useDeleteFarmMutation();

  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [farmId, setFarmId] = useState<number | null>(null);
  const columns: TableColumn<IFarm>[] = [
    {
      name: "ID",
      selector: (row) => row.id,
      sortable: true,
      maxWidth: "25px",
    },
    {
      name: "Nome",
      selector: (row) => row.name,
      sortable: true,
    },

    {
      name: "Produtor",
      selector: (row) => (row?.user?.name ? row?.user?.name : "-"),
      sortable: true,
    },
    {
      name: "Estado",
      selector: (row) => getStateByCode(row.state),
      sortable: true,
    },
    {
      name: "Cidade",
      selector: (row) => (row?.city ? row?.city : "-"),
      sortable: true,
    },
    {
      name: "Área total",
      selector: (row) => (row?.total_area ? row?.total_area : "-"),
      sortable: true,
      center: true,
    },
    {
      name: "Área agricultável ",
      selector: (row) => (row?.arable_area ? row?.arable_area : "-"),
      sortable: true,
      center: true,
    },
    {
      name: "Área de vegetação ",
      selector: (row) => (row?.vegetation_area ? row?.vegetation_area : "-"),
      sortable: true,
      center: true,
    },
    {
      name: "Ações",

      cell: (row) => (
        <>
          <span className="mr-[10px]">
            <Button
              onClick={() => {
                //return navigate(`/farm/${row.id}`);
                dispatch(farmActions.setSelectedFarm(row));
                setOpenEdit(!openEdit);
              }}
              variant="blue"
            >
              Editar
            </Button>
          </span>
          <span>
            <Button
              variant="destructive"
              onClick={() => {
                setFarmId(row.id);
                setOpenDelete(!openDelete);
              }}
            >
              Excluir
            </Button>
          </span>
        </>
      ),
    },
  ];
  const handleDeleteFarm = async () => {
    if (farmId) {
      await deleteFarmMutation(farmId).unwrap();
    }
  };

  useEffect(() => {
    void dispatch(farmActions.setSelectedFarm(null));
  }, [dispatch]);

  if (loading) {
    return <LoaderSpin />;
  }
  if (openEdit) {
    return (
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Fazenda</DialogTitle>
            <DialogDescription>
              Atualize as Informações da fazenda
            </DialogDescription>
          </DialogHeader>
          <FarmForm create={false} closemodal={setOpenEdit} />
        </DialogContent>
      </Dialog>
    );
  }

  if (openDelete) {
    return (
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Deseja realmente excluir a fazenda?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFarm}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  return (
    <div className="page">
      <div className="flow-root">
        <h2 className="float-left text-[1.25rem] my-[0.5rem]">Lista de fazendas</h2>
        <span className="float-right">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="blue">
                <FaPlus />
                NOVA FAZENDA
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Fazenda</DialogTitle>
                <DialogDescription>
                  Informe os dados para adicionar uma nova fazenda ao produtor
                </DialogDescription>
              </DialogHeader>
              <FarmForm create={true} closemodal={setOpen} />
            </DialogContent>
          </Dialog>
        </span>
      </div>

      {farms && (
        <DataTable
          columns={columns}
          data={farms}
          progressPending={loading}
          highlightOnHover={true}
          onRowClicked={(row) => {
            dispatch(farmActions.setSelectedFarm(row));
            setOpenEdit(!openEdit);
          }}
          noDataComponent={<h1>Nenhuma fazenda cadastrada!</h1>}
        />
      )}
    </div>
  );
};

export default FarmPage;

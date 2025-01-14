import { useDispatch, useSelector } from "react-redux";
import classes from "./FarmerPage.module.css";
import { AppDispatch, RootState } from "../store";
import DataTable, { TableColumn } from "react-data-table-component";

import { useEffect, useState } from "react";
import { deleteFarmer, fetchFarmerData } from "../store/farmActions";
import { IFarmer } from "../share/interfaces/app_interfaces";

import { formatCpfCnpj } from "../share/utils/formater";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { FaPlus } from "react-icons/fa";
import FarmerForm from "../components/Farmer/FarmerForm";
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

const FarmerPage = () => {
  const farmers = useSelector((state: RootState) => state.farm.farmers);
  const loading = useSelector((state: RootState) => state.farm.loading);

  const dispatch: AppDispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [farmerId, setFarmerId] = useState<number | null>(null);
  const columns: TableColumn<IFarmer>[] = [
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
      width: "50%",
    },
    {
      name: "CNPJ/CPF",
      selector: (row) => formatCpfCnpj(row.code),
    },
    {
      name: "Ações",
      width: "13%",
      cell: (row) => (
        <div className="">
          <span className="button-edit">
            <Button
              onClick={() => {
                dispatch(farmActions.setSelectedFarmer(row));
                setOpenEdit(!openEdit);
                //return navigate(`/farmer/${row.id}`);
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
                setFarmerId(row.id);
                setOpenDelete(!openDelete);
              }}
            >
              Excluir
            </Button>
          </span>
        </div>
      ),
    },
  ];

  const handleDeleteFarmer = () => {
    if (farmerId) {
      dispatch(deleteFarmer(farmerId));
      dispatch(fetchFarmerData());
    }
  };

  useEffect(() => {
    dispatch(fetchFarmerData());
  }, [dispatch]);

  if (loading) {
    return <LoaderSpin />;
  }

  if (openEdit) {
    return (
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Produtor</DialogTitle>
            <DialogDescription>
              Atualize as informações do produtor
            </DialogDescription>
          </DialogHeader>
          <FarmerForm create={false} closemodal={setOpenEdit} />
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
              Deseja realmente excluir o produtor?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFarmer}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  return (
    <div className={`page ${classes.farmer}`}>
      <div className="flow-root">
        <h2 className="float-left">Lista de produtores</h2>
        <span className="float-right">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="blue">
                <FaPlus />
                NOVO PRODUTOR
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Produtor</DialogTitle>
                <DialogDescription>
                  Informe os dados para criar um novo produtor rural
                </DialogDescription>
              </DialogHeader>
              <FarmerForm create={true} closemodal={setOpen} />
            </DialogContent>
          </Dialog>
        </span>
      </div>
      {farmers && (
        <>
          <DataTable
            columns={columns}
            data={farmers}
            progressPending={loading}
            highlightOnHover={true}
            onRowClicked={(row) => {
              dispatch(farmActions.setSelectedFarmer(row));
              setOpenEdit(!openEdit);
            }}
            noDataComponent={<h1>Nenhum produtor cadastrado!</h1>}
          />
        </>
      )}
    </div>
  );
};

export default FarmerPage;

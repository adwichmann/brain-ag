import { useSelector } from "react-redux";
import classes from "./FarmerPage.module.css";
import { RootState } from "../store";
const FarmerPage = () => {
  const farmers = useSelector((state: RootState) => state.farm.farmers);
  return (
    <div className={`page ${classes.farmer}`}>
      <h2>Lista de produtores</h2>
      {farmers.length === 0 && <p>Nenhuma produtor cadastrado!</p>}
      {farmers && (
        <ul>
          {farmers.map((item) => {
            return <li key={item.id}>{item.name}</li>;
          })}
        </ul>
      )}
    </div>
  );
};

export default FarmerPage;

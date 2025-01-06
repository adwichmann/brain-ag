import { useSelector } from "react-redux";
import { RootState } from "../store";
import classes from "./FarmPage.module.css";

const FarmPage = () => {
  const farms = useSelector((state: RootState) => state.farm.farms);

  return (
    <div className={`page ${classes.farm}`}>
      <h2>Lista de fazendas</h2>
      {farms.length === 0 && <p>Nenhuma fazenda cadastrada!</p>}
      {farms && (
        <ul>
          {farms.map((item) => {
            return <li key={item.id}>{item.name}</li>;
          })}
        </ul>
      )}
    </div>
  );
};

export default FarmPage;

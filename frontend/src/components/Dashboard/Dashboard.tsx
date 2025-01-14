import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchFarmData } from "../../store/farmActions";
import CustomChart from "./CustomChart";
import { farmActions } from "../../store/farmSlice";
import { getRandonHex } from "../../share/utils/formater";
import { ChartData } from "../../share/interfaces/app_interfaces";
import LoaderSpin from "../Loader";

const Dashboard = () => {
  const dispatch: AppDispatch = useDispatch();

  const farms = useSelector((state: RootState) => state.farm.farms);
  const farmByState = useSelector(
    (state: RootState) => state.farm.farmsByState
  );

  const chartsData = useSelector((state: RootState) => state.farm.chartsData);
  const loading = useSelector((state: RootState) => state.farm.loading);
  const chartFarmStateData: ChartData[] = [];
  const chartAreaData: ChartData[] = [];
  const chartConfig: { [key: string]: { Label: string; color: string } } = {};
  const chartConfig2: { [key: string]: { Label: string; color: string } } = {};

  useEffect(() => {
    dispatch(fetchFarmData());
    dispatch(farmActions.getFarmsByState());
  }, [dispatch]);

  if (farmByState) {
    for (const a in farmByState) {
      const color = getRandonHex();
      chartFarmStateData.push({
        item: a,
        total: farmByState[a],
        fill: color,
      });
      chartConfig[a] = { Label: a, color: color };
    }
  }

  if (chartsData) {
    const total = chartsData.arable_area + chartsData.vegetation_area;
    const totalVegetationColor = getRandonHex();
    const totalArablecolor = getRandonHex();
    chartAreaData.push({
      item: "Vegetação",
      total: (chartsData.vegetation_area / total) * 100,
      fill: totalVegetationColor,
    });
    chartConfig2["Vegetação"] = {
      Label: "Vegetação",
      color: totalVegetationColor,
    };
    chartAreaData.push({
      item: "Agricultável",
      total: (chartsData.arable_area / total) * 100,
      fill: totalArablecolor,
    });
    chartConfig2["Agricultável"] = {
      Label: "Agricultável",
      color: totalArablecolor,
    };
  }

  if (loading) {
    return <LoaderSpin />;
  }
  return (
    <main className="page h-full text-center items-center">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="tracking-tight text-sm font-medium">
              Total de fazendas cadastradas
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="text-5xl font-bold">{farms.length ?? 0}</div>
          </div>
        </div>
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="tracking-tight text-sm font-medium">
              Total de hectares registrados
            </div>
          </div>
          <div className="p-6 pt-0">
            <div className="text-5xl font-bold">
              {chartsData.total_area ?? 0}
            </div>
          </div>
        </div>
        <CustomChart
          data={chartFarmStateData}
          config={chartConfig}
          dataKey="total"
          nameKey="item"
          title="Fazendas X Estados"
          description="Total de fazendas por estado"
        />
        <CustomChart
          data={chartAreaData}
          config={chartConfig2}
          dataKey="total"
          nameKey="item"
          title="Agricultável X Vegetação"
          description="Porcetagem do uso do solo"
        />
      </div>
    </main>
  );
};

export default Dashboard;

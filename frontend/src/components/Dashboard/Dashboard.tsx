import { useMemo } from "react";
import { useGetFarmsQuery } from "../../store/apiSlice";
import CustomChart from "./CustomChart";
import { getRandonHex, sumFarmsByState } from "../../share/utils/formater";
import { ChartData, IFarm } from "../../share/interfaces/app_interfaces";
import LoaderSpin from "../Loader";

const Dashboard = () => {
  const { data: farms = [], isLoading: loading } = useGetFarmsQuery();

  const { chartFarmStateData, chartAreaData, chartConfig, chartConfig2, totalArea } = useMemo(() => {
    const farmByState = sumFarmsByState(farms);
    const chartFarmStateData: ChartData[] = [];
    const chartConfig: Record<string, { Label: string; color: string }> = {};

    for (const state in farmByState) {
      const color = getRandonHex();
      chartFarmStateData.push({
        item: state,
        total: farmByState[state],
        fill: color,
      });
      chartConfig[state] = { Label: state, color: color };
    }

    let total_area = 0;
    let arable_area = 0;
    let vegetation_area = 0;
    farms.forEach((farm: IFarm) => {
      total_area += parseFloat(farm.total_area);
      arable_area += parseFloat(farm.arable_area);
      vegetation_area += parseFloat(farm.vegetation_area);
    });

    const totalCalculated = arable_area + vegetation_area;
    const totalVegetationColor = getRandonHex();
    const totalArablecolor = getRandonHex();

    const chartAreaData: ChartData[] = [
      {
        item: "Vegetação",
        total: totalCalculated > 0 ? (vegetation_area / totalCalculated) * 100 : 0,
        fill: totalVegetationColor,
      },
      {
        item: "Agricultável",
        total: totalCalculated > 0 ? (arable_area / totalCalculated) * 100 : 0,
        fill: totalArablecolor,
      },
    ];

    const chartConfig2 = {
      Vegetação: { Label: "Vegetação", color: totalVegetationColor },
      Agricultável: { Label: "Agricultável", color: totalArablecolor },
    };

    return { chartFarmStateData, chartAreaData, chartConfig, chartConfig2, totalArea: total_area };
  }, [farms]);

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
              {totalArea}
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

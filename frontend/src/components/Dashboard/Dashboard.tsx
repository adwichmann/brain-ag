import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchFarmData } from "../../store/farmActions";

const Dashboard = () => {
  const dispatch: AppDispatch = useDispatch();

  const farms = useSelector((state: RootState) => state.farm.farms);
  const [totalArea, setTotalArea] = useState<number>();

  useEffect(() => {
    dispatch(fetchFarmData());

    if (farms) {
      let areat_total = 0;
      farms.map((farm) => {
        areat_total += parseFloat(farm.total_area);
      });
      setTotalArea(areat_total);
    }
  }, [dispatch, farms]);
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
            <div className="text-5xl font-bold">{totalArea ?? 0}</div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;

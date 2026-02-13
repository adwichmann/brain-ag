import { useState, useCallback, useMemo } from "react";
import cityItems from "../share/data/citystate.json";

export const useBrazilianLocations = (initialState = "") => {
    const [selectedState, setSelectedState] = useState(initialState);

    const states = useMemo(() => {
        return cityItems.estados.map((s) => ({
            sigla: s.sigla,
            nome: s.nome,
        }));
    }, []);

    const cities = useMemo(() => {
        if (!selectedState) return [];
        const stateData = cityItems.estados.find((s) => s.sigla === selectedState);
        return stateData ? stateData.cidades : [];
    }, [selectedState]);

    const handleStateChange = useCallback((stateSigla: string) => {
        setSelectedState(stateSigla);
    }, []);

    return {
        states,
        cities,
        selectedState,
        handleStateChange,
    };
};

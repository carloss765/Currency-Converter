import React, { useState, useEffect } from "react";
import axios from "axios";
import Select, { SingleValue } from "react-select";
import WorldFlag from "react-world-flags";

const API_URL = "https://v6.exchangerate-api.com/v6/dff6f6e68d0b13ad3de60db7/latest/USD";

interface CurrencyOption {
  value: string;
  label: JSX.Element;
}

const CurrencyConverter: React.FC = () => {
  const [rates, setRates] = useState<{ [key: string]: number }>({});
  const [baseCurrency, setBaseCurrency] = useState<CurrencyOption | null>({ value: "USD", label: <div className="flex items-center"><WorldFlag code="US" style={{ width: 20, height: 20, marginRight: 10 }} />USD</div> });
  const [targetCurrency, setTargetCurrency] = useState<CurrencyOption | null>({ value: "EUR", label: <div className="flex items-center"><WorldFlag code="EU" style={{ width: 20, height: 20, marginRight: 10 }} />EUR</div> });
  const [amount, setAmount] = useState<number>(0);
  const [result, setResult] = useState<number | null>(null);

  // Carga las tasas de cambio desde la API al montar el componente
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get(API_URL);
        setRates(response.data.conversion_rates); // Guarda las tasas de cambio
      } catch (error) {
        console.error("Error al obtener tasas de cambio:", error);
      }
    };

    fetchRates();
  }, []);

  // Calcula el resultado de la conversión
  const handleConvert = () => {
    if (rates[baseCurrency?.value || ""] && rates[targetCurrency?.value || ""]) {
      let conversionRate;
      if (baseCurrency?.value === "USD") {
        conversionRate = rates[targetCurrency.value];
      } else if (targetCurrency?.value === "USD") {
        conversionRate = 1 / rates[baseCurrency?.value || ""];
      } else {
        conversionRate = rates[targetCurrency?.value || ""] / rates[baseCurrency?.value || ""];
      }
      setResult(amount * conversionRate);
    }
  };

  // Genera opciones para el select con banderas
  const generateOptions = () => {
    return Object.keys(rates).map((currency) => ({
      value: currency,
      label: (
        <div className="flex items-center">
          <WorldFlag code={currency.slice(0, 2)} style={{ width: 20, height: 20, marginRight: 10 }} />
          {currency}
        </div>
      ),
    }));
  };

  return (
    <div className="flex flex-col items-center p-6 bg-white min-h-screen rounded-lg shadow-lg">
      <h1 className="text-4xl font-bold mb-6 text-blue-800">Conversor de Monedas</h1>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
        {/* Ingresar monto */}
        <input
          type="number"
          placeholder="Ingrese cantidad"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-64 p-3 text-xl rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:border-blue-500"
        />

        {/* Seleccionar moneda base */}
        <Select
          value={baseCurrency}
          onChange={(selectedOption: SingleValue<CurrencyOption>) => setBaseCurrency(selectedOption)}
          options={generateOptions()}
          className="w-64 text-xl rounded-lg shadow-sm"
        />

        {/* Seleccionar moneda destino */}
        <Select
          value={targetCurrency}
          onChange={(selectedOption: SingleValue<CurrencyOption>) => setTargetCurrency(selectedOption)}
          options={generateOptions()}
          className="w-64 text-xl rounded-lg shadow-sm"
        />
      </div>

      {/* Botón para convertir */}
      <button
        onClick={handleConvert}
        className="w-64 p-3 bg-blue-600 text-white rounded-lg text-xl shadow-md hover:bg-blue-700"
      >
        Convertir
      </button>

      {/* Mostrar resultado */}
      {result !== null && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-2xl shadow-md">
          <p>
            {amount} {baseCurrency?.value} equivale a {result.toFixed(2)} {targetCurrency?.value}
          </p>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;

// Converter.js
import React, { useState, useEffect } from "react";
import "./Converter.css";

export default function Converter() {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("PKR");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const [currencies] = useState([
    "USD", "EUR", "PKR", "INR", "GBP", "JPY", "CAD", "AUD"
  ]);

  // ✅ Fetch exchange rate data on "from" or "to" change
  useEffect(() => {
    fetchExchangeRate();
  }, [from, to]);

  const fetchExchangeRate = async () => {
    setLoading(true);
    setError(null);

    try {
      // ✅ Working Free API (no key required)
      const response = await fetch(
        `https://open.er-api.com/v6/latest/${from}`
      );
      const data = await response.json();
      console.log("API Response:", data);

      if (data.result === "success" && data.rates[to]) {
        setExchangeRate(data.rates[to]);
        setLastUpdated(new Date(data.time_last_update_utc).toLocaleString());
      } else {
        setError("Failed to fetch exchange rate data");
        setExchangeRate(null);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Error fetching exchange rate data");
      setExchangeRate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = () => {
    if (exchangeRate) {
      setResult((amount * exchangeRate).toFixed(2));
    } else {
      setError("Exchange rate not available");
    }
  };

  const handleSwapCurrencies = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <div className="converter-container">
      <div className="converter-card">
        <header className="converter-header">
          <h2>Currency Converter</h2>
          {lastUpdated && (
            <p className="last-updated">Last updated: {lastUpdated}</p>
          )}
        </header>

        <div className="converter-body">
          <div className="amount-section">
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>

          <div className="currency-sections">
            <div className="currency-section">
              <label htmlFor="from">From</label>
              <select
                id="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>

            <button className="swap-btn" onClick={handleSwapCurrencies}>
              <i className="fas fa-exchange-alt"></i>
            </button>

            <div className="currency-section">
              <label htmlFor="to">To</label>
              <select
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {exchangeRate && (
            <div className="exchange-rate">
              1 {from} = {exchangeRate.toFixed(4)} {to}
            </div>
          )}

          <button
            className="convert-btn"
            onClick={handleConvert}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Converting...
              </>
            ) : (
              "Convert"
            )}
          </button>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i> {error}
            </div>
          )}

          {result !== null && !error && (
            <div className="result-section">
              <h3>
                {formatNumber(amount)} {from} = {formatNumber(result)} {to}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

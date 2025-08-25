'use client';

import { useState } from 'react';

interface Quote {
  fromAmount: number;
  fromCurrency: string;
  toCurrency: string;
  toAmount: number;
  rate: number;
  fees: number;
}

const CRYPTO_OPTIONS = [
  { value: 'usdc', label: 'USDC', symbol: 'USDC' },
];

const FIAT_OPTIONS = [
  { value: 'usd', label: 'USD (US Dollar)', symbol: '$' },
  { value: 'eur', label: 'EUR (Euro)', symbol: '€' },
  { value: 'sgd', label: 'SGD (Singapore Dollar)', symbol: 'S$' },
  { value: 'chf', label: 'CHF (Swiss Franc)', symbol: 'CHF' },
  { value: 'gbp', label: 'GBP (British Pound)', symbol: '£' },
];

export default function OfframpWidget() {
  const [amount, setAmount] = useState<string>('1,000');
  const [fromCurrency, setFromCurrency] = useState<string>('usdc');
  const [toCurrency, setToCurrency] = useState<string>('usd');
  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Helper function to format numbers with commas
  const formatNumber = (num: number, isRate: boolean = false) => {
    return num.toLocaleString('en-US', { 
      minimumFractionDigits: isRate ? 4 : 2, 
      maximumFractionDigits: isRate ? 6 : 2 
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-numeric characters except decimal points
    const cleanValue = e.target.value.replace(/[^0-9.]/g, '');
    
    // Handle decimal points - only allow one
    const parts = cleanValue.split('.');
    let formattedValue = parts[0];
    
    // Add commas to the integer part
    if (formattedValue) {
      formattedValue = parseInt(formattedValue).toLocaleString('en-US');
    }
    
    // Add decimal part back if it exists
    if (parts.length > 1) {
      formattedValue += '.' + parts[1];
    }
    
    setAmount(formattedValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      getQuote();
    }
  };

  const getQuote = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Parse amount removing commas
      const numericAmount = parseFloat(amount.replace(/,/g, ''));
      
      if (isNaN(numericAmount) || numericAmount <= 0) {
        throw new Error('Please enter a valid amount');
      }

      // Call our API route (which proxies to Request Finance API)
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input_currency: fromCurrency,
          input_amount: numericAmount,
          output_currency: toCurrency
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const conversion = data.conversion;
      
      if (!conversion) {
        throw new Error('Invalid response from API');
      }

      const newQuote: Quote = {
        fromAmount: conversion.input_amount,
        fromCurrency: conversion.input_currency.toUpperCase(),
        toCurrency: conversion.output_currency.toUpperCase(),
        toAmount: conversion.output_amount,
        rate: conversion.output_amount / conversion.input_amount,
        fees: conversion.fees || 0,
      };
      
      setQuote(newQuote);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get quote');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-1">
          I need to pay/send...
        </h2>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <input
          type="text"
          value={amount}
          onChange={handleAmountChange}
          onKeyDown={handleKeyDown}
          className="w-full text-3xl font-light text-gray-700 bg-transparent border-none outline-none placeholder-gray-400"
          placeholder="0"
        />
      </div>

      {/* Currency Selectors */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            From
          </label>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          >
            {CRYPTO_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            To
          </label>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer"
          >
            {FIAT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Get Quote Button */}
      <button
        onClick={getQuote}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 mb-4 cursor-pointer disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            Getting quote...
          </div>
        ) : (
          'Get a quote'
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Quote Result */}
      {quote && !error && (
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">You will receive</p>
            <p className="text-2xl font-semibold text-gray-800 break-all overflow-hidden">
              {FIAT_OPTIONS.find(f => f.value === quote.toCurrency.toLowerCase())?.symbol}
              {formatNumber(quote.toAmount)}
            </p>
            
            <p className="text-xs text-gray-500 mt-2 break-all">
              Rate: 1 {quote.fromCurrency} = {FIAT_OPTIONS.find(f => f.value === quote.toCurrency.toLowerCase())?.symbol}
              {formatNumber(quote.rate, true)} {quote.toCurrency}
            </p>
            
            {/* Fees Display */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 flex-shrink-0">Service fees:</span>
                <span className="text-gray-800 font-medium break-all text-right">
                  {formatNumber(quote.fees)} {quote.fromCurrency}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

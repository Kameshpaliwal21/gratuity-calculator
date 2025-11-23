import React, { useState } from 'react';
import './Calculator.css';

const Calculator = () => {
    const [basicSalary, setBasicSalary] = useState('');
    const [da, setDa] = useState('');
    const [years, setYears] = useState('');
    const [gratuity, setGratuity] = useState(null);

    const calculateGratuity = () => {
        const basic = parseFloat(basicSalary);
        const dearnessAllowance = parseFloat(da);
        const yearsOfService = parseFloat(years);

        if (isNaN(basic) || isNaN(dearnessAllowance) || isNaN(yearsOfService)) {
            alert('Please enter valid numbers for all fields');
            return;
        }

        // Formula: (Basic + DA) * 15/26 * Years
        const total = (basic + dearnessAllowance) * (15 / 26) * yearsOfService;
        setGratuity(total);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="calculator-container">
            <div className="calculator-card">
                <h2>Gratuity Calculator</h2>
                <div className="input-group">
                    <label htmlFor="basic">Monthly Basic Salary</label>
                    <input
                        type="number"
                        id="basic"
                        value={basicSalary}
                        onChange={(e) => setBasicSalary(e.target.value)}
                        placeholder="e.g. 50000"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="da">Dearness Allowance (DA)</label>
                    <input
                        type="number"
                        id="da"
                        value={da}
                        onChange={(e) => setDa(e.target.value)}
                        placeholder="e.g. 10000"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="years">Years of Service</label>
                    <input
                        type="number"
                        id="years"
                        value={years}
                        onChange={(e) => setYears(e.target.value)}
                        placeholder="e.g. 5"
                    />
                </div>
                <button onClick={calculateGratuity} className="calculate-btn">
                    Calculate Gratuity
                </button>

                {gratuity !== null && (
                    <div className="result-display">
                        <h3>Total Gratuity</h3>
                        <p className="amount">{formatCurrency(gratuity)}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Calculator;

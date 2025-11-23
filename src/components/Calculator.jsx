import React, { useState } from 'react';
import './Calculator.css';
import { parseFile, extractSalaryData } from '../utils/FileParser';

const Calculator = () => {
    const [basicSalary, setBasicSalary] = useState('');
    const [da, setDa] = useState('');
    const [years, setYears] = useState('');
    const [gratuity, setGratuity] = useState(null);
    const [isParsing, setIsParsing] = useState(false);
    const [parseError, setParseError] = useState(null);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsParsing(true);
        setParseError(null);

        try {
            const text = await parseFile(file);
            const { basic, da } = extractSalaryData(text);

            if (basic) setBasicSalary(basic.toString());
            if (da) setDa(da.toString());

            if (!basic && !da) {
                setParseError('Could not find "Basic Salary" or "DA" in the document. Please enter manually.');
            }
        } catch (error) {
            console.error('Parsing error:', error);
            setParseError(`Error parsing file: ${error.message || 'Unknown error'}. Please try another file.`);
        } finally {
            setIsParsing(false);
        }
    };

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

                <div className="file-upload-section">
                    <label className="file-upload-label">
                        <span>Upload Salary Slip (PDF/Word)</span>
                        <input
                            type="file"
                            accept=".pdf,.docx"
                            onChange={handleFileUpload}
                            disabled={isParsing}
                        />
                    </label>
                    {isParsing && <p className="status-text">Parsing file...</p>}
                    {parseError && <p className="error-text">{parseError}</p>}
                </div>

                <div className="divider">OR</div>

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

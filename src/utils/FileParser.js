import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Set worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export const parseFile = async (file) => {
    const fileType = file.type;

    if (fileType === 'application/pdf') {
        return await parsePDF(file);
    } else if (
        fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        return await parseDOCX(file);
    } else {
        throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
    }
};

const parsePDF = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let text = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str);
        text += strings.join(' ') + '\n';
    }

    return text;
};

const parseDOCX = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
};

export const extractSalaryData = (text) => {
    // Regex patterns to find Basic Salary and DA
    // Matches "Basic", "Basic Salary", "Basic Pay" followed by numbers
    const basicPattern = /(?:Basic|Basic\s+Salary|Basic\s+Pay)[\s:]*([\d,]+(?:\.\d{2})?)/i;

    // Matches "DA", "Dearness Allowance", "D.A." followed by numbers
    const daPattern = /(?:DA|Dearness\s+Allowance|D\.A\.)[\s:]*([\d,]+(?:\.\d{2})?)/i;

    const basicMatch = text.match(basicPattern);
    const daMatch = text.match(daPattern);

    const cleanNumber = (str) => {
        if (!str) return 0;
        return parseFloat(str.replace(/,/g, ''));
    };

    return {
        basic: basicMatch ? cleanNumber(basicMatch[1]) : null,
        da: daMatch ? cleanNumber(daMatch[1]) : null,
    };
};

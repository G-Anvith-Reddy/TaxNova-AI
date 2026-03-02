export interface TaxDetails {
    grossIncome: number;
    standardDeduction: number;
    totalDeductions: number;
    taxableIncome: number;
    baseTax: number;
    rebate: number;
    taxAfterRebate: number;
    cess: number;
    totalTax: number;
    netInHand: number;
}

export const calculateOldRegime = (
    income: number,
    investments80C: number,
    investments80D: number,
    age: number
): TaxDetails => {
    const standardDeduction = 50000;

    // Cap deductions
    const capped80C = Math.min(investments80C, 150000);
    const max80D = age >= 60 ? 50000 : 25000;
    const capped80D = Math.min(investments80D, max80D);

    const totalDeductions = standardDeduction + capped80C + capped80D;
    const taxableIncome = Math.max(0, income - totalDeductions);

    let baseTax = 0;

    if (taxableIncome > 250000) {
        if (taxableIncome <= 500000) {
            baseTax = (taxableIncome - 250000) * 0.05;
        } else if (taxableIncome <= 1000000) {
            baseTax = 12500 + (taxableIncome - 500000) * 0.20;
        } else {
            baseTax = 112500 + (taxableIncome - 1000000) * 0.30;
        }
    }

    // Old regime rebate under section 87A: available if taxable <= 5,00,000, max 12,500
    let rebate = 0;
    if (taxableIncome <= 500000) {
        rebate = Math.min(baseTax, 12500);
    }

    const taxAfterRebate = Math.max(0, baseTax - rebate);
    const cess = taxAfterRebate * 0.04;
    const totalTax = taxAfterRebate + cess;
    const netInHand = income - totalTax;

    return {
        grossIncome: income,
        standardDeduction,
        totalDeductions,
        taxableIncome,
        baseTax,
        rebate,
        taxAfterRebate,
        cess,
        totalTax,
        netInHand,
    };
};

export const calculateNewRegime = (income: number): TaxDetails => {
    const standardDeduction = 75000;
    const totalDeductions = standardDeduction;
    const taxableIncome = Math.max(0, income - totalDeductions);

    let baseTax = 0;

    // New Budget 2025 Slabs
    // 0-4L: 0%
    // 4L-8L: 5%
    // 8L-12L: 10%
    // 12L-16L: 15%
    // 16L-20L: 20%
    // 20L-24L: 25%
    // >24L: 30%

    if (taxableIncome > 400000) {
        if (taxableIncome <= 800000) {
            baseTax = (taxableIncome - 400000) * 0.05;
        } else if (taxableIncome <= 1200000) {
            baseTax = 20000 + (taxableIncome - 800000) * 0.10;
        } else if (taxableIncome <= 1600000) {
            baseTax = 60000 + (taxableIncome - 1200000) * 0.15;
        } else if (taxableIncome <= 2000000) {
            baseTax = 120000 + (taxableIncome - 1600000) * 0.20;
        } else if (taxableIncome <= 2400000) {
            baseTax = 200000 + (taxableIncome - 2000000) * 0.25;
        } else {
            baseTax = 300000 + (taxableIncome - 2400000) * 0.30;
        }
    }

    // New regime rebate under section 87A: available if taxable <= 12,00,000, refund on amount of tax needed
    let rebate = 0;
    if (taxableIncome <= 1200000) {
        rebate = Math.min(baseTax, 60000);
    }

    const taxAfterRebate = Math.max(0, baseTax - rebate);
    const cess = taxAfterRebate * 0.04;
    const totalTax = taxAfterRebate + cess;
    const netInHand = income - totalTax;

    return {
        grossIncome: income,
        standardDeduction,
        totalDeductions,
        taxableIncome,
        baseTax,
        rebate,
        taxAfterRebate,
        cess,
        totalTax,
        netInHand,
    };
};

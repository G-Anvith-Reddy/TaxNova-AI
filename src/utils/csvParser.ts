import Papa from 'papaparse';
import { Expense } from '../store/useStore';

interface ParseResult {
    expenses: Expense[];
    errors: string[];
}

/**
 * Robust CSV parser.
 * Handles formats like:
 *   Date, Description, Amount, Transaction_Type  (negative = debit)
 *   Date, Narration, Debit, Credit, Balance
 *   Date, Details, Dr, Cr
 *   ... and many other bank statement variants
 */
export const parseBankStatementCSV = (file: File): Promise<ParseResult> => {
    return new Promise((resolve) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (h) => h.trim(), // strip any leading/trailing spaces from headers
            complete: (results) => {
                const rows = results.data as any[];
                if (rows.length === 0) {
                    return resolve({ expenses: [], errors: ['CSV is empty'] });
                }

                const rawColumns = Object.keys(rows[0]);
                // Normalised lower-case → original column map
                const colMap = new Map<string, string>();
                rawColumns.forEach(col => colMap.set(col.toLowerCase().trim(), col));

                const findCol = (...keywords: string[]): string => {
                    for (const kw of keywords) {
                        for (const [lc, orig] of colMap.entries()) {
                            if (lc.includes(kw)) return orig;
                        }
                    }
                    return '';
                };

                const dateCol = findCol('date', 'time', ' dt', 'posted');
                const descCol = findCol('description', 'desc', 'narrat', 'particular', 'detail', 'remark', 'note', 'ref');
                const amountCol = findCol('amount', 'amt', 'txn amount', 'transaction amount');
                const typeCol = findCol('transaction_type', 'txn type', 'type', 'cr/dr', 'dr/cr', 'drcr');
                const debitCol = findCol('debit', ' dr');
                const creditCol = findCol('credit', ' cr');

                const expenses: Expense[] = [];
                const errors: string[] = [];

                rows.forEach((row, idx) => {
                    // ── 1. Date ──────────────────────────────────────────────
                    const date = (dateCol ? String(row[dateCol] || '').trim() : '') || new Date().toLocaleDateString('en-IN');

                    // ── 2. Description — use first non-empty text column if no match ─
                    let desc = descCol ? String(row[descCol] || '').trim() : '';
                    if (!desc) {
                        // Fallback: use first column whose value looks like text (not a number)
                        for (const col of rawColumns) {
                            const val = String(row[col] || '').trim();
                            if (val && isNaN(Number(val.replace(/,/g, '')))) {
                                desc = val;
                                break;
                            }
                        }
                    }
                    if (!desc) desc = `Transaction ${idx + 1}`;

                    // ── 3. Amount ────────────────────────────────────────────
                    let rawAmount = '';
                    let rawType = '';

                    if (amountCol && row[amountCol] !== undefined && String(row[amountCol]).trim() !== '') {
                        rawAmount = String(row[amountCol]).trim();
                        rawType = typeCol ? String(row[typeCol] || '').trim() : '';
                    } else if (creditCol && String(row[creditCol] || '').trim() !== '' && parseFloat(String(row[creditCol]).replace(/,/g, '')) > 0) {
                        rawAmount = String(row[creditCol]).trim();
                        rawType = 'credit';
                    } else if (debitCol && String(row[debitCol] || '').trim() !== '' && parseFloat(String(row[debitCol]).replace(/,/g, '')) > 0) {
                        rawAmount = String(row[debitCol]).trim();
                        rawType = 'debit';
                    } else {
                        // Last resort: pick the last numeric-looking column
                        for (let i = rawColumns.length - 1; i >= 0; i--) {
                            const col = rawColumns[i];
                            if (col === dateCol) continue;
                            const val = String(row[col] || '').replace(/,/g, '').trim();
                            if (val !== '' && !isNaN(parseFloat(val))) {
                                rawAmount = val;
                                break;
                            }
                        }
                    }

                    if (!rawAmount) {
                        errors.push(`Row ${idx + 2}: no amount found`);
                        return;
                    }

                    let amount = parseFloat(rawAmount.replace(/,/g, '').replace(/[₹$]/g, ''));
                    if (isNaN(amount)) {
                        errors.push(`Row ${idx + 2}: unparseable amount "${rawAmount}"`);
                        return;
                    }

                    // ── 4. Determine credit / debit ──────────────────────────
                    let type: 'credit' | 'debit';
                    const lType = rawType.toLowerCase();

                    if (lType.includes('cr') || lType.includes('credit')) {
                        type = 'credit';
                    } else if (lType.includes('dr') || lType.includes('debit')) {
                        type = 'debit';
                    } else if (amount < 0) {
                        type = 'debit';
                        amount = Math.abs(amount);
                    } else {
                        // Keyword fallback on description
                        const lDesc = desc.toLowerCase();
                        if (lDesc.match(/salary|credit|refund|cashback|interest earned/)) {
                            type = 'credit';
                        } else {
                            type = 'debit';
                        }
                    }
                    amount = Math.abs(amount); // always store positive

                    // ── 5. Category ──────────────────────────────────────────
                    const lDesc = desc.toLowerCase();
                    let category: Expense['category'] = 'Other';

                    if (type === 'credit') {
                        if (lDesc.match(/salary|payroll|ctc|employer/)) category = 'Salary';
                        else category = 'Other';
                    } else {
                        if (lDesc.match(/swiggy|zomato|mcdonald|domino|starbucks|cafe|restaurant|blinkit|dunzo/))
                            category = 'Food';
                        else if (lDesc.match(/rent|brokerage|housing|pg |paying guest/))
                            category = 'Rent';
                        else if (lDesc.match(/amazon|flipkart|myntra|shopping|meesho|nykaa|zara|h&m|d-mart/))
                            category = 'Shopping';
                        else if (lDesc.match(/electricity|bescom|water|bill|airtel|jio|recharge|broadband|internet|wifi/))
                            category = 'Utilities';
                        else if (lDesc.match(/lic|insurance|hdfc life|sbi life|star health|max bupa|care health|mediclaim/))
                            category = 'Insurance';
                        else if (lDesc.match(/zerodha|groww|upstox|ppf|mutual fund|sip|elss|nsc|nps|invest/))
                            category = 'Investments';
                        else
                            category = 'Other';
                    }

                    expenses.push({
                        id: `exp-${idx}-${Date.now()}`,
                        date: date,
                        description: desc,
                        amount: amount,
                        type: type,
                        category: category,
                    });
                });

                resolve({ expenses, errors });
            },
            error: (error) => {
                resolve({ expenses: [], errors: [`Parse error: ${error.message}`] });
            }
        });
    });
};

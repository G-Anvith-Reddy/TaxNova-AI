import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateOldRegime, calculateNewRegime, TaxDetails } from '../utils/taxCalculator';

export type RiskAppetite = 'low' | 'moderate' | 'high';

export interface UserProfile {
    grossIncome: number;
    age: number;
    monthlyFixedExpenses: number;
    riskAppetite: RiskAppetite;
    isTdsOn: boolean;
}

export interface InvestmentAllocation {
    id: string;
    name: string;
    amount: number;
    lockIn: number; // in years
    risk: RiskAppetite;
    projectedReturnRate: number; // e.g., 0.071 for PPF
}

export interface Expense {
    id: string;
    date: string;
    description: string;
    amount: number;
    category: 'Food' | 'Rent' | 'Utilities' | 'Shopping' | 'Insurance' | 'Investments' | 'Salary' | 'Other';
    type: 'credit' | 'debit';
}

export interface AppState {
    // User Profile
    user: UserProfile;
    updateUser: (profile: Partial<UserProfile>) => void;

    // Taxes
    oldRegime: TaxDetails;
    newRegime: TaxDetails;

    // Deductions
    used80C: number;
    used80D: number;

    // Investments
    allocations: InvestmentAllocation[];
    setAllocations: (allocations: InvestmentAllocation[]) => void;
    updateAllocation: (id: string, amount: number) => void;

    // Expenses / CSV Data
    expenses: Expense[];
    addExpenses: (newExpenses: Expense[]) => void;

    // Global compute trigger
    recomputeTaxes: () => void;
    loadDemoData: () => void;

    // Authentication
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

const initialUser: UserProfile = {
    grossIncome: 0,
    age: 30,
    monthlyFixedExpenses: 0,
    riskAppetite: 'moderate',
    isTdsOn: false,
};

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: initialUser,
            oldRegime: calculateOldRegime(0, 0, 0, 30),
            newRegime: calculateNewRegime(0),

            used80C: 0,
            used80D: 0,

            allocations: [],
            expenses: [],

            updateUser: (profile) => {
                set((state) => ({ user: { ...state.user, ...profile } }));
                get().recomputeTaxes();
            },

            setAllocations: (allocations) => {
                set({ allocations });
                get().recomputeTaxes();
            },

            updateAllocation: (id, amount) => {
                set((state) => ({
                    allocations: state.allocations.map((a) => (a.id === id ? { ...a, amount } : a))
                }));
                get().recomputeTaxes();
            },

            addExpenses: (newExpenses) => {
                set((state) => {
                    const combined = [...state.expenses, ...newExpenses];

                    // Auto-update income and 80C/80D based on parsed expenses
                    let newIncome = state.user.grossIncome;
                    let new80c = 0;
                    let new80d = 0;

                    combined.forEach(e => {
                        if (e.category === 'Salary') newIncome += e.amount;
                        if (e.category === 'Investments' && e.description.toLowerCase().match(/ppf|elss|lic|fd|nsc|epf/)) {
                            new80c += e.amount;
                        }
                        if (e.category === 'Insurance' && e.description.toLowerCase().match(/health|mediclaim/)) {
                            new80d += e.amount;
                        }
                    });

                    return {
                        expenses: combined,
                        used80C: new80c,
                        used80D: new80d,
                        user: { ...state.user, grossIncome: newIncome > 0 ? newIncome : state.user.grossIncome }
                    };
                });
                get().recomputeTaxes();
            },

            recomputeTaxes: () => {
                const { user, allocations, used80C, used80D } = get();

                // Sum from slider allocations plus any auto-detected 80C
                const manual80C = allocations.reduce((sum, a) => sum + a.amount, 0);
                const total80C = manual80C + used80C;

                const oldRegime = calculateOldRegime(user.grossIncome, total80C, used80D, user.age);
                const newRegime = calculateNewRegime(user.grossIncome);

                set({ oldRegime, newRegime });
            },

            loadDemoData: () => {
                const demoUser: UserProfile = {
                    grossIncome: 1200000,
                    age: 32,
                    monthlyFixedExpenses: 25000,
                    riskAppetite: 'moderate',
                    isTdsOn: false,
                };

                set({
                    user: demoUser,
                    used80C: 150000,
                    used80D: 25000,
                    expenses: [],
                    allocations: [],
                    isAuthenticated: true,
                });
                get().recomputeTaxes();
            },

            isAuthenticated: false,
            login: () => set({ isAuthenticated: true }),
            logout: () => {
                set({
                    isAuthenticated: false,
                    user: initialUser,
                    used80C: 0,
                    used80D: 0,
                    allocations: [],
                    expenses: []
                });
                get().recomputeTaxes();
            }
        }),
        {
            name: 'taxnova-storage', // name of the item in the storage (must be unique)
        }
    )
);

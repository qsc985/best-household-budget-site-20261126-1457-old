// Chen Family Ledger — the household's November 2026 figures.
//
// One fictional household (Maya & Daniel Chen, with Lily, 9, and Noah, 6),
// all amounts in US dollars. Every number the site shows is computed from
// this file, or from the visitor's own edits (kept in localStorage). The
// site makes no network request of any kind.

export const HOUSEHOLD = {
  name: 'The Chen Family',
  members: 'Maya & Daniel Chen, with Lily (9) and Noah (6)',
  monthLabel: 'November 2026',
  monthKey: '2026-11',
  today: 26, // the day of the month the dashboard treats as "today"
  daysInMonth: 30,
  currency: 'USD',
};

// Money coming in during November. Total: $9,850.00.
export const INCOME = [
  { id: 'inc-maya', source: 'Maya Chen — product designer salary', amount: 5100.0, day: 1 },
  { id: 'inc-daniel', source: 'Daniel Chen — high-school teacher salary', amount: 4400.0, day: 1 },
  { id: 'inc-side', source: 'Maya — freelance illustration', amount: 350.0, day: 18 },
];

// Spending categories. The colour travels with a category everywhere:
// chart slices, table tags and budget bars all use it.
export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#0f766e' },
  { id: 'groceries', label: 'Groceries', color: '#65a30d' },
  { id: 'dining', label: 'Dining out', color: '#ea580c' },
  { id: 'transport', label: 'Transport', color: '#2563eb' },
  { id: 'utilities', label: 'Utilities', color: '#7c3aed' },
  { id: 'entertainment', label: 'Entertainment', color: '#db2777' },
  { id: 'health', label: 'Health', color: '#0891b2' },
  { id: 'kids', label: 'Kids', color: '#d97706' },
  { id: 'shopping', label: 'Shopping', color: '#92400e' },
  { id: 'subscriptions', label: 'Subscriptions', color: '#64748b' },
  { id: 'childcare', label: 'Childcare', color: '#1d4ed8' },
  { id: 'car', label: 'Car & insurance', color: '#3f6212' },
];

// Monthly spending limits per category. Total budget: $7,255.00.
export const BUDGETS = [
  { category: 'housing', limit: 2200.0 },
  { category: 'groceries', limit: 950.0 },
  { category: 'dining', limit: 380.0 },
  { category: 'transport', limit: 340.0 },
  { category: 'utilities', limit: 430.0 },
  { category: 'entertainment', limit: 160.0 },
  { category: 'health', limit: 260.0 },
  { category: 'kids', limit: 520.0 },
  { category: 'shopping', limit: 320.0 },
  { category: 'subscriptions', limit: 65.0 },
  { category: 'childcare', limit: 990.0 },
  { category: 'car', limit: 640.0 },
];

// Every November 2026 purchase. Amounts are money spent (positive numbers);
// income lives in INCOME above. 42 entries, $6,301.11 in total.
export const TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', description: 'Mortgage payment', category: 'housing', amount: 1890.0 },
  { id: 't02', date: '2026-11-01', description: 'Little Acorns childcare', category: 'childcare', amount: 990.0 },
  { id: 't03', date: '2026-11-01', description: 'Streaming bundle', category: 'subscriptions', amount: 16.99 },
  { id: 't04', date: '2026-11-02', description: 'Whole Foods Market', category: 'groceries', amount: 148.2 },
  { id: 't05', date: '2026-11-02', description: 'After-school program', category: 'kids', amount: 215.0 },
  { id: 't06', date: '2026-11-03', description: 'Car payment — Honda CR-V', category: 'car', amount: 389.0 },
  { id: 't07', date: '2026-11-03', description: 'Gym membership', category: 'health', amount: 29.0 },
  { id: 't08', date: '2026-11-03', description: 'Pizza night — Tony’s', category: 'dining', amount: 48.9 },
  { id: 't09', date: '2026-11-04', description: 'Shell gas station', category: 'transport', amount: 71.5 },
  { id: 't10', date: '2026-11-05', description: 'HOA dues', category: 'housing', amount: 125.0 },
  { id: 't11', date: '2026-11-05', description: 'Music streaming', category: 'subscriptions', amount: 13.49 },
  { id: 't12', date: '2026-11-06', description: 'Trader Joe’s', category: 'groceries', amount: 102.45 },
  { id: 't13', date: '2026-11-06', description: 'CVS pharmacy', category: 'health', amount: 48.75 },
  { id: 't14', date: '2026-11-07', description: 'Electric bill — City Power', category: 'utilities', amount: 138.6 },
  { id: 't15', date: '2026-11-07', description: 'Bus passes (2)', category: 'transport', amount: 42.0 },
  { id: 't16', date: '2026-11-08', description: 'Sushi takeout — Kiko', category: 'dining', amount: 41.25 },
  { id: 't17', date: '2026-11-08', description: 'Winter coats for the kids', category: 'shopping', amount: 139.0 },
  { id: 't18', date: '2026-11-09', description: 'Costco run', category: 'groceries', amount: 186.75 },
  { id: 't19', date: '2026-11-09', description: 'School supplies', category: 'kids', amount: 92.4 },
  { id: 't20', date: '2026-11-10', description: 'Internet — NorthLink', category: 'utilities', amount: 92.0 },
  { id: 't21', date: '2026-11-10', description: 'Parking garage', category: 'transport', amount: 46.0 },
  { id: 't22', date: '2026-11-11', description: 'Dentist copay — Lily', category: 'health', amount: 125.0 },
  { id: 't23', date: '2026-11-12', description: 'Cloud storage', category: 'subscriptions', amount: 10.99 },
  { id: 't24', date: '2026-11-12', description: 'Chevron gas', category: 'transport', amount: 55.2 },
  { id: 't25', date: '2026-11-12', description: 'Water bill', category: 'utilities', amount: 67.4 },
  { id: 't26', date: '2026-11-13', description: 'Safeway', category: 'groceries', amount: 88.3 },
  { id: 't27', date: '2026-11-14', description: 'Family dinner — Olive Garden', category: 'dining', amount: 66.5 },
  { id: 't28', date: '2026-11-14', description: 'Household goods — Target', category: 'shopping', amount: 62.4 },
  { id: 't29', date: '2026-11-15', description: 'Phone bill — two lines', category: 'utilities', amount: 81.25 },
  { id: 't30', date: '2026-11-15', description: 'Movie night — Regal', category: 'entertainment', amount: 45.0 },
  { id: 't31', date: '2026-11-16', description: 'Soccer fees — Noah', category: 'kids', amount: 68.0 },
  { id: 't32', date: '2026-11-16', description: 'Coffee & bagels', category: 'dining', amount: 31.4 },
  { id: 't33', date: '2026-11-17', description: 'Trader Joe’s', category: 'groceries', amount: 129.6 },
  { id: 't34', date: '2026-11-18', description: 'Game subscription', category: 'entertainment', amount: 26.99 },
  { id: 't35', date: '2026-11-19', description: 'Shell gas station', category: 'transport', amount: 64.8 },
  { id: 't36', date: '2026-11-19', description: 'Clothes — Old Navy', category: 'shopping', amount: 78.9 },
  { id: 't37', date: '2026-11-20', description: 'Thai takeout — Basil Leaf', category: 'dining', amount: 57.8 },
  { id: 't38', date: '2026-11-21', description: 'Costco run', category: 'groceries', amount: 164.2 },
  { id: 't39', date: '2026-11-22', description: 'Kids’ arcade afternoon', category: 'entertainment', amount: 38.0 },
  { id: 't40', date: '2026-11-22', description: 'Library book fair — books', category: 'kids', amount: 48.5 },
  { id: 't41', date: '2026-11-24', description: 'Whole Foods Market', category: 'groceries', amount: 79.85 },
  { id: 't42', date: '2026-11-25', description: 'Burgers — Shake Shack', category: 'dining', amount: 44.75 },
];

// Recurring bills for the month. Paid ones match transactions above; the
// unpaid ones are still due before the month ends.
export const BILLS = [
  { id: 'b01', name: 'Mortgage', amount: 1890.0, dueDay: 1, autopay: true, paid: true },
  { id: 'b02', name: 'Little Acorns childcare', amount: 990.0, dueDay: 1, autopay: true, paid: true },
  { id: 'b03', name: 'Car payment — Honda CR-V', amount: 389.0, dueDay: 3, autopay: true, paid: true },
  { id: 'b04', name: 'HOA dues', amount: 125.0, dueDay: 5, autopay: false, paid: true },
  { id: 'b05', name: 'Electric — City Power', amount: 138.6, dueDay: 7, autopay: true, paid: true },
  { id: 'b06', name: 'Internet — NorthLink', amount: 92.0, dueDay: 10, autopay: true, paid: true },
  { id: 'b07', name: 'Water bill', amount: 67.4, dueDay: 12, autopay: false, paid: true },
  { id: 'b08', name: 'Phone — two lines', amount: 81.25, dueDay: 15, autopay: true, paid: true },
  { id: 'b09', name: 'Gym membership', amount: 29.0, dueDay: 28, autopay: true, paid: false },
  { id: 'b10', name: 'Home insurance', amount: 215.0, dueDay: 28, autopay: false, paid: false },
  { id: 'b11', name: 'Streaming bundle', amount: 16.99, dueDay: 29, autopay: true, paid: false },
  { id: 'b12', name: 'Credit card payment', amount: 685.0, dueDay: 30, autopay: false, paid: false },
];

// What the family is saving toward.
export const GOALS = [
  { id: 'g01', name: 'Emergency fund', note: 'Six months of essentials, kept in a high-yield savings account.', target: 12000.0, saved: 8600.0 },
  { id: 'g02', name: 'Family vacation — Hawaii', note: 'Flights and a week on Maui next summer.', target: 3600.0, saved: 2310.0 },
  { id: 'g03', name: 'New car fund', note: 'Replacing the 2014 Civic before it gives up.', target: 8000.0, saved: 2050.0 },
  { id: 'g04', name: 'Kids’ college (529 plans)', note: 'A little each month for Lily and Noah.', target: 25000.0, saved: 6750.0 },
];

// Past months, for the trend chart. November is computed live from INCOME
// and TRANSACTIONS, so the chart moves when the data changes.
export const MONTH_TREND = [
  { month: 'Jun', income: 9450.0, spending: 6150.0 },
  { month: 'Jul', income: 9600.0, spending: 6900.0 },
  { month: 'Aug', income: 9450.0, spending: 7250.0 },
  { month: 'Sep', income: 9650.0, spending: 6450.0 },
  { month: 'Oct', income: 9520.0, spending: 6010.0 },
];

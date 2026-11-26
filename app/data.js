// Chen household budget data — November 2026.
// One fictional household, consistent figures in USD. Every number the site
// shows comes from this file (or from the user's own edits, kept in
// localStorage). Nothing here is fetched from the network.
export const HOUSEHOLD = {
  name: 'The Chen Family',
  members: 'Maya & Daniel Chen, with Lily (9) and Noah (6)',
  monthLabel: 'November 2026',
  monthKey: '2026-11',
  today: 26, // day of the month the dashboard treats as "today"
  daysInMonth: 30,
  currency: 'USD',
};

// Monthly income, by source. Total: $9,550.00.
export const INCOME = [
  { id: 'inc-maya', source: "Maya Chen — salary (product designer)", amount: 4800.0, day: 1 },
  { id: 'inc-daniel', source: 'Daniel Chen — salary (high-school teacher)', amount: 4300.0, day: 1 },
  { id: 'inc-freelance', source: 'Maya — freelance illustration', amount: 450.0, day: 18 },
];

// Spending categories, each with a colour used by the charts and badges.
export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#2e7d5b' },
  { id: 'groceries', label: 'Groceries', color: '#5b8c5a' },
  { id: 'dining', label: 'Dining out', color: '#d97706' },
  { id: 'transport', label: 'Transport', color: '#3e7cb1' },
  { id: 'utilities', label: 'Utilities', color: '#7c6aae' },
  { id: 'entertainment', label: 'Entertainment', color: '#c94f7c' },
  { id: 'health', label: 'Health', color: '#2a9d8f' },
  { id: 'kids', label: 'Kids', color: '#e07856' },
  { id: 'shopping', label: 'Shopping', color: '#8a6d3b' },
  { id: 'subscriptions', label: 'Subscriptions', color: '#6b7c93' },
  { id: 'childcare', label: 'Childcare', color: '#4a6fa5' },
  { id: 'car', label: 'Car & insurance', color: '#556b2f' },
];

// Monthly budget limits per category. Total budget: $6,950.00.
export const BUDGETS = [
  { category: 'housing', limit: 2100.0 },
  { category: 'groceries', limit: 900.0 },
  { category: 'dining', limit: 350.0 },
  { category: 'transport', limit: 320.0 },
  { category: 'utilities', limit: 420.0 },
  { category: 'entertainment', limit: 150.0 },
  { category: 'health', limit: 250.0 },
  { category: 'kids', limit: 500.0 },
  { category: 'shopping', limit: 300.0 },
  { category: 'subscriptions', limit: 60.0 },
  { category: 'childcare', limit: 980.0 },
  { category: 'car', limit: 620.0 },
];

// Every November 2026 transaction. Amounts are spending (positive numbers);
// income lives in INCOME above. 42 entries, $6,090.71 in total.
export const TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', description: 'Mortgage payment', category: 'housing', amount: 1850.0 },
  { id: 't02', date: '2026-11-01', description: 'Little Acorns childcare', category: 'childcare', amount: 980.0 },
  { id: 't03', date: '2026-11-01', description: 'Streaming bundle', category: 'subscriptions', amount: 15.99 },
  { id: 't04', date: '2026-11-02', description: 'Whole Foods Market', category: 'groceries', amount: 142.35 },
  { id: 't05', date: '2026-11-02', description: 'After-school program', category: 'kids', amount: 210.0 },
  { id: 't06', date: '2026-11-03', description: 'Car payment — Honda CR-V', category: 'car', amount: 385.0 },
  { id: 't07', date: '2026-11-03', description: 'Gym membership', category: 'health', amount: 28.0 },
  { id: 't08', date: '2026-11-03', description: 'Pizza night — Tony’s', category: 'dining', amount: 46.2 },
  { id: 't09', date: '2026-11-04', description: 'Shell gas station', category: 'transport', amount: 68.0 },
  { id: 't10', date: '2026-11-05', description: 'HOA dues', category: 'housing', amount: 120.0 },
  { id: 't11', date: '2026-11-05', description: 'Music streaming', category: 'subscriptions', amount: 12.99 },
  { id: 't12', date: '2026-11-06', description: 'Trader Joe’s', category: 'groceries', amount: 96.8 },
  { id: 't13', date: '2026-11-06', description: 'CVS pharmacy', category: 'health', amount: 45.0 },
  { id: 't14', date: '2026-11-07', description: 'Electric bill — City Power', category: 'utilities', amount: 132.4 },
  { id: 't15', date: '2026-11-07', description: 'Bus passes (2)', category: 'transport', amount: 38.5 },
  { id: 't16', date: '2026-11-08', description: 'Sushi takeout — Kiko', category: 'dining', amount: 38.5 },
  { id: 't17', date: '2026-11-08', description: 'Winter coats for the kids', category: 'shopping', amount: 132.0 },
  { id: 't18', date: '2026-11-09', description: 'Costco run', category: 'groceries', amount: 178.4 },
  { id: 't19', date: '2026-11-09', description: 'School supplies', category: 'kids', amount: 86.4 },
  { id: 't20', date: '2026-11-10', description: 'Internet — NorthLink', category: 'utilities', amount: 89.0 },
  { id: 't21', date: '2026-11-10', description: 'Parking garage', category: 'transport', amount: 42.0 },
  { id: 't22', date: '2026-11-11', description: 'Dentist copay — Lily', category: 'health', amount: 120.0 },
  { id: 't23', date: '2026-11-12', description: 'Cloud storage', category: 'subscriptions', amount: 9.99 },
  { id: 't24', date: '2026-11-12', description: 'Chevron gas', category: 'transport', amount: 52.4 },
  { id: 't25', date: '2026-11-12', description: 'Water bill', category: 'utilities', amount: 64.25 },
  { id: 't26', date: '2026-11-13', description: 'Safeway', category: 'groceries', amount: 84.15 },
  { id: 't27', date: '2026-11-14', description: 'Family dinner — Olive Garden', category: 'dining', amount: 62.0 },
  { id: 't28', date: '2026-11-14', description: 'Household goods — Target', category: 'shopping', amount: 58.9 },
  { id: 't29', date: '2026-11-15', description: 'Phone bill — two lines', category: 'utilities', amount: 78.5 },
  { id: 't30', date: '2026-11-15', description: 'Movie night — Regal', category: 'entertainment', amount: 42.0 },
  { id: 't31', date: '2026-11-16', description: 'Soccer fees — Noah', category: 'kids', amount: 64.0 },
  { id: 't32', date: '2026-11-16', description: 'Coffee & bagels', category: 'dining', amount: 28.75 },
  { id: 't33', date: '2026-11-17', description: 'Trader Joe’s', category: 'groceries', amount: 121.6 },
  { id: 't34', date: '2026-11-18', description: 'Game subscription', category: 'entertainment', amount: 24.99 },
  { id: 't35', date: '2026-11-19', description: 'Shell gas station', category: 'transport', amount: 61.75 },
  { id: 't36', date: '2026-11-19', description: 'Clothes — Old Navy', category: 'shopping', amount: 74.25 },
  { id: 't37', date: '2026-11-20', description: 'Thai takeout — Basil Leaf', category: 'dining', amount: 54.3 },
  { id: 't38', date: '2026-11-21', description: 'Costco run', category: 'groceries', amount: 156.9 },
  { id: 't39', date: '2026-11-22', description: 'Kids’ arcade afternoon', category: 'entertainment', amount: 35.0 },
  { id: 't40', date: '2026-11-23', description: 'Library book fair — books', category: 'kids', amount: 45.0 },
  { id: 't41', date: '2026-11-24', description: 'Whole Foods Market', category: 'groceries', amount: 73.45 },
  { id: 't42', date: '2026-11-25', description: 'Burgers — Shake Shack', category: 'dining', amount: 41.0 },
];

// Recurring bills for November. "paid" ones match transactions above;
// the unpaid ones are still to come before month's end.
export const BILLS = [
  { id: 'b01', name: 'Mortgage', amount: 1850.0, dueDay: 1, autopay: true, paid: true },
  { id: 'b02', name: 'Little Acorns childcare', amount: 980.0, dueDay: 1, autopay: true, paid: true },
  { id: 'b03', name: 'Car payment — Honda CR-V', amount: 385.0, dueDay: 3, autopay: true, paid: true },
  { id: 'b04', name: 'HOA dues', amount: 120.0, dueDay: 5, autopay: false, paid: true },
  { id: 'b05', name: 'Electric — City Power', amount: 132.4, dueDay: 7, autopay: true, paid: true },
  { id: 'b06', name: 'Internet — NorthLink', amount: 89.0, dueDay: 10, autopay: true, paid: true },
  { id: 'b07', name: 'Water bill', amount: 64.25, dueDay: 12, autopay: false, paid: true },
  { id: 'b08', name: 'Phone — two lines', amount: 78.5, dueDay: 15, autopay: true, paid: true },
  { id: 'b09', name: 'Gym membership', amount: 28.0, dueDay: 28, autopay: true, paid: false },
  { id: 'b10', name: 'Home insurance', amount: 210.0, dueDay: 28, autopay: false, paid: false },
  { id: 'b11', name: 'Streaming bundle', amount: 15.99, dueDay: 29, autopay: true, paid: false },
  { id: 'b12', name: 'Credit card payment', amount: 640.0, dueDay: 30, autopay: false, paid: false },
];

// Savings goals.
export const GOALS = [
  { id: 'g01', name: 'Emergency fund', note: 'Six months of essentials, kept in a high-yield savings account.', target: 12000.0, saved: 8450.0 },
  { id: 'g02', name: 'Family vacation — Hawaii', note: 'Flights and a week on Maui next summer.', target: 3500.0, saved: 2180.0 },
  { id: 'g03', name: 'New car fund', note: 'Replacing the 2014 Civic before it gives up.', target: 8000.0, saved: 1920.0 },
  { id: 'g04', name: 'Kids’ college (529 plans)', note: 'A little each month for Lily and Noah.', target: 25000.0, saved: 6300.0 },
];

// Past months, for the trend chart (income vs spending).
export const MONTH_TREND = [
  { month: 'Jun', income: 9400.0, spending: 6100.0 },
  { month: 'Jul', income: 9550.0, spending: 6850.0 },
  { month: 'Aug', income: 9400.0, spending: 7200.0 },
  { month: 'Sep', income: 9600.0, spending: 6400.0 },
  { month: 'Oct', income: 9480.0, spending: 5980.0 },
  // November is computed live from INCOME and TRANSACTIONS.
];

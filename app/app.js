// Chen Family Ledger — router, views and interactions.
// Hash routes: #/ dashboard, #/transactions, #/budgets, #/bills, #/insights.
// Every figure is computed from data.js (or the user's edits, kept in
// localStorage under "chen-budget-v1"), so adding a transaction, editing a
// budget, paying a bill or contributing to a goal updates every page live.

import { HOUSEHOLD, INCOME, CATEGORIES, BUDGETS, TRANSACTIONS, BILLS, GOALS, MONTH_TREND } from './data.js';
import { donutChart, trendChart, progressBar } from './charts.js';

const app = document.getElementById('app');
const STORAGE_KEY = 'chen-budget-v1';

// ---------------------------------------------------------------- state ----

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function defaultState() {
  return {
    transactions: clone(TRANSACTIONS),
    budgets: clone(BUDGETS),
    bills: clone(BILLS),
    goals: clone(GOALS),
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const saved = JSON.parse(raw);
    const base = defaultState();
    return {
      transactions: Array.isArray(saved.transactions) ? saved.transactions : base.transactions,
      budgets: Array.isArray(saved.budgets) ? saved.budgets : base.budgets,
      bills: Array.isArray(saved.bills) ? saved.bills : base.bills,
      goals: Array.isArray(saved.goals) ? saved.goals : base.goals,
    };
  } catch {
    return defaultState();
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private browsing or a full store: the site still works for the session.
  }
}

const state = loadState();

// -------------------------------------------------------------- helpers ----

const money = (n) =>
  (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money0 = (n) => '$' + Math.round(Math.abs(n)).toLocaleString('en-US');
const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const categoryOf = (id) => CATEGORIES.find((c) => c.id === id) || { id, label: id, color: '#999' };
const totalIncome = () => INCOME.reduce((s, i) => s + i.amount, 0);
const totalSpent = () => state.transactions.reduce((s, t) => s + t.amount, 0);
const spentByCategory = (id) => state.transactions.filter((t) => t.category === id).reduce((s, t) => s + t.amount, 0);
const budgetLimit = (id) => (state.budgets.find((b) => b.category === id) || { limit: 0 }).limit;
const fmtDate = (iso) => {
  const [, m, d] = iso.split('-').map(Number);
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1] + ' ' + d;
};

function statCard(label, value, sub) {
  return `<div class="stat"><div class="stat-label">${label}</div><div class="stat-value">${value}</div><div class="stat-sub">${sub}</div></div>`;
}

// ------------------------------------------------------------ dashboard ----

function dashboardView() {
  const income = totalIncome();
  const spent = totalSpent();
  const remaining = income - spent;
  const rate = Math.round((remaining / income) * 100);

  const segments = CATEGORIES.map((c) => ({ label: c.label, value: spentByCategory(c.id), color: c.color }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);
  const legend = segments
    .map(
      (s) => `<li><span class="dot" style="background:${s.color}"></span>${escape(s.label)}
        <b>${money(s.value)}</b><span class="pct">${Math.round((s.value / spent) * 100)}%</span></li>`,
    )
    .join('');

  const months = [...MONTH_TREND, { month: 'Nov', income, spending: spent }];
  const upcoming = state.bills.filter((b) => !b.paid).sort((a, b) => a.dueDay - b.dueDay);
  const upcomingTotal = upcoming.reduce((s, b) => s + b.amount, 0);
  const upcomingRows = upcoming
    .map(
      (b) => `<li><span>${escape(b.name)}</span><span class="due">due Nov ${b.dueDay}</span><b>${money(b.amount)}</b></li>`,
    )
    .join('');

  const tight = CATEGORIES.map((c) => ({ c, spent: spentByCategory(c.id), limit: budgetLimit(c.id) }))
    .filter((x) => x.limit > 0)
    .sort((a, b) => b.spent / b.limit - a.spent / a.limit)
    .slice(0, 3);
  const tightRows = tight
    .map(
      (x) => `<li><span>${escape(x.c.label)}</span>${progressBar((x.spent / x.limit) * 100, x.spent > x.limit ? 'over' : 'good')}
        <b>${money(x.spent)} of ${money(x.limit)}</b></li>`,
    )
    .join('');

  return `<h1>${escape(HOUSEHOLD.monthLabel)} at a glance</h1>
<p class="lede">${escape(HOUSEHOLD.members)} — income, spending and savings for the month so far, updated ${escape(HOUSEHOLD.monthLabel.split(' ')[0])} ${HOUSEHOLD.today}.</p>
<section class="stats">
  ${statCard('Income', money(income), '3 sources · all in')}
  ${statCard('Spent', money(spent), state.transactions.length + ' transactions')}
  ${statCard('Left to spend', money(remaining), 'of ' + money(income) + ' income')}
  ${statCard('Savings rate', rate + '%', money(remaining) + ' set aside')}
</section>
<div class="grid-2">
  <section class="card">
    <h2>Where the money went</h2>
    <div class="donut-wrap">${donutChart(segments)}
      <ul class="legend">${legend}</ul></div>
    <p class="card-link"><a href="#/transactions">See every transaction &rarr;</a></p>
  </section>
  <section class="card">
    <h2>Income vs spending · Jun – Nov</h2>
    ${trendChart(months)}
    <p class="note">November is live: it moves whenever a transaction is added or removed.</p>
    <p class="card-link"><a href="#/insights">Read the month’s insights &rarr;</a></p>
  </section>
</div>
<div class="grid-2">
  <section class="card">
    <h2>Upcoming bills · ${money(upcomingTotal)} still to pay</h2>
    <ul class="bill-mini">${upcomingRows}</ul>
    <p class="card-link"><a href="#/bills">All bills &amp; savings goals &rarr;</a></p>
  </section>
  <section class="card">
    <h2>Budgets closest to the line</h2>
    <ul class="tight">${tightRows}</ul>
    <p class="card-link"><a href="#/budgets">Manage all budgets &rarr;</a></p>
  </section>
</div>`;
}

// ---------------------------------------------------------- transactions ----

let txFilter = { query: '', category: 'all' };
let txNote = ''; // confirmation shown after adding a transaction (survives re-render)

function transactionsView() {
  const q = txFilter.query.trim().toLowerCase();
  const rows = state.transactions
    .filter((t) => (txFilter.category === 'all' || t.category === txFilter.category) &&
      (q === '' || t.description.toLowerCase().includes(q)))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const filteredTotal = rows.reduce((s, t) => s + t.amount, 0);
  const options = ['<option value="all">All categories</option>'].concat(
    CATEGORIES.map((c) => `<option value="${c.id}"${txFilter.category === c.id ? ' selected' : ''}>${escape(c.label)}</option>`),
  );

  const body = rows.length
    ? rows
        .map((t) => {
          const c = categoryOf(t.category);
          return `<tr><td>${fmtDate(t.date)}</td><td>${escape(t.description)}</td>
            <td><span class="tag" style="--tag:${c.color}">${escape(c.label)}</span></td>
            <td class="num">${money(t.amount)}</td>
            <td><button type="button" class="link-btn" data-action="delete-tx" data-id="${t.id}">Delete</button></td></tr>`;
        })
        .join('')
    : `<tr><td colspan="5" class="empty">No transactions match. Clear the search or pick another category.</td></tr>`;

  return `<h1>Transactions</h1>
<p class="lede">Every dollar out the door in ${escape(HOUSEHOLD.monthLabel)}. Add one below and the dashboard, budgets and insights update at once.</p>
<form id="add-tx" class="card form-card">
  <h2>Add a transaction</h2>
  <div class="form-grid">
    <label>Date <input type="date" name="date" value="2026-11-26" min="2026-11-01" max="2026-11-30" required></label>
    <label>Description <input type="text" name="description" maxlength="80" placeholder="e.g. Farmers market" required></label>
    <label>Category <select name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${escape(c.label)}</option>`).join('')}</select></label>
    <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
  </div>
  <button type="submit" class="btn">Add transaction</button>
  <span class="form-note" id="add-tx-note" role="status">${escape(txNote)}</span>
</form>
<section class="card">
  <div class="filter-row">
    <label>Search <input type="search" id="tx-search" value="${escape(txFilter.query)}" placeholder="Search descriptions…"></label>
    <label>Category <select id="tx-category">${options.join('')}</select></label>
    <span class="filter-total">${rows.length} shown · ${money(filteredTotal)}</span>
  </div>
  <table class="tx-table">
    <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
    <tbody>${body}</tbody>
  </table>
</section>`;
}

// -------------------------------------------------------------- budgets ----

let editingBudget = null;

function budgetsView() {
  const totalLimit = state.budgets.reduce((s, b) => s + b.limit, 0);
  const spent = totalSpent();
  const rows = CATEGORIES.map((c) => {
    const catSpent = spentByCategory(c.id);
    const limit = budgetLimit(c.id);
    const pct = limit > 0 ? (catSpent / limit) * 100 : 0;
    const diff = limit - catSpent;
    const tone = catSpent > limit ? 'over' : pct >= 90 ? 'warn' : 'good';
    const status = catSpent > limit
      ? `<span class="over-text">${money(-diff)} over budget</span>`
      : `<span class="under-text">${money(diff)} left</span>`;
    const editor = editingBudget === c.id
      ? `<form class="budget-edit" data-category="${c.id}">
          <label>Monthly limit ($) <input type="number" name="limit" min="0" step="1" value="${limit}" required></label>
          <button type="submit" class="btn small">Save</button>
          <button type="button" class="btn small ghost" data-action="cancel-budget">Cancel</button>
        </form>`
      : `<button type="button" class="btn small ghost" data-action="edit-budget" data-id="${c.id}">Edit budget</button>`;
    return `<li class="budget-row">
      <div class="budget-head"><span class="dot" style="background:${c.color}"></span><b>${escape(c.label)}</b>
        <span class="budget-amounts">${money(catSpent)} <span class="muted">of ${money(limit)}</span></span></div>
      ${progressBar(pct, tone)}
      <div class="budget-foot">${status}<span class="pct">${Math.round(pct)}% used</span>${editor}</div>
    </li>`;
  }).join('');

  return `<h1>Budgets</h1>
<p class="lede">Twelve monthly limits for ${escape(HOUSEHOLD.monthLabel)}. Edit any limit and the bars move with it.</p>
<section class="card total-card">
  <div class="total-line"><b>Total budget ${money(totalLimit)}</b><span>${money(spent)} spent · ${money(totalLimit - spent)} left overall</span></div>
  ${progressBar((spent / totalLimit) * 100, spent > totalLimit ? 'over' : 'good')}
</section>
<ul class="budget-list">${rows}</ul>`;
}

// --------------------------------------------------------- bills & goals ----

function billsView() {
  const unpaid = state.bills.filter((b) => !b.paid).sort((a, b) => a.dueDay - b.dueDay);
  const paid = state.bills.filter((b) => b.paid).sort((a, b) => a.dueDay - b.dueDay);
  const unpaidTotal = unpaid.reduce((s, b) => s + b.amount, 0);
  const paidTotal = paid.reduce((s, b) => s + b.amount, 0);

  const billRow = (b) => `<li class="bill-row${b.paid ? ' is-paid' : ''}">
    <div><b>${escape(b.name)}</b><span class="muted"> due Nov ${b.dueDay}${b.autopay ? ' · autopay' : ''}</span></div>
    <b>${money(b.amount)}</b>
    <button type="button" class="btn small${b.paid ? ' ghost' : ''}" data-action="toggle-bill" data-id="${b.id}">
      ${b.paid ? 'Mark unpaid' : 'Mark paid'}</button></li>`;

  const goalCards = state.goals
    .map((g) => {
      const pct = (g.saved / g.target) * 100;
      return `<li class="goal-card">
        <h3>${escape(g.name)}</h3>
        <p class="muted">${escape(g.note)}</p>
        <div class="goal-amounts"><b>${money(g.saved)}</b><span class="muted"> of ${money(g.target)} · ${Math.round(pct)}%</span></div>
        ${progressBar(pct, pct >= 100 ? 'good' : pct >= 70 ? 'warn' : 'good')}
        <form class="contribute" data-goal="${g.id}">
          <label>Add to this goal ($) <input type="number" name="amount" min="1" step="1" placeholder="50" required></label>
          <button type="submit" class="btn small">Contribute</button>
        </form>
      </li>`;
    })
    .join('');

  return `<h1>Bills &amp; savings goals</h1>
<p class="lede">What is due, what is paid, and what the family is saving toward — all for ${escape(HOUSEHOLD.monthLabel)}.</p>
<section class="stats">
  ${statCard('Still to pay', money(unpaidTotal), unpaid.length + ' bills left')}
  ${statCard('Already paid', money(paidTotal), paid.length + ' bills settled')}
  ${statCard('Saving toward', money(state.goals.reduce((s, g) => s + g.target, 0)), state.goals.length + ' goals')}
  ${statCard('Saved so far', money(state.goals.reduce((s, g) => s + g.saved, 0)), 'across all goals')}
</section>
<div class="grid-2">
  <section class="card">
    <h2>Upcoming bills</h2>
    <ul class="bill-list">${unpaid.length ? unpaid.map(billRow).join('') : '<li class="empty">Nothing left due this month. Nice work.</li>'}</ul>
    <h2 class="subhead">Paid this month</h2>
    <ul class="bill-list">${paid.map(billRow).join('')}</ul>
  </section>
  <section>
    <h2 class="card-title">Savings goals</h2>
    <ul class="goal-list">${goalCards}</ul>
  </section>
</div>`;
}

// -------------------------------------------------------------- insights ----

function insightsView() {
  const income = totalIncome();
  const spent = totalSpent();
  const remaining = income - spent;
  const daysSoFar = HOUSEHOLD.today;
  const dailyAvg = spent / daysSoFar;
  const projected = dailyAvg * HOUSEHOLD.daysInMonth;
  const projectedLeft = income - projected;

  const byCat = CATEGORIES.map((c) => ({ label: c.label, spent: spentByCategory(c.id), limit: budgetLimit(c.id) }))
    .filter((x) => x.spent > 0)
    .sort((a, b) => b.spent - a.spent);
  const top = byCat[0];
  const biggest = [...state.transactions].sort((a, b) => b.amount - a.amount)[0];
  const over = byCat.filter((x) => x.spent > x.limit);
  const cheapestDay = (() => {
    const perDay = {};
    state.transactions.forEach((t) => { perDay[t.date] = (perDay[t.date] || 0) + t.amount; });
    const days = Object.entries(perDay).sort((a, b) => a[1] - b[1]);
    return days.length ? { date: days[0][0], amount: days[0][1] } : null;
  })();
  const incomeRows = INCOME.map((i) => `<li><span>${escape(i.source)}</span><b>${money(i.amount)}</b></li>`).join('');
  const trend = MONTH_TREND.map((m) => ({ ...m }));
  trend.push({ month: 'Nov', income, spending: spent });
  const savedMonths = trend.filter((m) => m.income > m.spending).length;

  const insight = (title, body) => `<article class="insight"><h3>${title}</h3><p>${body}</p></article>`;

  return `<h1>Insights</h1>
<p class="lede">What ${escape(HOUSEHOLD.monthLabel)} is actually saying about the family’s money.</p>
<section class="insight-grid">
  ${insight('Biggest spend: ' + top.label, `${money(top.spent)} went to ${escape(top.label)} — ${Math.round((top.spent / spent) * 100)}% of all spending. Housing aside, groceries lead the everyday costs at ${money(spentByCategory('groceries'))}.`)}
  ${insight('Daily average: ' + money(dailyAvg), `Across the first ${daysSoFar} days the family spent ${money(dailyAvg)} a day on average. At that pace the month ends near ${money(projected)}, leaving about ${money(projectedLeft)} unspent.`)}
  ${insight('Biggest single payment', `The ${escape(biggest.description)} on ${fmtDate(biggest.date)} at ${money(biggest.amount)} — ${Math.round((biggest.amount / spent) * 100)}% of the month’s spending in one payment.`)}
  ${insight('Budgets holding', over.length === 0
    ? `No category is over its limit. The tightest is ${byCat.map((x) => ({ ...x, pct: x.spent / x.limit })).sort((a, b) => b.pct - a.pct)[0].label} — check the Budgets page for the exact headroom.`
    : `${over.length} categor${over.length === 1 ? 'y is' : 'ies are'} over budget: ${over.map((x) => escape(x.label)).join(', ')}. Trimming one takeout dinner a week would cover most of the gap.`)}
  ${insight('Cheapest day so far', cheapestDay
    ? `${fmtDate(cheapestDay.date)} cost just ${money(cheapestDay.amount)} — a no-spend day is the fastest way to lift the savings rate.`
    : 'No spending days recorded yet.')}
  ${insight('Six months in the green', `The family spent less than it earned in ${savedMonths} of the last 6 months, including this one. August was the dearest month (${money(7200)}), driven by the summer trip.`)}
</section>
<div class="grid-2">
  <section class="card">
    <h2>Where the income comes from</h2>
    <ul class="bill-mini">${incomeRows}</ul>
    <p class="note">Total income ${money(income)} · savings rate ${Math.round((remaining / income) * 100)}% (${money(remaining)}).</p>
  </section>
  <section class="card">
    <h2>Month by month</h2>
    ${trendChart(trend)}
    <p class="note">November’s bars update live as transactions change.</p>
  </section>
</div>`;
}

function missingView() {
  return `<h1>Page not found</h1>
<p>There is no page at this address. <a href="#/">Back to the dashboard</a>.</p>`;
}

// --------------------------------------------------------------- routing ----

const ROUTES = {
  '': dashboardView,
  '/': dashboardView,
  '/transactions': transactionsView,
  '/budgets': budgetsView,
  '/bills': billsView,
  '/insights': insightsView,
};

const TITLES = {
  '': 'Dashboard',
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/budgets': 'Budgets',
  '/bills': 'Bills & savings goals',
  '/insights': 'Insights',
};

function render() {
  window.__shotReady = false;
  const hash = location.hash.replace(/^#/, '');
  const view = ROUTES[hash] || missingView;
  document.title = `${TITLES[hash] || 'Not found'} | Chen Family Ledger`;
  document.querySelectorAll('header nav a').forEach((a) => {
    const route = a.getAttribute('href');
    if (route === `#${hash}` || (route === '#/' && (hash === '' || hash === '/'))) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  app.innerHTML = view();
  wireUp();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

// ------------------------------------------------------------ interactions ----

function wireUp() {
  const addForm = document.getElementById('add-tx');
  if (addForm) {
    addForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(addForm);
      const amount = Number(data.get('amount'));
      if (!Number.isFinite(amount) || amount <= 0) {
        txNote = 'Enter an amount above $0.';
        render();
        return;
      }
      const description = String(data.get('description') || '').trim();
      if (!description) {
        txNote = 'Give the transaction a short description.';
        render();
        return;
      }
      state.transactions.push({
        id: 'u' + Date.now().toString(36),
        date: String(data.get('date') || '2026-11-26'),
        description,
        category: String(data.get('category') || 'shopping'),
        amount: Math.round(amount * 100) / 100,
      });
      saveState();
      txNote = `Added “${description}” — totals, charts and budgets are updated.`;
      render();
    });
  }

  const search = document.getElementById('tx-search');
  if (search) {
    search.addEventListener('input', () => {
      txFilter.query = search.value;
      const pos = search.selectionStart;
      render();
      const again = document.getElementById('tx-search');
      if (again) {
        again.focus();
        again.setSelectionRange(pos, pos);
      }
    });
  }
  const catSelect = document.getElementById('tx-category');
  if (catSelect) catSelect.addEventListener('change', () => { txFilter.category = catSelect.value; render(); });

  document.querySelectorAll('form.budget-edit').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const limit = Number(new FormData(form).get('limit'));
      if (!Number.isFinite(limit) || limit < 0) return;
      const entry = state.budgets.find((b) => b.category === form.dataset.category);
      if (entry) entry.limit = Math.round(limit * 100) / 100;
      editingBudget = null;
      saveState();
      render();
    });
  });

  document.querySelectorAll('form.contribute').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const amount = Number(new FormData(form).get('amount'));
      if (!Number.isFinite(amount) || amount <= 0) return;
      const goal = state.goals.find((g) => g.id === form.dataset.goal);
      if (goal) goal.saved = Math.round((goal.saved + amount) * 100) / 100;
      saveState();
      render();
    });
  });
}

// One delegated click listener on the whole document, so controls in the
// footer (Reset demo data) work as well as the ones inside #app.
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'delete-tx') {
    state.transactions = state.transactions.filter((t) => t.id !== button.dataset.id);
    saveState();
    render();
  } else if (action === 'toggle-bill') {
    const bill = state.bills.find((b) => b.id === button.dataset.id);
    if (bill) bill.paid = !bill.paid;
    saveState();
    render();
  } else if (action === 'edit-budget') {
    editingBudget = button.dataset.id;
    render();
  } else if (action === 'cancel-budget') {
    editingBudget = null;
    render();
  } else if (action === 'reset-data') {
    const fresh = defaultState();
    state.transactions = fresh.transactions;
    state.budgets = fresh.budgets;
    state.bills = fresh.bills;
    state.goals = fresh.goals;
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    render();
  }
});

window.addEventListener('hashchange', render);
render();

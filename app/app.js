// Chen Family Ledger — hash router, views and every control.
//
// Routes: #/ dashboard, #/transactions, #/budgets, #/bills, #/insights.
// Every figure is derived from data.js (or the visitor's edits, kept in
// localStorage under "chen-ledger-v2"), so adding a transaction, changing
// a budget, paying a bill or topping up a goal updates every page at once.

import { HOUSEHOLD, INCOME, CATEGORIES, BUDGETS, TRANSACTIONS, BILLS, GOALS, MONTH_TREND } from './data.js';
import { donutChart, trendChart, meterBar } from './charts.js';

const mount = document.getElementById('app');
const STORE_KEY = 'chen-ledger-v2';

// ------------------------------------------------------------------ state

function deepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

function freshLedger() {
  return {
    transactions: deepCopy(TRANSACTIONS),
    budgets: deepCopy(BUDGETS),
    bills: deepCopy(BILLS),
    goals: deepCopy(GOALS),
  };
}

function loadLedger() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return freshLedger();
    const saved = JSON.parse(raw);
    const base = freshLedger();
    return {
      transactions: Array.isArray(saved.transactions) ? saved.transactions : base.transactions,
      budgets: Array.isArray(saved.budgets) ? saved.budgets : base.budgets,
      bills: Array.isArray(saved.bills) ? saved.bills : base.bills,
      goals: Array.isArray(saved.goals) ? saved.goals : base.goals,
    };
  } catch {
    return freshLedger();
  }
}

function persistLedger() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(ledger));
  } catch {
    // Private browsing or a full store: the site keeps working for the session.
  }
}

const ledger = loadLedger();

// -------------------------------------------------------------- formatting

const dollars = (n) =>
  (n < 0 ? '-$' : '$') + Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const wholeDollars = (n) => '$' + Math.round(Math.abs(n)).toLocaleString('en-US');
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const categoryById = (id) => CATEGORIES.find((c) => c.id === id) || { id, label: id, color: '#888' };
const incomeTotal = () => INCOME.reduce((sum, i) => sum + i.amount, 0);
const spentTotal = () => ledger.transactions.reduce((sum, t) => sum + t.amount, 0);
const spentIn = (id) => ledger.transactions.filter((t) => t.category === id).reduce((sum, t) => sum + t.amount, 0);
const limitFor = (id) => (ledger.budgets.find((b) => b.category === id) || { limit: 0 }).limit;
const shortDate = (iso) => {
  const [, month, day] = iso.split('-').map(Number);
  return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][month - 1] + ' ' + day;
};

function kpiCard(label, value, sub) {
  return `<div class="kpi"><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div><div class="kpi-sub">${sub}</div></div>`;
}

// -------------------------------------------------------------- dashboard

function renderDashboard() {
  const income = incomeTotal();
  const spent = spentTotal();
  const left = income - spent;
  const saveRate = Math.round((left / income) * 100);

  const slices = CATEGORIES.map((c) => ({ label: c.label, value: spentIn(c.id), color: c.color }))
    .filter((s) => s.value > 0)
    .sort((a, b) => b.value - a.value);
  const keyItems = slices
    .map((s) => `<li><span class="swatch" style="background:${s.color}"></span>${escapeHtml(s.label)}
      <b>${dollars(s.value)}</b><span class="share">${Math.round((s.value / spent) * 100)}%</span></li>`)
    .join('');

  const months = [...MONTH_TREND, { month: 'Nov', income, spending: spent }];
  const dueSoon = ledger.bills.filter((b) => !b.paid).sort((a, b) => a.dueDay - b.dueDay);
  const dueTotal = dueSoon.reduce((sum, b) => sum + b.amount, 0);
  const dueRows = dueSoon
    .map((b) => `<li><span>${escapeHtml(b.name)}</span><span class="when">due Nov ${b.dueDay}</span><b>${dollars(b.amount)}</b></li>`)
    .join('');

  const tightest = CATEGORIES.map((c) => ({ c, spent: spentIn(c.id), limit: limitFor(c.id) }))
    .filter((x) => x.limit > 0)
    .sort((a, b) => b.spent / b.limit - a.spent / a.limit)
    .slice(0, 3);
  const tightRows = tightest
    .map((x) => `<li><span>${escapeHtml(x.c.label)}</span>${meterBar((x.spent / x.limit) * 100, x.spent > x.limit ? 'over' : 'ok')}
      <b>${dollars(x.spent)} of ${dollars(x.limit)}</b></li>`)
    .join('');

  return `<h1>${escapeHtml(HOUSEHOLD.monthLabel)} at a glance</h1>
<p class="intro">${escapeHtml(HOUSEHOLD.members)} — income, spending and savings for the month so far, updated Nov ${HOUSEHOLD.today}.</p>
<section class="kpis">
  ${kpiCard('Income', dollars(income), '3 sources · all received')}
  ${kpiCard('Spent', dollars(spent), ledger.transactions.length + ' transactions')}
  ${kpiCard('Left to spend', dollars(left), 'of ' + dollars(income) + ' income')}
  ${kpiCard('Savings rate', saveRate + '%', dollars(left) + ' set aside')}
</section>
<div class="two-col">
  <section class="panel">
    <h2>Where the money went</h2>
    <div class="donut-box">${donutChart(slices)}
      <ul class="key-list">${keyItems}</ul></div>
    <p class="more-link"><a href="#/transactions">See every transaction &rarr;</a></p>
  </section>
  <section class="panel">
    <h2>Income vs spending · Jun – Nov</h2>
    ${trendChart(months)}
    <p class="small">November is live: it moves whenever a transaction is added or removed.</p>
    <p class="more-link"><a href="#/insights">Read the month&rsquo;s insights &rarr;</a></p>
  </section>
</div>
<div class="two-col">
  <section class="panel">
    <h2>Upcoming bills · ${dollars(dueTotal)} still to pay</h2>
    <ul class="mini-list">${dueRows}</ul>
    <p class="more-link"><a href="#/bills">All bills &amp; savings goals &rarr;</a></p>
  </section>
  <section class="panel">
    <h2>Budgets closest to the line</h2>
    <ul class="mini-list watch-list">${tightRows}</ul>
    <p class="more-link"><a href="#/budgets">Manage all budgets &rarr;</a></p>
  </section>
</div>`;
}

// ------------------------------------------------------------ transactions

let txSearch = { text: '', category: 'all' };
let txMessage = ''; // confirmation after adding a transaction (survives re-render)

function renderTransactions() {
  const needle = txSearch.text.trim().toLowerCase();
  const shown = ledger.transactions
    .filter((t) => (txSearch.category === 'all' || t.category === txSearch.category) &&
      (needle === '' || t.description.toLowerCase().includes(needle)))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const shownTotal = shown.reduce((sum, t) => sum + t.amount, 0);
  const categoryOptions = ['<option value="all">All categories</option>'].concat(
    CATEGORIES.map((c) => `<option value="${c.id}"${txSearch.category === c.id ? ' selected' : ''}>${escapeHtml(c.label)}</option>`),
  );

  const rows = shown.length
    ? shown.map((t) => {
        const c = categoryById(t.category);
        return `<tr><td>${shortDate(t.date)}</td><td>${escapeHtml(t.description)}</td>
          <td><span class="pill" style="--pill:${c.color}">${escapeHtml(c.label)}</span></td>
          <td class="amount">${dollars(t.amount)}</td>
          <td><button type="button" class="text-button" data-action="remove-tx" data-id="${t.id}">Delete</button></td></tr>`;
      }).join('')
    : `<tr><td colspan="5" class="empty-note">No transactions match. Clear the search or pick another category.</td></tr>`;

  return `<h1>Transactions</h1>
<p class="intro">Every dollar out the door in ${escapeHtml(HOUSEHOLD.monthLabel)}. Add one below and the dashboard, budgets and insights update at once.</p>
<form id="add-tx" class="panel add-form">
  <h2>Add a transaction</h2>
  <div class="add-grid">
    <label>Date <input type="date" name="date" value="2026-11-26" min="2026-11-01" max="2026-11-30" required></label>
    <label>Description <input type="text" name="description" maxlength="80" placeholder="e.g. Farmers market" required></label>
    <label>Category <select name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${escapeHtml(c.label)}</option>`).join('')}</select></label>
    <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
  </div>
  <button type="submit" class="button">Add transaction</button>
  <span class="form-message" id="add-tx-note" role="status">${escapeHtml(txMessage)}</span>
</form>
<section class="panel">
  <div class="filter-bar">
    <label>Search <input type="search" id="tx-search" value="${escapeHtml(txSearch.text)}" placeholder="Search descriptions…"></label>
    <label>Category <select id="tx-category">${categoryOptions.join('')}</select></label>
    <span class="filter-count">${shown.length} shown · ${dollars(shownTotal)}</span>
  </div>
  <table class="ledger-table">
    <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="amount">Amount</th><th></th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
</section>`;
}

// ----------------------------------------------------------------- budgets

let budgetBeingEdited = null;

function renderBudgets() {
  const totalLimit = ledger.budgets.reduce((sum, b) => sum + b.limit, 0);
  const spent = spentTotal();
  const cards = CATEGORIES.map((c) => {
    const catSpent = spentIn(c.id);
    const limit = limitFor(c.id);
    const pct = limit > 0 ? (catSpent / limit) * 100 : 0;
    const remaining = limit - catSpent;
    const tone = catSpent > limit ? 'over' : pct >= 90 ? 'tight' : 'ok';
    const standing = catSpent > limit
      ? `<span class="over-note">${dollars(-remaining)} over budget</span>`
      : `<span class="left-note">${dollars(remaining)} left</span>`;
    const editor = budgetBeingEdited === c.id
      ? `<form class="limit-form" data-category="${c.id}">
          <label>Monthly limit ($) <input type="number" name="limit" min="0" step="1" value="${limit}" required></label>
          <button type="submit" class="button small">Save</button>
          <button type="button" class="button small plain" data-action="cancel-budget">Cancel</button>
        </form>`
      : `<button type="button" class="button small plain" data-action="edit-budget" data-id="${c.id}">Edit budget</button>`;
    return `<li class="budget-card">
      <div class="budget-top"><span class="swatch" style="background:${c.color}"></span><b>${escapeHtml(c.label)}</b>
        <span class="budget-sum">${dollars(catSpent)} <span class="faint">of ${dollars(limit)}</span></span></div>
      ${meterBar(pct, tone)}
      <div class="budget-bottom">${standing}<span class="share">${Math.round(pct)}% used</span>${editor}</div>
    </li>`;
  }).join('');

  return `<h1>Budgets</h1>
<p class="intro">Twelve monthly limits for ${escapeHtml(HOUSEHOLD.monthLabel)}. Edit any limit and the bars move with it.</p>
<section class="panel total-strip">
  <div class="row"><b>Total budget ${dollars(totalLimit)}</b><span>${dollars(spent)} spent · ${dollars(totalLimit - spent)} left overall</span></div>
  ${meterBar((spent / totalLimit) * 100, spent > totalLimit ? 'over' : 'ok')}
</section>
<ul class="budget-grid">${cards}</ul>`;
}

// ------------------------------------------------------------ bills & goals

function renderBills() {
  const unpaid = ledger.bills.filter((b) => !b.paid).sort((a, b) => a.dueDay - b.dueDay);
  const paid = ledger.bills.filter((b) => b.paid).sort((a, b) => a.dueDay - b.dueDay);
  const unpaidTotal = unpaid.reduce((sum, b) => sum + b.amount, 0);
  const paidTotal = paid.reduce((sum, b) => sum + b.amount, 0);

  const billRow = (b) => `<li class="bill-row${b.paid ? ' settled' : ''}">
    <div><b>${escapeHtml(b.name)}</b><span class="faint"> due Nov ${b.dueDay}${b.autopay ? ' · autopay' : ''}</span></div>
    <b>${dollars(b.amount)}</b>
    <button type="button" class="button small${b.paid ? ' plain' : ''}" data-action="flip-bill" data-id="${b.id}">
      ${b.paid ? 'Mark unpaid' : 'Mark paid'}</button></li>`;

  const goalCards = ledger.goals.map((g) => {
    const pct = (g.saved / g.target) * 100;
    return `<li class="goal-card">
      <h3>${escapeHtml(g.name)}</h3>
      <p class="faint">${escapeHtml(g.note)}</p>
      <div class="goal-sum"><b>${dollars(g.saved)}</b><span class="faint"> of ${dollars(g.target)} · ${Math.round(pct)}%</span></div>
      ${meterBar(pct, pct >= 100 ? 'ok' : pct >= 70 ? 'tight' : 'ok')}
      <form class="top-up" data-goal="${g.id}">
        <label>Add to this goal ($) <input type="number" name="amount" min="1" step="1" placeholder="50" required></label>
        <button type="submit" class="button small">Contribute</button>
      </form>
    </li>`;
  }).join('');

  return `<h1>Bills &amp; savings goals</h1>
<p class="intro">What is due, what is paid, and what the family is saving toward — all for ${escapeHtml(HOUSEHOLD.monthLabel)}.</p>
<section class="kpis">
  ${kpiCard('Still to pay', dollars(unpaidTotal), unpaid.length + ' bills left')}
  ${kpiCard('Already paid', dollars(paidTotal), paid.length + ' bills settled')}
  ${kpiCard('Saving toward', dollars(ledger.goals.reduce((sum, g) => sum + g.target, 0)), ledger.goals.length + ' goals')}
  ${kpiCard('Saved so far', dollars(ledger.goals.reduce((sum, g) => sum + g.saved, 0)), 'across all goals')}
</section>
<div class="two-col">
  <section class="panel">
    <h2>Upcoming bills</h2>
    <ul class="bill-rows">${unpaid.length ? unpaid.map(billRow).join('') : '<li class="empty-note">Nothing left due this month. Nice work.</li>'}</ul>
    <h2 class="gap-top">Paid this month</h2>
    <ul class="bill-rows">${paid.map(billRow).join('')}</ul>
  </section>
  <section>
    <h2 class="panel-title">Savings goals</h2>
    <ul class="goal-stack">${goalCards}</ul>
  </section>
</div>`;
}

// ---------------------------------------------------------------- insights

function renderInsights() {
  const income = incomeTotal();
  const spent = spentTotal();
  const left = income - spent;
  const daysSoFar = HOUSEHOLD.today;
  const daily = spent / daysSoFar;
  const projected = daily * HOUSEHOLD.daysInMonth;
  const projectedLeft = income - projected;

  const byCategory = CATEGORIES.map((c) => ({ label: c.label, spent: spentIn(c.id), limit: limitFor(c.id) }))
    .filter((x) => x.spent > 0)
    .sort((a, b) => b.spent - a.spent);
  const topCategory = byCategory[0];
  const biggest = [...ledger.transactions].sort((a, b) => b.amount - a.amount)[0];
  const overBudget = byCategory.filter((x) => x.spent > x.limit);
  const tightestCategory = [...byCategory].sort((a, b) => b.spent / b.limit - a.spent / a.limit)[0];

  const perDay = {};
  ledger.transactions.forEach((t) => { perDay[t.date] = (perDay[t.date] || 0) + t.amount; });
  const daysRanked = Object.entries(perDay).sort((a, b) => a[1] - b[1]);
  const cheapest = daysRanked.length ? { date: daysRanked[0][0], amount: daysRanked[0][1] } : null;

  const incomeRows = INCOME.map((i) => `<li><span>${escapeHtml(i.source)}</span><b>${dollars(i.amount)}</b></li>`).join('');
  const months = [...MONTH_TREND, { month: 'Nov', income, spending: spent }];
  const greenMonths = months.filter((m) => m.income > m.spending).length;

  const card = (title, body) => `<article class="insight-card"><h3>${title}</h3><p>${body}</p></article>`;

  return `<h1>Insights</h1>
<p class="intro">What ${escapeHtml(HOUSEHOLD.monthLabel)} is actually saying about the family&rsquo;s money.</p>
<section class="insight-grid">
  ${card('Biggest spend: ' + topCategory.label, `${dollars(topCategory.spent)} went to ${escapeHtml(topCategory.label)} — ${Math.round((topCategory.spent / spent) * 100)}% of all spending. Housing aside, groceries lead the everyday costs at ${dollars(spentIn('groceries'))}.`)}
  ${card('Daily average: ' + dollars(daily), `Across the first ${daysSoFar} days the family spent ${dollars(daily)} a day on average. At that pace the month ends near ${dollars(projected)}, leaving about ${dollars(projectedLeft)} unspent.`)}
  ${card('Biggest single payment', `The ${escapeHtml(biggest.description)} on ${shortDate(biggest.date)} at ${dollars(biggest.amount)} — ${Math.round((biggest.amount / spent) * 100)}% of the month&rsquo;s spending in one payment.`)}
  ${card('Budget health', overBudget.length === 0
    ? `No category is over its limit. The tightest is ${escapeHtml(tightestCategory.label)} at ${Math.round((tightestCategory.spent / tightestCategory.limit) * 100)}% of its limit — see the Budgets page for the exact headroom.`
    : `${overBudget.length} categor${overBudget.length === 1 ? 'y is' : 'ies are'} over budget: ${overBudget.map((x) => escapeHtml(x.label)).join(', ')}. Skipping one takeout dinner a week would cover most of the gap.`)}
  ${card('Cheapest day so far', cheapest
    ? `${shortDate(cheapest.date)} cost just ${dollars(cheapest.amount)} — a no-spend day is the fastest way to lift the savings rate.`
    : 'No spending days recorded yet.')}
  ${card('Six months in the green', `The family spent less than it earned in ${greenMonths} of the last 6 months, including this one. August was the dearest month (${dollars(7250)}), driven by the summer trip.`)}
</section>
<div class="two-col">
  <section class="panel">
    <h2>Where the income comes from</h2>
    <ul class="mini-list">${incomeRows}</ul>
    <p class="small">Total income ${dollars(income)} · savings rate ${Math.round((left / income) * 100)}% (${dollars(left)}).</p>
  </section>
  <section class="panel">
    <h2>Month by month</h2>
    ${trendChart(months)}
    <p class="small">November&rsquo;s bars update live as transactions change.</p>
  </section>
</div>`;
}

function renderMissing() {
  return `<h1>Page not found</h1>
<p>There is no page at this address. <a href="#/">Back to the dashboard</a>.</p>`;
}

// ----------------------------------------------------------------- routing

const PAGES = {
  '': renderDashboard,
  '/': renderDashboard,
  '/transactions': renderTransactions,
  '/budgets': renderBudgets,
  '/bills': renderBills,
  '/insights': renderInsights,
};

const PAGE_TITLES = {
  '': 'Dashboard',
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/budgets': 'Budgets',
  '/bills': 'Bills & savings goals',
  '/insights': 'Insights',
};

function render() {
  window.__shotReady = false;
  const route = location.hash.replace(/^#/, '');
  const view = PAGES[route] || renderMissing;
  document.title = `${PAGE_TITLES[route] || 'Not found'} | Chen Family Ledger`;
  document.querySelectorAll('.topbar nav a').forEach((a) => {
    const target = a.getAttribute('href');
    if (target === `#${route}` || (target === '#/' && (route === '' || route === '/'))) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  mount.innerHTML = view();
  bindControls();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

// -------------------------------------------------------------- interactions

function bindControls() {
  const addForm = document.getElementById('add-tx');
  if (addForm) {
    addForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(addForm);
      const amount = Number(data.get('amount'));
      const description = String(data.get('description') || '').trim();
      if (!Number.isFinite(amount) || amount <= 0) {
        txMessage = 'Enter an amount above $0.';
        render();
        return;
      }
      if (!description) {
        txMessage = 'Give the transaction a short description.';
        render();
        return;
      }
      ledger.transactions.push({
        id: 'u' + Date.now().toString(36),
        date: String(data.get('date') || '2026-11-26'),
        description,
        category: String(data.get('category') || 'shopping'),
        amount: Math.round(amount * 100) / 100,
      });
      persistLedger();
      txMessage = `Added “${description}” — totals, charts and budgets are updated.`;
      render();
    });
  }

  const search = document.getElementById('tx-search');
  if (search) {
    search.addEventListener('input', () => {
      txSearch.text = search.value;
      const cursor = search.selectionStart;
      render();
      const again = document.getElementById('tx-search');
      if (again) {
        again.focus();
        again.setSelectionRange(cursor, cursor);
      }
    });
  }
  const categorySelect = document.getElementById('tx-category');
  if (categorySelect) categorySelect.addEventListener('change', () => { txSearch.category = categorySelect.value; render(); });

  document.querySelectorAll('form.limit-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const limit = Number(new FormData(form).get('limit'));
      if (!Number.isFinite(limit) || limit < 0) return;
      const entry = ledger.budgets.find((b) => b.category === form.dataset.category);
      if (entry) entry.limit = Math.round(limit * 100) / 100;
      budgetBeingEdited = null;
      persistLedger();
      render();
    });
  });

  document.querySelectorAll('form.top-up').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const amount = Number(new FormData(form).get('amount'));
      if (!Number.isFinite(amount) || amount <= 0) return;
      const goal = ledger.goals.find((g) => g.id === form.dataset.goal);
      if (goal) goal.saved = Math.round((goal.saved + amount) * 100) / 100;
      persistLedger();
      render();
    });
  });
}

// One delegated click listener for the whole document, so the footer's
// Reset demo data button works as well as the controls inside #app.
document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'remove-tx') {
    ledger.transactions = ledger.transactions.filter((t) => t.id !== button.dataset.id);
    persistLedger();
    render();
  } else if (action === 'flip-bill') {
    const bill = ledger.bills.find((b) => b.id === button.dataset.id);
    if (bill) bill.paid = !bill.paid;
    persistLedger();
    render();
  } else if (action === 'edit-budget') {
    budgetBeingEdited = button.dataset.id;
    render();
  } else if (action === 'cancel-budget') {
    budgetBeingEdited = null;
    render();
  } else if (action === 'reset-data') {
    const fresh = freshLedger();
    ledger.transactions = fresh.transactions;
    ledger.budgets = fresh.budgets;
    ledger.bills = fresh.bills;
    ledger.goals = fresh.goals;
    try { localStorage.removeItem(STORE_KEY); } catch { /* ignore */ }
    render();
  }
});

window.addEventListener('hashchange', render);
render();

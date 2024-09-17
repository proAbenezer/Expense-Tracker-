const form = document.getElementById("form");
const formButton = document.getElementById("form--button");
const formCategory = document.getElementById("form--select");
const formAmount = document.getElementById("form--amount");
const formDate = document.getElementById("form--date");
const tableBody = document.getElementById("table--body");
const headerTotal = document.getElementById("header--total");
const headerDifference = document.querySelector("#header--difference span");
const headerIncome = document.querySelector(".header__income span");
const updateIncomeButton = document.getElementById("update--income");
const LOCAL_STORAGE_KEY_EXPENSE_ITEM = "expensesTrackerApp.expenses.expense";
const LOCAL_STORAGE_KEY_INCOME = "expenseTrackerApp.expenses.income";
let expenses =
  localStorage.getItem(LOCAL_STORAGE_KEY_EXPENSE_ITEM) == null
    ? []
    : JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_EXPENSE_ITEM));

let income =
  localStorage.getItem(LOCAL_STORAGE_KEY_INCOME) == null
    ? 0
    : JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_INCOME));
headerIncome.innerHTML = income;
renderExpense();

form.addEventListener("submit", handleFormSubmit);
tableBody.addEventListener("click", handleTableItem);

function handleFormSubmit(e) {
  e.preventDefault();
  if (formAmount.value == null || formAmount.value == "") {
    alert("Please the amount of expense item in US dollars! ");
    return;
  } else if (formDate.value == null || formDate.value == "") {
    alert("Please choose the right date for the expense due!");
    return;
  }

  addExpense(formCategory.value, formAmount.value, formDate.value);
}
updateIncomeButton.addEventListener("click", updateIncome);

function renderExpense() {
  tableBody.innerHTML = "";
  expenses?.forEach((expense) => {
    const tableRow = createElement("tr", "tabel__row");
    const tableCategoryData = createElement("td", "table__data");
    const tableAmountDate = createElement("td", "table__data");
    const tableDateData = createElement("td", "table__data");
    const tableActions = createElement("td", "table__data");
    const tableRemoveButtton = createElement("button", "table__button");
    const tableEditButtton = createElement("button", "table__button");

    tableRow.setAttribute("id", expense.id);
    tableCategoryData.innerHTML = expense.category;
    tableAmountDate.innerHTML = "$" + expense.amount;
    tableDateData.innerHTML = `<p> ${expense.date}</p>`;
    tableEditButtton.innerHTML = "Edit";
    tableRemoveButtton.innerHTML = "Remove";

    tableEditButtton.classList.add("table__button--edit");
    tableRemoveButtton.classList.add("table__button--remove");

    tableActions.appendChild(tableEditButtton);
    tableActions.appendChild(tableRemoveButtton);

    tableRow.appendChild(tableCategoryData);
    tableRow.appendChild(tableAmountDate);
    tableRow.appendChild(tableDateData);
    tableRow.appendChild(tableActions);

    tableBody.append(tableRow);
    updateHeaders();
  });
}

function createElement(element, className) {
  return document.createElement(element, className);
}

function addExpense(category, amount, date) {
  expenses.unshift({
    id: Date.now().toString(),
    category: category,
    amount: parseFloat(amount),
    date: date,
  });
  saveExpense();
}

function saveExpense() {
  localStorage.setItem(
    LOCAL_STORAGE_KEY_EXPENSE_ITEM,
    JSON.stringify(expenses)
  );
  localStorage.setItem(
    LOCAL_STORAGE_KEY_INCOME,
    parseFloat(headerIncome.innerHTML)
  );
  renderExpense();
}
function handleTableItem(e) {
  const targetedElement = e.target;
  clikedElement = targetedElement.parentElement.parentElement;

  if (targetedElement.classList[0] == "table__button--remove") {
    removeExpense(clikedElement.id);
  } else if (targetedElement.classList[0] == "table__button--edit") {
    updateExpense(clikedElement);
  }
}
function removeExpense(id) {
  expenses = expenses.filter((expense) => expense.id != id);
  saveExpense();
}

function updateExpense(clikedElement) {
  const originalExpense = expenses.find(
    (expense) => clikedElement.id == expense.id
  );
  const editButton = clikedElement.childNodes[3].childNodes[0];
  const dateElement = clikedElement.childNodes[2].childNodes[0];
  const amountElement = clikedElement.childNodes[1].childNodes[0];
  const categoryElement = clikedElement.childNodes[0].childNodes[0];

  if (editButton.innerHTML.toLowerCase() == "edit") {
    const updateDate = createElement("input", "update__date");
    updateDate.setAttribute("type", "date");
    updateDate.value = originalExpense.date;
    dateElement.replaceWith(updateDate);
    const updateAmount = createElement("input", "update__amount");
    updateAmount.setAttribute("type", "number");
    updateAmount.value = originalExpense.amount;
    amountElement.replaceWith(updateAmount);
    const categoryUpdate = createElement(
      "select",
      "category__update form__select"
    );
    const op1 = createElement("option", "");
    const op2 = createElement("option", "");
    const op3 = createElement("option", "");
    const op4 = createElement("option", "");
    const op5 = createElement("option", "");

    op1.value = op1.innerHTML = "Food";
    op2.value = op2.innerHTML = "Transporation";
    op3.value = op3.innerHTML = "Relaxtion";
    op4.value = op4.innerHTML = "Rent";
    op5.value = op5.innerHTML = "Others";

    categoryUpdate.appendChild(op1);
    categoryUpdate.appendChild(op2);
    categoryUpdate.appendChild(op3);
    categoryUpdate.appendChild(op4);
    categoryUpdate.appendChild(op5);

    categoryElement.replaceWith(categoryUpdate);

    editButton.innerHTML = "Save";
  } else {
    editButton.innerHTML = "Edit";
    originalExpense.date = dateElement.value;
    originalExpense.amount = parseFloat(amountElement.value);
    originalExpense.category = categoryElement.value;
    saveExpense();
  }
}

function updateHeaders() {
  const totalExpense = expenses.reduce((accumulator, expense) => {
    return accumulator + expense.amount;
  }, 0);
  headerTotal.innerHTML = `Expense: $${totalExpense.toFixed(2)}`; // Display total in the header
  let difference = parseFloat(headerIncome.innerHTML) - totalExpense;
  if (difference >= 0) {
    headerDifference.style.color = "green";
    headerDifference.innerHTML = `$${difference}`;
    document.getElementById("header--difference").style.color = "green";
  } else {
    headerDifference.style.color = "red";
    headerDifference.innerHTML = `-$${Math.abs(difference)}`;
    document.getElementById("header--difference").style.color = "red";
  }
}

function updateIncome() {
  headerIncome.innerHTML = prompt("Enter the new income amount in US Dollar");
  saveExpense();
}

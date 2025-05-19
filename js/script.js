// Mobile menu toggle
const mobileMenuButton = document.querySelector(".mobile-menu-button");
const mobileMenu = document.querySelector(".mobile-menu");

mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: "smooth",
      });

      // Close mobile menu if open
      mobileMenu.classList.add("hidden");
    }
  });
});

// Back to top button
const backToTopButton = document.getElementById("back-to-top");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    backToTopButton.classList.remove("opacity-0", "invisible");
    backToTopButton.classList.add("opacity-100", "visible");
  } else {
    backToTopButton.classList.remove("opacity-100", "visible");
    backToTopButton.classList.add("opacity-0", "invisible");
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Expense Tracker App Logic
const form = document.getElementById("expense-form");
const expenseTableBody = document.getElementById("expense-table-body");
const totalEl = document.getElementById("total");
const historyList = document.getElementById("history-list");
const todayDateEl = document.getElementById("today-date");

// Format today's date
const today = new Date();
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
todayDateEl.textContent = today.toLocaleDateString("id-ID", options);

const todayKey = today.toISOString().split("T")[0];
let data = JSON.parse(localStorage.getItem("dailyExpenses")) || {};
if (!data[todayKey]) data[todayKey] = [];

let expenses = data[todayKey];

// Render today's expenses
function renderToday() {
  expenseTableBody.innerHTML = "";
  let total = 0;

  if (expenses.length === 0) {
    expenseTableBody.innerHTML = `
                    <tr>
                        <td colspan="4" class="py-4 text-gray-400 text-center">
                            Belum ada pengeluaran hari ini
                        </td>
                    </tr>
                `;
  } else {
    expenses.forEach((expense, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                        <td class="py-3">${index + 1}</td>
                        <td>${expense.description}</td>
                        <td>Rp ${expense.amount.toLocaleString("id-ID")}</td>
                        <td class="py-3">
                            <div class="flex justify-center space-x-2">
                                <button onclick="editExpense(${index})" class="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm">
                                    <i class="fas fa-edit mr-1"></i> Edit
                                </button>
                                <button onclick="deleteExpense(${index})" class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm">
                                    <i class="fas fa-trash-alt mr-1"></i> Hapus
                                </button>
                            </div>
                        </td>
                    `;
      expenseTableBody.appendChild(row);
      total += expense.amount;
    });
  }

  totalEl.textContent = `Rp ${total.toLocaleString("id-ID")}`;
  saveData();
}

// Save data to localStorage
function saveData() {
  data[todayKey] = expenses;
  localStorage.setItem("dailyExpenses", JSON.stringify(data));
  renderHistory();
}

// Add new expense
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const descInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");

  const desc = descInput.value.trim();
  const amount = parseInt(amountInput.value);

  if (!desc || isNaN(amount) || amount <= 0) {
    alert("Masukkan deskripsi dan jumlah yang valid");
    return;
  }

  expenses.push({ description: desc, amount });
  renderToday();

  // Reset form
  form.reset();
  descInput.focus();
});

// Delete expense
function deleteExpense(index) {
  if (confirm("Apakah Anda yakin ingin menghapus pengeluaran ini?")) {
    expenses.splice(index, 1);
    renderToday();
  }
}

// Edit expense
function editExpense(index) {
  const expense = expenses[index];

  const newDesc = prompt("Deskripsi baru:", expense.description);
  if (newDesc === null) return;

  const newAmount = prompt("Jumlah baru (Rp):", expense.amount);
  if (newAmount === null || isNaN(parseInt(newAmount))) return;

  expenses[index] = {
    description: newDesc.trim(),
    amount: parseInt(newAmount),
  };

  renderToday();
}

// Render history
function renderHistory() {
  if (!historyList) return;

  historyList.innerHTML = "";

  const sortedDates = Object.keys(data).sort(
    (a, b) => new Date(b) - new Date(a)
  );

  if (sortedDates.length <= 1) {
    historyList.innerHTML = `
                    <li class="text-gray-400 text-center py-4">
                        Belum ada riwayat pengeluaran sebelumnya
                    </li>
                `;
    return;
  }

  sortedDates.forEach((date) => {
    if (date === todayKey) return;

    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const total = data[date].reduce((sum, exp) => sum + exp.amount, 0);

    const li = document.createElement("li");
    li.className =
      "flex justify-between items-center bg-gray-700 px-4 py-3 rounded-lg";
    li.innerHTML = `
                    <span class="font-medium">${formattedDate}</span>
                    <span class="font-bold text-green-500">Rp ${total.toLocaleString(
                      "id-ID"
                    )}</span>
                `;

    historyList.appendChild(li);
  });
}

// Initial render
renderToday();

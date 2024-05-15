// source: https://www.youtube.com/watch?v=OnML-5Mk70o


// class = blueprint; Object = pokerTracker
export default class pokerTracker {
  // constructor(parameter) = method for define the properties & method of objects
  constructor(querySelectorString) {
    this.root = document.querySelector(querySelectorString);
    this.root.innerHTML = pokerTracker.html();
    this.root.querySelector(".new-entry").addEventListener("click", () => {
      this.onNewEntryBtnClick();
    });
    this.load();
  }

  static html() {
    return `
  <table class="poker-tracker">
        <thead>
          <tr>
            <th>Date</th>
            <th>Hr Played</th>
            <th>Description</th>
            <th>Type</th>
            <th>Amount</th>
            <th>x</th>
          </tr>
        </thead>
        <tbody class="entries">         
        </tbody>
        <tbody>
          <tr>
            <td colspan="6" class="controls">
              <button type="button" class="new-entry">New Entry</button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="6" class="summary">
              <strong>Total:</strong>
              <span class="total">$0.00</span>
            </td> 
          </tr>
          <tr>
            <td colspan="6" class="summary">
              <strong>Total Hr:</strong>
              <span class="total-HR">0</span>
            </td> 
          </tr>
        </tfoot>
      </table>`;
  }

  static entryHtml() {
    return `
    <tr>
    <td><input class="input input-date" type="date" /></td>
    <td><select class="input input-hr-played">
        <option value= "hr">1 hr</option>
        <option value= "hr">2 hr</option>
        <option value= "hr">3 hr</option>
        <option value= "hr">4 hr</option>
        <option value= "hr">5 hr</option>
        <option value= "hr">6 hr</option>
        <option value= "hr">7 hr</option>
        <option value= "hr">8 hr</option>
        <option value= "hr">9 hr</option>
        <option value= "hr">10 hr</option>
        <option value= "hr">11 hr</option>
        <option value= "hr">12 hr</option>
    </td>
    <td><input class="input input-description" type="text" /></td>
    <td>
      <select class="input input-type">
        <option value="Income">Win</option>
        <option value="expense">Lose</option>
      </select>
    </td>
    <td><input class="input input-amount" type="number" /></td>
    <td>
      <button type="button" class="delete-entry">X</button>
    </td>
  </tr>
    `;
  }

  // initial loading of data
  load() {
    const entries = JSON.parse(
      // when user start new session with empty entry
      localStorage.getItem("poker-tracker-entries") || "[]"
    );
    // for every single entry in entries array
    for (const entry of entries) {
      this.addEntry(entry);
    }
    this.updateSummary();
  }

  // add new entry inside the table as an object. parameter entry which defaults to an empty object {}.
  // insertAdjacentHTML(position,text insert)
  addEntry(entry = {}) {
    this.root
      .querySelector(".entries")
      .insertAdjacentHTML("beforeend", pokerTracker.entryHtml());
    const row = this.root.querySelector(".entries tr:last-of-type ");
    row.querySelector(".input-date").value =
      entry.date || new Date().toISOString().replace(/T.*/, "");
    row.querySelector(".input-hr-played").value = entry.hrPlay || "0";
    row.querySelector(".input-description").value = entry.description || "";
    row.querySelector(".input-type").value = entry.type || "income";
    row.querySelector(".input-amount").value = entry.amount || "0";
    row.querySelector(".delete-entry").addEventListener("click", (event) => {
      this.onDeleteEntryBtnClick(event);
    });
    row.querySelectorAll(".input").forEach((input) => {
      input.addEventListener("change", () => {
        this.save();
      });
    });
  }

  // click on new entry button
  onNewEntryBtnClick() {
    this.addEntry();
  }

  // save all data to local storage
  save() {
    const data = this.getEntryRows().map((row) => {
      return {
        date: row.querySelector(".input-date").value,
        hrPlayed: row.querySelector(".input-hr-played").value,
        description: row.querySelector(".input-description").value,
        type: row.querySelector(".input-type").value,
        amount: parseFloat(row.querySelector(".input-amount").value),
      };
    });
    localStorage.setItem("poker-tracker-entries", JSON.stringify(data));
    this.updateSummary();
  }

  // take all data from the rows and work out the total then display on page
  updateSummary() {
    // reduce(cb(total, current element value),initial Value)
    const total = this.getEntryRows().reduce((total, row) => {
      const amount = row.querySelector(".input-amount").value;
      const isExpense = row.querySelector(".input-type").value === "expense";
      const modifier = isExpense ? -1 : +1;
      return (total = total + amount * modifier);
    }, 0);

    const totalFormatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(total);

    this.root.querySelector(".total").textContent = `${totalFormatted}`;

    const totalHrPlayed = this.getEntryRows().reduce((totalHrPlayed, row)=>{
      const hourPlayed = Number(row.querySelector('.input-hr-played').value);
      return totalHrPlayed = totalHrPlayed + hourPlayed
     
    },0) 
    this.root.querySelector('.total-HR').textContent = `${totalHrPlayed}`
  }

  // return all the rows inside the table.  without the Array., JS return a node list but we want to save data in an array
  getEntryRows() {
    return Array.from(this.root.querySelectorAll(".entries tr"));
  }

  // click on delete button
  onDeleteEntryBtnClick(event) {
    event.target.closest("tr").remove();
    this.save();
  }
}

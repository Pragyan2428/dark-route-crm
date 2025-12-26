const companies = [
  { id: 1, name: "Romeo Lane", tier: "gold", phone: "919337876033", type: "Restaurant", time: "11:30 AM – 6 PM" },
  { id: 2, name: "Orion Café", tier: "gold", phone: "919000000002", type: "Café", time: "Late morning / Evening" },
  { id: 3, name: "Biryani Box", tier: "gold", phone: "919000000003", type: "Food Brand", time: "Afternoon" },
  { id: 4, name: "3M Car Care Studio", tier: "silver", phone: "919167298121", type: "Car Care", time: "11 AM – 2 PM" },
  { id: 5, name: "Sai Paramount IT", tier: "silver", phone: "919078072730", type: "IT Services", time: "10 AM – 4 PM" },
  { id: 6, name: "Acre Rise", tier: "silver", phone: "919000000006", type: "Real Estate", time: "10 AM – 3 PM" },
  { id: 7, name: "Handishala", tier: "bronze", phone: "919000000007", type: "Local Food", time: "Mid-day" },
  { id: 8, name: "Decathlon", tier: "silver", phone: "919000000008", type: "Sports Retail", time: "Afternoon / Evening" }
];

const container = document.getElementById("company-container");
const searchInput = document.getElementById("searchInput");

function getData(id, key, def="") {
  return localStorage.getItem(`${key}_${id}`) || def;
}

function setData(id, key, value) {
  localStorage.setItem(`${key}_${id}`, value);
  localStorage.setItem(`time_${id}`, new Date().toLocaleString());
}

function render(list) {
  container.innerHTML = "";
  list.forEach(c => {
    container.innerHTML += `
      <div class="card ${c.tier}">
        <h2>${c.name}</h2>
        <p><b>Type:</b> ${c.type}</p>
        <p><b>Best Time:</b> ${c.time}</p>

        <div class="actions">
          <a class="call" href="tel:${c.phone}">Call</a>
          <a class="whatsapp" href="https://wa.me/${c.phone}" target="_blank">WhatsApp</a>
        </div>

        <select onchange="setData(${c.id}, 'status', this.value)">
          <option value="">Lead Status</option>
          <option ${getData(c.id,'status')==="New"?"selected":""}>New</option>
          <option ${getData(c.id,'status')==="Interested"?"selected":""}>Interested</option>
          <option ${getData(c.id,'status')==="Follow-up"?"selected":""}>Follow-up</option>
          <option ${getData(c.id,'status')==="Closed"?"selected":""}>Closed</option>
          <option ${getData(c.id,'status')==="Not Interested"?"selected":""}>Not Interested</option>
        </select>

        <textarea
          placeholder="Add follow-up notes..."
          oninput="setData(${c.id}, 'note', this.value)"
        >${getData(c.id,'note')}</textarea>

        <div class="meta">
          Last update: ${getData(c.id,'time','—')}
        </div>
      </div>
    `;
  });
}

function filterTier(tier) {
  if (tier === "all") render(companies);
  else render(companies.filter(c => c.tier === tier));
}

searchInput.addEventListener("input", () => {
  const v = searchInput.value.toLowerCase();
  render(companies.filter(c =>
    c.name.toLowerCase().includes(v) ||
    c.type.toLowerCase().includes(v)
  ));
});

function exportCSV() {
  let csv = "Company,Type,Tier,Status,Notes,Last Update\n";
  companies.forEach(c => {
    csv += `${c.name},${c.type},${c.tier},${getData(c.id,'status')},${(getData(c.id,'note')||"").replace(/,/g," ")},${getData(c.id,'time')}\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "DarkRoute_Sponsorship_Tracker.csv";
  a.click();
}

render(companies);

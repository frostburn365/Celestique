function initBookingForm() {
  const NameSelect = document.getElementById("name");
  const adultsSelect = document.getElementById("adults");
  const childrenSelect = document.getElementById("children");
  const dateInput = document.getElementById("booking-date");
  const timeSelect = document.getElementById("booking-time");
  const areaSelect = document.getElementById("area"); 
  const agreeCheckbox = document.getElementById("agree");
  const nextBtn = document.getElementById("nextBtn");
  const bookingForm = document.querySelector(".booking-form");

  if (!NameSelect || !adultsSelect || !dateInput || !timeSelect || !agreeCheckbox || !nextBtn || !bookingForm || !areaSelect) {
    console.error("Satu atau lebih elemen form booking tidak ditemukan.");
    return;
  }

  populateDropdown(adultsSelect, 1, 10, "Adult", "Adults");
  populateDropdown(childrenSelect, 0, 5, "Child", "Children");
  
  setupDatePicker(dateInput);

  const updateAvailableTimes = () => {
    populateTimeSlots(timeSelect, dateInput.value, areaSelect.value);
  };

  dateInput.addEventListener("change", updateAvailableTimes);
  areaSelect.addEventListener("change", updateAvailableTimes);
  
  agreeCheckbox.addEventListener("change", () => {
    nextBtn.disabled = !agreeCheckbox.checked;
  });

  bookingForm.addEventListener("submit", e => {
    e.preventDefault();
    const bookingData = {
      name: NameSelect.value,
      adults: adultsSelect.value,
      children: childrenSelect.value,
      date: dateInput.value,
      time: timeSelect.value,
      area: areaSelect.value
    };
    alert(`Booking Details:\n- Name: ${bookingData.name}\n- Guests: ${bookingData.adults}\n- ${bookingData.children}\n- Date: ${bookingData.date}\n- Time: ${bookingData.time}\n- Area: ${bookingData.area}\n\nThank you!`);
  });

  updateAvailableTimes();
}

/**
 * Mengisi dropdown jam secara dinamis berdasarkan tanggal dan area yang dipilih.
 * @param {HTMLSelectElement} timeSelectEl - Elemen dropdown jam.
 * @param {string} selectedDate - Tanggal yang dipilih (format YYYY-MM-DD).
 * @param {string} selectedArea - Area yang dipilih.
 */
function populateTimeSlots(timeSelectEl, selectedDate, selectedArea) {
  timeSelectEl.innerHTML = ''; 

  const date = new Date(selectedDate + 'T00:00:00'); 
  const dayOfWeek = date.getDay();

  let timeRanges = [];

  // Aturan untuk Weekday Lunch (Senin - Jumat)
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    timeRanges.push({ startH: 11, startM: 30, endH: 14, endM: 0 });
  }

  // Aturan untuk Dinner (Senin - Sabtu)
  if (dayOfWeek >= 1 && dayOfWeek <= 6) {
    timeRanges.push({ startH: 17, startM: 30, endH: 22, endM: 15 }); // Last order 22:15
  }
  
  // Aturan khusus untuk The Ember Courtyard
  if (selectedArea === 'The Ember Courtyard (Al Fresco Bar)') {
    // Senin - Kamis
    if (dayOfWeek >= 1 && dayOfWeek <= 4) {
      timeRanges.push({ startH: 17, startM: 30, endH: 24, endM: 59 }, { startH: 0, startM: 0, endH: 1, endM: 0 }); // Sampai jam 1:00 AM
    }
    // Jumat & Sabtu
    if (dayOfWeek === 5 || dayOfWeek === 6) {
        timeRanges.push({ startH: 17, startM: 30, endH: 24, endM: 59 }, { startH: 0, startM: 0, endH: 2, endM: 0 }); // Sampai jam 2:00 AM
    }
  }

  // Jika tidak ada jam buka (misal: Hari Minggu)
  if (timeRanges.length === 0) {
    const option = document.createElement("option");
    option.textContent = "Closed";
    option.disabled = true;
    timeSelectEl.appendChild(option);
    return;
  }

  
  generateSlots(timeSelectEl, timeRanges, 30);
}

function generateSlots(selectEl, ranges, intervalMinutes) {
  const allSlots = new Set(); 

  ranges.forEach(range => {
    let currentHour = range.startH;
    let currentMin = range.startM;

    while (currentHour < range.endH || (currentHour === range.endH && currentMin <= range.endM)) {
      const hourString = String(currentHour).padStart(2, '0');
      const minString = String(currentMin).padStart(2, '0');
      allSlots.add(`${hourString}:${minString}`);

      currentMin += intervalMinutes;
      if (currentMin >= 60) {
        currentHour++;
        currentMin -= 60;
      }
    }
  });

  const sortedSlots = Array.from(allSlots).sort();
  sortedSlots.forEach(timeString => {
    const option = document.createElement("option");
    option.value = timeString;
    option.textContent = timeString;
    selectEl.appendChild(option);
  });
}


function populateDropdown(selectEl, start, end, singular, plural) {
  for (let i = start; i <= end; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `${i} ${i === 1 ? singular : plural}`;
    selectEl.appendChild(option);
  }
  if (start === 1) selectEl.value = 2;
}

function setupDatePicker(dateInputEl) {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const todayString = `${year}-${month}-${day}`;
  dateInputEl.min = todayString;
  dateInputEl.value = todayString;
}
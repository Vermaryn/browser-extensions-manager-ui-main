
const toggleBtn = document.getElementById("ToggleBtn");
const icon = document.getElementById("icon");
const logo = document.getElementById("logo");
const allBtn = document.getElementById("all");
const activeBtn = document.getElementById("active");
const inactiveBtn = document.getElementById("inactive");

let cardsList = [];


const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  icon.src = './assets/images/icon-sun.svg';
  logo.src = './assets/images/redwhite.svg';
} else {
  document.body.classList.remove('dark');
  icon.src = './assets/images/icon-moon.svg';
  logo.src = './assets/images/logo.svg';
}

// Dark Mode Toggle
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');

  icon.src = isDark ? './assets/images/icon-sun.svg' : './assets/images/icon-moon.svg';
  logo.src = isDark ? './assets/images/redwhite.svg' : './assets/images/logo.svg';

  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Load Cards from JSON + Apply States
fetch("./data.json")
  .then((response) => response.json())
  .then((dataArray) => {
    const container = document.getElementById("container");
    const templateCard = document.getElementById("card");

    dataArray.forEach((data) => {
      const card = templateCard.cloneNode(true);
      card.style.display = "block";
      card.removeAttribute("id");

      //  Inject card content
      const img = card.querySelector("img");
      const h2 = card.querySelector("h2");
      const p = card.querySelector("p");
      const checkbox = card.querySelector('input[type="checkbox"]');
      const toggleKey = `toggle-${data.id}`;
      if (!data.id) {
  console.error("Missing ID for card:", data);
}


      img.src = data.logo;
      img.alt = data.name;
      h2.textContent = data.name;
      p.textContent = data.description;

      //  Load toggle state from localStorage
      const saved = localStorage.getItem(toggleKey);
      const isActive = saved !== null ? saved === "true" : data.isActive;

      checkbox.checked = isActive;
      card.setAttribute("data-active", String(isActive)); 
   
      checkbox.addEventListener("change", () => {
        localStorage.setItem(toggleKey, checkbox.checked);
        card.setAttribute("data-active", String(checkbox.checked));

        const currentFilter = localStorage.getItem("filter-mode") || "all";
        setTimeout(() => {
          filterCards(currentFilter);
        }, 300); 
      });

      container.appendChild(card);
      cardsList.push(card);
    });
    templateCard.remove();

    
    const lastFilter = localStorage.getItem("filter-mode") || "all";
    filterCards(lastFilter);
  })
  .catch((error) => console.error("Error loading JSON:", error));


//  Filter Function
function filterCards(mode) {
  localStorage.setItem("filter-mode", mode);

  cardsList.forEach((card) => {
    const isActive = card.getAttribute("data-active") === "true";

    if (mode === "all") {
      card.style.display = "block";
    } else if (mode === "active" && isActive) {
      card.style.display = "block";
    } else if (mode === "inactive" && !isActive) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  });

 
  [allBtn, activeBtn, inactiveBtn].forEach((btn) => {
    btn.classList.remove("active");
  });
  document.getElementById(mode).classList.add("active");
}

// Filter Button Event Listeners
allBtn.addEventListener("click", () => filterCards("all"));
activeBtn.addEventListener("click", () => filterCards("active"));
inactiveBtn.addEventListener("click", () => filterCards("inactive"));

//  Remove Card on Click
document.getElementById("container").addEventListener("click", function (e) {
  if (e.target.classList.contains("remove")) {
    const card = e.target.closest(".Card");
    if (card) card.remove();
  }
});

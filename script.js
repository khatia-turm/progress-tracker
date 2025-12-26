"use strict";
const progressContainer = document.querySelector(".section-progress");
const newGoal = document.querySelector(".section-progress__row--input");
const btnNewGoal = document.querySelector(".input--button");
const goalContainer = document.querySelector(".section-progress__list");

const STORAGE_KEY = "goals";
const savedGoals = JSON.parse(localStorage.getItem(STORAGE_KEY));

class Goal {
  constructor(
    name,
    dayscount = 7,
    days = new Array(dayscount).fill(false),
    id = Date.now()
  ) {
    this.name = name;
    this.days = days;
    this.id = id;
  }
}

class App {
  #goals = [];

  constructor() {
    this._getLocalStorage();
    btnNewGoal.addEventListener("click", this._newGoal.bind(this));
    goalContainer.addEventListener("change", this._toggleCheck.bind(this));
  }

  _newGoal(e) {
    e.preventDefault();
    const name = newGoal.value;
    if (!name) return;

    const goal = new Goal(name);
    this.#goals.push(goal);

    this._renderGoal(goal);
    this._setLocalStorage();
    newGoal.value = "";
  }

  _renderGoal(goal) {
    const checkboxes = goal.days
      .map(
        (checked, i) => `
      <label class="custom-checkbox">
        <input type="checkbox" data-day="${i}" ${
          checked ? "checked" : ""
        } class="checkbox"/>
        <img src=${
          checked ? "img/checked.png" : "img/unchecked.png"
        } alt="checkbox img" class="checkbox__img">
      </label>
    `
      )
      .join("");

    const html = `
      <div class="section-progress__row" data-id="${goal.id}">
        <span>${goal.name}</span>
        ${checkboxes}
      </div>
    `;
    goalContainer.insertAdjacentHTML("beforeend", html);
    console.log(goal);
  }

  _toggleCheck(e) {
    if (!e.target.dataset.day) return;

    const row = e.target.closest(".section-progress__row");
    const goal = this.#goals.find((g) => g.id === +row.dataset.id);
    const dayIndex = e.target.dataset.day;

    goal.days[dayIndex] = e.target.checked;
    const checkbox = e.target;
    if (!e.target.classList.contains("checkbox")) return;
    const img = checkbox.nextElementSibling;
    img.src = checkbox.checked ? "img/checked.png" : "img/unchecked.png";
    this._setLocalStorage();
  }

  _setLocalStorage() {
    localStorage.setItem("goals", JSON.stringify(this.#goals));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("goals"));
    if (!data) return;

    this.#goals = data.map((g) => new Goal(g.name, g.days, g.id));
    this.#goals.forEach((goal) => this._renderGoal(goal));
  }
}

const app = new App();

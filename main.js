const api_url = "https://pokeapi.co/api/v2/pokemon";

async function getPokemon() {
  try {
    let res = await fetch(api_url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function getSinglePokemon(pokemon) {
  try {
    let res = await fetch(api_url + "/" + pokemon);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function getAbility(url) {
  try {
    let res = await fetch(url);
    return await res.json();
  } catch (error) {
    console.log(error);
  }
}

async function renderPokemon() {
  let pokemons = await getPokemon();
  pokemons = pokemons.results.slice(0, 5);
 
  let html = "";
 
  for (const pokemon of pokemons) {
  	 const response = await getSinglePokemon(pokemon.name);
    let htmlSegment = `<div class="col-xl-4 col-sm-6 mb-5">
        <div class="bg-white rounded shadow-sm py-5 px-4">
        <img src="${response.sprites.other['official-artwork'].front_default}" alt="${
            pokemon.name
          }" class="img-fluid rounded-circle mb-3" onclick="showSpecs(this.alt)">
          <div><button type="button" value="${
            pokemon.name
          }" class="btn btn-outline-info" onclick="showSpecs(this.value)">${
      pokemon.name
    }</></div>

          <div id="${pokemon.name}" class="specs hide mt-4">

          </div>

          <div id="${pokemon.name}-ability" class="ability hide mt-4">

          </div>

        </div>


      </div>`;

    html += htmlSegment;
  }

  let container = document.querySelector(".pokemon-wrap");
  container.innerHTML = html;
}

async function showSpecs(_this) {
  let pokemon = _this;
  const response = await getSinglePokemon(pokemon);

  let template = document.getElementById("specs-template");
  let clonedRow = template.content.cloneNode(true);

  let name = clonedRow.querySelector("#name");
  let abilitiesHTML = clonedRow.querySelector("#abilities");
  let height = clonedRow.querySelector("#height");
  let experience = clonedRow.querySelector("#experience");

  name.textContent = pokemon;
  let abilities = response.abilities;
  let html = "";
  Array.from(abilities).forEach(ability => {
    let htmlSegment = `<a data-id="${pokemon}-ability" href="#" data-value="${ability.ability.url}" onclick=showAbility(event)>${ability.ability.name}</a>&nbsp`;
    html += htmlSegment;
  });

  abilitiesHTML.innerHTML = html;

  height.textContent = response.height;
  experience.textContent = response.base_experience;

  document.getElementById(pokemon).classList.toggle("hide");
  document.getElementById(pokemon).innerHTML = "";
  document.getElementById(pokemon).appendChild(clonedRow);
  let abilityId = `${pokemon}-ability`;
  if (!document.getElementById(abilityId).classList.contains("hide")) {
    document.getElementById(abilityId).classList.toggle("hide");
  }
}

async function showAbility(event) {
  event.preventDefault();
  let url = event.target.getAttribute("data-value");
  let dataId = event.target.getAttribute("data-id");
  let response = await getAbility(url);

  let template = document.getElementById("ability-template");
  let clonedRow = template.content.cloneNode(true);

  let abilityName = clonedRow.querySelector("#ability-name");
  let abilityEffect = clonedRow.querySelector("#ability-effect");
  let shortEffect = clonedRow.querySelector("#short-effect");
  let flavourEffect = clonedRow.querySelector("#flavour-effect");

  abilityName.textContent = response.name;

  let filterFlavourTextEntries = response.flavor_text_entries;
  Array.from(filterFlavourTextEntries).forEach(entry => {
    if (entry.language.name == "en") {
      flavourEffect.innerHTML = entry.flavor_text;
    }
  });

  let filterAbilityEffect = response.effect_entries;
  Array.from(filterAbilityEffect).forEach(ability => {
    if (ability.language.name == "en") {
      abilityEffect.textContent = ability.effect;
      shortEffect.textContent = ability.short_effect;
    }
  });

  if (document.getElementById(dataId).classList.contains("hide")) {
    document.getElementById(dataId).classList.toggle("hide");
  }

  document.getElementById(dataId).innerHTML = "";
  document.getElementById(dataId).appendChild(clonedRow);
}

renderPokemon();

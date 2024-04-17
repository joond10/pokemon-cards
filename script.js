// Fetching pokemon types for drop down menu and fetching selected types
async function fetchPokemonType() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type");
    const data = await response.json();
    const types = data.results;

    //Select dropdown menu
    let dropdown = document.querySelector("#types");
    //For each type
    types.forEach((type) => {
      if (
        type.name !== "steel" &&
        type.name !== "unknown" &&
        type.name !== "shadow" &&
        type.name !== "dark"
      ) {
        //Create dropdown option
        const option = document.createElement("option");
        option.value = type.name;
        option.text = upperCase(type.name);
        //Add to dropdown menu
        dropdown.appendChild(option);
      }
    });

    //If there is a change in the dropdown menu
    dropdown.addEventListener("change", () => {
      const selectedType = dropdown.value;
      //Fetch the pokemon where change occurs
      fetchPokemonByType(selectedType);
    });
  } catch (error) {
    console.log("Error fetching types: ", error);
  }
}

async function fetchPokemonByType(selectedType) {
  try {
    //First fetch for the complete list of pokemon
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon/?limit=151"
    );
    const data = await response.json();
    const listOfPokemon = data.results;

    //Empty array of pokeMatches
    const pokeMatches = [];
    for (const pokemon of listOfPokemon) {
      //Fetch the data inside the the specific pokemon URL
      const pokeResponse = await fetch(pokemon.url);
      //Parse the data
      const pokeDetails = await pokeResponse.json();
      //An array of types for each pokemon that contains the type name
      const types = pokeDetails.types.map((typeData) => typeData.type.name);
      //If the array has the selected type, push it into matches
      if (types.includes(selectedType)) {
        pokeMatches.push(pokeDetails);
      }
    }
    displayCards(pokeMatches);
  } catch (error) {
    console.error("Error fetching Pokémon of selected type:", error);
    return [];
  }
}

/////////////////////////////////////////////////////////////////////////

//Fetch all pokemon when view all is clicked
async function fetchAllPokemon() {
  const noOfPokemon = 151;
  let ID = 1;
  let pokemonData = [];

  try {
    for (let ID = 1; ID <= noOfPokemon; ID++) {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${ID}`);
      const data = await response.json();
      pokemonData.push(data);
    }
    displayCards(pokemonData);
  } catch (error) {
    console.log("Error fetching Pokémon", error);
  }
}

/////////////////////////////////////////////////////////////////////////

//Fetch Bulbasaur, Charmander, and Squirtle only on window load
async function fetchStarterPokemon() {
  const starterPokemon = [1, 4, 7];
  try {
    const pokemonData = [];

    for (let i = 0; i < starterPokemon.length; i++) {
      const ID = starterPokemon[i];
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${ID}`);
      const data = await response.json();
      pokemonData.push(data);
    }

    displayCards(pokemonData);
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
  }
}

/////////////////////////////////////////////////////////////////////////

//Fetch about description to display in card
function fetchAboutDescription(pokemon) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(pokemon.species.url);
      const data = await response.json();
      const englishEntry = data.flavor_text_entries.find(
        (entry) => entry.language.name === "en"
      );
      // If English entry is found, replace \n and \f with a space
      const effect = englishEntry
        ? englishEntry.flavor_text.replace(/[\n\f]/g, " ")
        : "";
      resolve(effect);
    } catch (error) {
      reject("Unable to fetch about: " + error);
    }
  });
}

/////////////////////////////////////////////////////////////////////////

//Display functions (Helpers)
function createCard() {
  const card = document.createElement("div");
  card.className = "card";
  return card;
}

function createTitle() {
  const title = document.createElement("div");
  title.className = "title";
  return title;
}

function createPokemonName(pokemon) {
  const name = document.createElement("div");
  name.className = "name";
  name.innerHTML = `<h1>${upperCase(pokemon.name)}</h1>`;
  return name;
}

function createPokemonHP(pokemon) {
  const hp = document.createElement("div");
  hp.className = "hp";
  hp.innerHTML = `<h1>${pokemon.stats[0].base_stat} HP</h1>`;
  return hp;
}

function createPokemonImage(pokemon) {
  const img = document.createElement("img");
  img.src = pokemon.sprites.other.showdown.front_default;
  img.alt = pokemon.name;
  return img;
}

function createAboutSection() {
  const aboutInfo = document.createElement("div");
  aboutInfo.id = "aboutInfo";
  return aboutInfo;
}

function createAboutDescription(pokemon) {
  const aboutDescription = document.createElement("p");
  aboutDescription.className = "aboutDescription";
  fetchAboutDescription(pokemon)
    .then((about) => {
      aboutDescription.innerText = about;
    })
    .catch((error) => {
      console.error(error);
    });
  return aboutDescription;
}

function appendToAbout(aboutInfo, aboutDescription) {
  aboutInfo.appendChild(aboutDescription);
}

function appendToTitle(title, name, hp) {
  title.appendChild(name);
  title.appendChild(hp);
}

function appendAllToCard(card, title, img, line, aboutInfo) {
  card.appendChild(title);
  card.appendChild(img);
  card.appendChild(line);
  card.appendChild(aboutInfo);
}

//Sets the background color and hp color based on pokemon type
function setCardColors(pokemon, card, hp) {
  switch (pokemon.types[0].type.name) {
    case "water":
      card.style.backgroundColor = "#539AE2";
      hp.style.color = "rgb(0, 124, 201)";
      break;
    case "fire":
      card.style.backgroundColor = "#EA7A3C";
      hp.style.color = "rgb(200, 64, 15)";
      break;
    case "grass":
      card.style.backgroundColor = "#71C558";
      hp.style.color = "#3e9424";
      break;
    case "poison":
      card.style.backgroundColor = "#B468B7";
      hp.style.color = "#824a84";
      break;
    case "bug":
      card.style.backgroundColor = "#94BC4A";
      hp.style.color = "#4f6722";
      break;
    case "dark":
      card.style.backgroundColor = "#736C75";
      hp.style.color = "#5a565b";
      break;
    case "electric":
      card.style.backgroundColor = "#E5C531";
      hp.style.color = "#ad9424";
      break;
    case "fairy":
      card.style.backgroundColor = "#E397D1";
      hp.style.color = "#af5e9c";
      break;
    case "fighting":
      card.style.backgroundColor = "#CB5F48";
      hp.style.color = "#8e3c2a";
      break;
    case "flying":
      card.style.backgroundColor = "#7DA6DE";
      hp.style.color = "#607ba0";
      break;
    case "ghost":
      card.style.backgroundColor = "#846AB6";
      hp.style.color = "#5d4884";
      break;
    case "ground":
      card.style.backgroundColor = "#CC9F4F";
      hp.style.color = "#987537";
      break;
    case "ice":
      card.style.backgroundColor = "#70CBD4";
      hp.style.color = "#55a7af";
      break;
    case "normal":
      card.style.backgroundColor = "#AAB09F";
      hp.style.color = "#70746a";
      break;
    case "psychic":
      card.style.backgroundColor = "#E5709B";
      hp.style.color = "#8e415d";
      break;
    case "rock":
      card.style.backgroundColor = "#B2A061";
      hp.style.color = "#7a6d3f";
      break;
    case "steel":
      card.style.backgroundColor = "#89A1B0";
      hp.style.color = "#6c818e";
      break;
    case "dragon":
      card.style.backgroundColor = "#6A7BAF";
      hp.style.color = "#47598e";
      break;
    default:
      break;
  }
}

//Display function
function displayCards(pokemonData) {
  const container = document.getElementById("container");
  container.innerHTML = "";
  pokemonData.forEach((pokemon) => {
    const card = createCard();
    const title = createTitle();
    const name = createPokemonName(pokemon);
    const hp = createPokemonHP(pokemon);
    const img = createPokemonImage(pokemon);
    const line = document.createElement("hr");
    const aboutInfo = createAboutSection();
    const aboutDescription = createAboutDescription(pokemon);

    appendToTitle(title, name, hp);
    appendToAbout(aboutInfo, aboutDescription);
    appendAllToCard(card, title, img, line, aboutInfo);
    setCardColors(pokemon, card, hp);
    container.appendChild(card);
  });
}

window.onload = fetchStarterPokemon();
fetchPokemonType();

const soundIcon = document.getElementById("soundIcon");
const soundImg = document.getElementById("soundImg");
const homeSound = document.getElementById("homeSound");
const battleSound = document.getElementById("battleSound");
// Zet het geluid eerst uit
let isSoundOn = false;

// Luister naar klik op het geluid-icoon
soundIcon.addEventListener("click", function () {
  // Als het geluid aan staat, pauzeer het geluid en verander het icoon naar 'uit'
  if (isSoundOn) {
    homeSound.pause();
    soundImg.src = "img/sound-off.png";
  } else {
    // Als het geluid uit staat, speel het geluid en verander het icoon naar 'aan'
    homeSound.play();
    soundImg.src = "img/sound-on.png";
  }
  // Zet de status om: aan wordt uit, uit wordt aan
  isSoundOn = !isSoundOn;
});

// Selecteer alle knoppen met de class "kies-btn" en sla ze op in een lijst
const kiesButtons = document.querySelectorAll(".kies-btn");
// Maak een nieuw audio-object aan voor het afspelen van geluiden bij het kiezen
const selectSound = new Audio();
// Maak een lege lijst om de gekozen Pokémon in op te slaan
let selectedPokemon = [];

kiesButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".pokemon-kaart");
    // Haal de naam van de Pokémon uit de alt-tekst van de afbeelding in die kaart
    const pokemonNaam = card.querySelector("img").alt;
    // Controleer of deze Pokémon al geselecteerd is
    const isSelected = selectedPokemon.some(
      (pokemon) => pokemon.naam === pokemonNaam
    );

    if (isSelected) {
      // Als Pokémon al geselecteerd is: verwijder hem uit de selectie
      selectedPokemon = selectedPokemon.filter(
        (pokemon) => pokemon.naam !== pokemonNaam
      );
      // Verwijder css dat de knop geselecteerd is
      button.classList.remove("geselecteerd");
    } else {
      // Als Pokémon nog niet geselecteerd is en er nog ruimte is (max 2)
      if (selectedPokemon.length < 2) {
        // Maak een nieuw Pokémon object met eigenschappen uit data-attributes van de knop
        const pokemon = {
          naam: pokemonNaam,
          sound: button.dataset.sound,
          attack: parseInt(button.dataset.attack),
          special: parseInt(button.dataset.special),
          img: button.dataset.img,
        };
        // Voeg deze Pokémon toe aan de selectie
        selectedPokemon.push(pokemon);
        // Voeg css toe dat de knop nu geselecteerd is
        button.classList.add("geselecteerd");

        // Speelt het bijbehorende geluid af
        const soundSrc = button.dataset.sound;
        if (soundSrc) {
          selectSound.src = soundSrc;
          // speelt audio opnieuw af als het 0 is
          selectSound.currentTime = 0;
          selectSound.play();
        }
      }
    }

    // Sla de selectie op
    localStorage.setItem("gekozenPokemons", JSON.stringify(selectedPokemon));

    // Toon/verberg de arena-link
    const arenaLink = document.getElementById("naarArenaLink");
    if (arenaLink) {
      if (selectedPokemon.length === 2) {
        arenaLink.style.display = "inline-block";
      } else {
        arenaLink.style.display = "none";
      }
    }
  });
});

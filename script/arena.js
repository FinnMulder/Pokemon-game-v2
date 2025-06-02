const pokemon1Container = document.getElementById("pokemon1");
const pokemon2Container = document.getElementById("pokemon2");
const battleSound = document.getElementById("battleSound");
const battleButton = document.getElementById("battleButton");
const gifContainer = document.getElementById("gifContainer");

// Haalt de lijst van gekozen Pokémon op uit de localStorage,
// zet deze om van een JSON-string naar een JavaScript-array/object,
// en slaat het resultaat op in de constante 'gekozenPokemons'.
const gekozenPokemons = JSON.parse(localStorage.getItem("gekozenPokemons"));

// Functie om Pokémon kaarten te maken
function createPokemonCard(pokemon, container, index) {
  const className = pokemon.naam.toLowerCase();

  // Bepaal het pad naar de afbeelding van de Pokémon
  const imagePath = pokemon.img
    ? `./pokemon-fight/${pokemon.img}`
    : `./pokemon-kaartjes/${className}.png`;

  // Maak de HTML-code voor een Pokémon kaartje aan
  container.innerHTML = `
    <div class="pokemon-wrapper ${className}" id="pokemon-wrapper-${index}">
      <div class="hp-bar" id="hp-${index}">
        <div class="hp-fill" id="hp-fill-${index}"></div>
      </div>
      <img src="${imagePath}" alt="${pokemon.naam}" class="pokemon-img" />
      <button class="attack-btn" data-type="attack" data-index="${index}" data-power="${pokemon.attack}">
        Attack
      </button>
      <button class="attack-btn" data-type="special" data-index="${index}" data-power="${pokemon.special}">
        Special Attack
      </button>
    </div>
  `;
}

// Maak en toon de kaart van de tweede gekozen Pokémon in de container pokemon1Container
createPokemonCard(gekozenPokemons[0], pokemon1Container, 0);
// Maak en toon de kaart van de tweede gekozen Pokémon in de container pokemon2Container
createPokemonCard(gekozenPokemons[1], pokemon2Container, 1);

// HP en aanvalsknoppen standaard verborgen tot gevecht start
document.querySelectorAll(".hp-bar, .attack-btn").forEach((element) => {
  element.style.display = "none";
});

// hp waarde is 100
let hp = [100, 100];

const coinImg = document.getElementById("coinImg");
const coinResultText = document.getElementById("coinResultText");
const flipCoinBtn = document.getElementById("flipCoinBtn");
const startGevechtBtn = document.getElementById("startGevechtBtn");

// Variabele om bij te houden wie aan de beurt is in het gevecht
// null betekent dat het gevecht nog niet is gestart
// 0 betekent dat Pokémon 1 aan de beurt is
// 1 betekent dat Pokémon 2 aan de beurt is
let activeTurn = null;

// Coinflip
flipCoinBtn.addEventListener("click", () => {
  coinResultText.textContent = "Gooi munt...";
  // Voegt een animatieklasse toe om de munt te laten draaien
  coinImg.classList.add("flip");

  setTimeout(() => {
    // Bepaal willekeurig of het kop (true) of munt (false) is
    const heads = Math.random() < 0.5;
    if (heads) {
      activeTurn = 0;
    } else {
      activeTurn = 1;
    } // Toon welke Pokémon mag beginnen (kop of munt winnaar)
    coinResultText.textContent = `${gekozenPokemons[activeTurn].naam} mag beginnen!`;

    // Toon melding wie mag beginnen
    document.getElementById(
      "turnMessage"
    ).textContent = `${gekozenPokemons[activeTurn].naam} mag beginnen!`;

    // Verberg coinflip UI
    document.getElementById("coinFlipZone").style.display = "none";

    // Toon startknop
    startGevechtBtn.classList.add("visible");
  }, 1000);
});

// Voeg een klik-event listener toe aan de startGevechtBtn knop
startGevechtBtn.addEventListener("click", () => {
  // Maak de tekst van het element met id "turnMessage" leeg
  document.getElementById("turnMessage").textContent = "";

  // Stop het battle geluid en zet het terug naar het begin
  battleSound.pause();
  battleSound.currentTime = 0;

  // Start het battle geluid af te spelen
  battleSound.play();

  // Toon HP-balken en aanvalsknoppen
  document.querySelectorAll(".hp-bar, .attack-btn").forEach((element) => {
    element.style.display = "block";
  });

  // Verberg de startknop
  startGevechtBtn.style.opacity = "0";
  startGevechtBtn.style.pointerEvents = "none";
});

document.body.addEventListener("click", (event) => {
  // Controleer of het geklikte element een aanvalsknop is
  if (event.target.classList.contains("attack-btn")) {
    const btn = event.target;
    const attacker = parseInt(btn.dataset.index); // Welke Pokémon aanvalt (0 of 1)

    // Check of het de beurt is van deze speler
    if (attacker !== activeTurn) return;

    // Bepaal wie de tegenstander is
    const defender = attacker === 0 ? 1 : 0;

    // Haal het aanvalspower getal op uit de knopdata
    let power = parseInt(btn.dataset.power);

    // Bepaal of het een normale of speciale aanval is
    const attackType = btn.dataset.type;

    // 30% kans op dubbele schade bij special attack
    if (attackType === "special") {
      const chance = Math.random(); // getal tussen 0 en 1
      if (chance < 0.3) {
        power *= 2; // Verdubbel de kracht van de aanval
        console.log("Critical hit! Special attack doet dubbele schade!");
      }
    }

    // Trek HP af
    // Gebruik Math.max om ervoor te zorgen dat de HP niet lager wordt dan 0
    hp[defender] = Math.max(hp[defender] - power, 0);

    // Update HP-balk
    const fill = document.getElementById(`hp-fill-${defender}`);
    fill.style.width = `${hp[defender]}%`;

    // Check op winnen
    if (hp[defender] === 0) {
      // Stop battle sound
      battleSound.pause();

      // Speel win-sound af
      const winSound = document.getElementById("winSound");
      winSound.play();

      // Verberg attack-knoppen
      document.querySelectorAll(".attack-btn").forEach((btn) => {
        btn.style.display = "none";
      });
      document.querySelectorAll(".hp-bar").forEach((bar) => {
        bar.style.display = "none";
      });

      // Toon winnaarbericht
      const winnerText = document.getElementById("winnerText");
      winnerText.textContent = `${gekozenPokemons[attacker].naam} heeft gewonnen!`;
      document.getElementById("winMessage").style.display = "block";
    }

    // Wissel beurt
    activeTurn = defender;
    document.getElementById(
      "turnMessage"
    ).textContent = `${gekozenPokemons[activeTurn].naam} is aan de beurt!`;
  }
});

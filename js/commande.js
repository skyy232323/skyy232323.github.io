/**
 * Fichier JavaScript pour la page index.html.
 * Contient les fonctions pour la gestion de la commande des places du cinéma.
 * Auteur : J. ALIPRANDI - CFPT-I
 * Création : 01.12.2024
 * Version : 1.1
 */


/**
  Met à jour la valeur de l'affichage du range pour le nombre de places
*/
function modifierNbPlaces(){
	nbPlacesDisplay.textContent = ~~places.value;
}

places.addEventListener("change", modifierNbPlaces);
places.addEventListener("mousemove", modifierNbPlaces);
places.addEventListener("touchmove", modifierNbPlaces);

const url =  "https://www.roulioz.net/serveur_films.php";
let films = [];
const reserveForm = document.getElementById("reservationForm");
const selectElement = document.getElementById("film");
const ongletReservation = document.getElementById("onglet1");
const ongletRecap = document.getElementById("onglet2");
const errorArea = document.getElementById("errors");

const btnRetour = document.getElementById("retour");

const username = document.getElementById("nomUtilisateur");
const placeReserve = document.getElementById("placesReservees");
const filmChoisi = document.getElementById("filmChoisi");
const imgFilm = document.getElementById("imageFilm");
const prixFinal = document.getElementById("prix");

btnRetour.addEventListener('click', () => {
  ongletReservation.style.display = "block";
  ongletRecap.style.display = "none";
});

document.addEventListener('DOMContentLoaded', async () => {
  await getFilms();
  loadSelectFilm();
});

reserveForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let formValid = true;
  const formData = new FormData(reserveForm);

  const film = formData.get("filmChoisi");
  const lunettes = formData.get("lunettes");
  const places = formData.get("places");
  const nom = formData.get("nom");

  if (film.trim() == "") {
    errorArea.innerText = "Veuillez choisir un film."
    formValid = false;
  }

  if (nom.trim() == "") {
    errorArea.innerText = "Veuillez choisir un nom pour la réservation."
    formValid = false;
  }

  if(formValid) {
    let filmChoisiObj = "";
    let prix = 15;

    films.forEach((filmObj) => {
      if (film == filmObj.nom)
        filmChoisiObj = filmObj;
    })

    if (lunettes == "oui") {
      prix = 20;
    }

    username.innerText = nom;
    placeReserve.innerText = places;
    filmChoisi.innerText = filmChoisiObj.nom;
    imgFilm.src = `img/${filmChoisiObj.image}`;
    prixFinal.innerHTML = prix * places;

    ongletReservation.style.display = "none";
    ongletRecap.style.display = "block";
  }

  console.log(film, lunettes, places, nom);
});

async function getFilms() {
  try {
    const response = await fetch(url);
    const result = await response.json();
    saveToLocalStorage(result);
    films = result;
    console.table(films);
    console.log(result);
  } catch (err) {
    console.log("Loading films from cache...");
    films = getSavedFilms();
    console.error(err);
  }
}

function saveToLocalStorage(array) {
  localStorage.setItem('films', JSON.stringify(array));
}

function getSavedFilms() {
  return JSON.parse(localStorage.getItem('films'));
}

function loadSelectFilm() {
  films.forEach((film) => {
    const option = document.createElement('option');
    option.innerText = film.nom;
    option.value = film.nom;
    selectElement.appendChild(option);
  })
}

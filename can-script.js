//premier affichage
addDonnee();

document.forms[0].categorie.addEventListener('change', ()=> addDonnee());
document.forms[0].nutri.addEventListener('change', ()=> addDonnee());
document.forms[0].searchTerm.addEventListener('change', ()=>addDonnee());
document.forms[0].searchTerm.addEventListener('keypress', ()=>addDonnee());


//sur le click
document.getElementById('btnReset').addEventListener(
  'click', function (event) {
    event.preventDefault();
    document.forms[0].reset();
    addDonnee();
  });

//recup données
function addDonnee() {
  fetch('produits.json').then(function (response) {
    if (response.ok) {
      response.json().then(function (json) {
        triage(json);//lancement asynchrone !!
      });
    } else {
      console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
    }
  });
}

document.getElementById('searchTerm').addEventListener("keyup", function(event){autocompleteMatch(event)});

function autocompleteMatch(event) {
  var input = event.target;//recuperation de l'element input
  var saisie = input.value;//recuperation de la saisie
  var min_characters = 1;// minimum de caractères de la saisie
  if (!isNaN(saisie) || saisie.length < min_characters ) { 
    return [];
  };
fetch('produits.json').then(function (response) {
  if (response.ok) {
    response.json().then(function (json) {
      traiterReponse(json, saisie);//lancement asynchrone !!
    });
  } else {
    console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
  }
});
}
function traiterReponse(data, saisie){
  var listeValeurs = document.getElementById('listeValeurs');
  listeValeurs.innerHTML = "";//mise à blanc des options
  var reg = new RegExp(saisie, "i");
  let terms = data.filter(term => term.nom.match(reg));//recup des termes qui match avec la saisie
  for (i=0; i<terms.length; i++) {//création des options
        var option = document.createElement('option');
                    option.value = terms[i].nom;
                    listeValeurs.appendChild(option);
  }
}

//triage et mélange
function triage(products) {
  var valeur = { 0: "tous", 1: "legumes", 2: "soupe", 3: "viande" }
  var type = valeur[document.forms[0].categorie.value];
  var nutri = document.forms[0].nutri.value;
  var lowerCaseSearchTerm = document.querySelector('#searchTerm').value.trim().toLowerCase();
  var finalGroup = [];
  var i, j, tmp;
  for (i = products.length - 1; i > 0; i--) { //-- Fonction mélange du tableau
      j = Math.floor(Math.random(products) * (i + 1));
      tmp = products[i];
      products[i] = products[j];
      products[j] = tmp;
    }
    products.forEach(product => { //-- Triage
      if (product.type === type || type === 'tous') {//sur la categorie
        if (product.nutriscore === nutri || nutri === '0') {//sur le nutri
          if (product.nom.toLowerCase().indexOf(lowerCaseSearchTerm) !== -1 || lowerCaseSearchTerm === '') {//sur le searchterm
            finalGroup.push(product);
          }
        }
      }
    });
    showProduct(finalGroup);
  }

//Affichage
function showProduct(finalGroup) {

  var main = document.querySelector('main');
  //vidage
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }
  // affichage produits
  if (finalGroup.length === 0) {
    var para = document.createElement('p');
    para.textContent = 'Aucun résultats';
    main.appendChild(para);
  }
  else {
    finalGroup.forEach(product => {
      var section = document.createElement('div');
      section.setAttribute('class', product.type,);
      section.classList.add("card");
      section.classList.add("text-center");
      section.classList.add("bg-dark");
      section.classList.add("border-success");
      section.classList.add("mt-2")
      var heading = document.createElement('div');
      heading.textContent = product.nom.replace(product.nom.charAt(0), product.nom.charAt(0).toUpperCase());
      heading.className = 'card-title'; 
      var foot = document.createElement('div');
      foot.className = 'card-footer text-muted'; 
      var para = document.createElement('p');
      para.textContent = product.prix.toFixed(2) +"€";
      var nutri = document.createElement('span');
      nutri.textContent = product.nutriscore;
      var image = document.createElement('img');
      image.className = 'card-img-top'; 
      image.src = "images/" + product.image;
      image.alt = product.nom;
      var panier = document.createElement('button');
      panier.setAttribute("class", "btn btn-outline-success m-3");
      panier.setAttribute("onclick", "ajouterPanier()");
      panier.innerHTML = "Ajouter au panier";
      section.appendChild(foot);
      section.appendChild(image);
      section.appendChild(heading);
      section.appendChild(para);
      section.appendChild(nutri);
      section.appendChild(panier);
      main.appendChild(section);
    });
  }
}

var nbProduits = 0
var nombre = document.getElementById('count')
function ajouterPanier(){
  nbProduits +=1
  nombre.innerText = (nbProduits);
}

function resetPanier(){
  nbProduits = 0
  nombre.innerText = (nbProduits);
}


// document.getElementById('btnReset').addEventListener(
//   'click', function (event) {
//     event.preventDefault();
//     document.forms[0].reset();
//     addDonnee();
//   });
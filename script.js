//  Nom    :    TADJINE
//  Prénom :    Said
//  Groupe :    B4

let nom = document.getElementById('nom');
let prenom = document.getElementById('prenom');
let birthdate = document.getElementById('birthdate');
const univ = document.getElementById('univ');
const birthplace = document.getElementById('birthplace');
const filiere = document.getElementById('filiere');
let form = document.querySelector('form');

/* 3 - Options de l'elem select */
const select_filliere = document.getElementById('filiere');
const filieres = [
    '--Selectionner votre filiere--',
    'Mathématiques',
    'Informatique',
    'Automatique',
    'Télécommunications',
    'Français',
    'Anglais',
];
const code = ['', 'mat', 'inf', 'aut', 'tel', 'fra', 'ang'];
function optionFiliere() {
    for (let i = 0; i < filieres.length; i++) {
        const option = document.createElement('option');
        option.value = code[i];
        option.textContent = filieres[i];
        select_filliere.appendChild(option);
    }
}
window.addEventListener('DOMContentLoaded', optionFiliere);

/* 4 - Validation de donnee */
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (nom.value.length > 24) {
        alert('Le nom ne doit pas dépasser 24 caractères.');
        return;
    }
    if (prenom.value.length > 24) {
        alert('Le prénom ne doit pas dépasser 24 caractères.');
        return;
    }
    if (!nom.value.match(/^[A-Za-zÀ-ÿ]+(-[A-Za-zÀ-ÿ]+)?$/u)) {
        alert('Le format de nom est incorrect');
        return;
    }
    if (!prenom.value.match(/^[A-Za-zÀ-ÿ]+(-[A-Za-zÀ-ÿ]+)?$/u)) {
        alert('Le format de prenom est incorrect');
        return;
    }
    const age = calcAge();
    if (age.annee < 18) {
        alert('Vous devez etre 18+');
        return;
    }

    const donnees = getUserInfo();
    const select_carte = document.getElementById('carte');
    select_carte.innerHTML = '';
    const img = document.createElement('img');
    if (univ.value === `UAMB`) {
        img.src = './assets/bejaia.png';
    } else if (univ.value === `UMMTO`) {
        img.src = './assets/tizi.png';
    }
    select_carte.appendChild(img);
    const h3 = document.createElement('h3');
    if (age.annee >= 28) {
        h3.textContent = `CARTE ENSEIGNANT`;
    } else if (age.annee >= 18 && age.annee <= 27) {
        h3.textContent = `CARTE ETUDIANT`;
    } else {
        h3.textContent = `CARTE INVALID`;
    }
    select_carte.appendChild(h3);
    const ul = document.createElement('ul');
    Object.entries(donnees).forEach(([key, value]) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${key}:</strong> ${value}`;
        ul.appendChild(li);
    });
    select_carte.appendChild(ul);
    select_carte.setAttribute('style', 'display: flex');

    const interne = interne_externe();
    if (interne === true || interne === 'externe') {
        select_carte.style.background =
            'linear-gradient(135deg, #8e00ff,#9900cc, #ff00ff )';
    } else {
        select_carte.style.background =
            'linear-gradient(135deg,  #0083b0, #0096c6,#00b4d8)';
    }

    const idDiv = document.createElement('div');
    idDiv.id = 'idPers';
    idDiv.textContent = idPerso();
    select_carte.appendChild(idDiv);
});

form.addEventListener('reset', () => {
    document.getElementById('carte').setAttribute('style', 'display: none');
});

/* 5 - Calcul de l'age au jour pres */
function calcAge() {
    const birth = new Date(birthdate.value);
    const now = new Date();
    let annee = now.getFullYear() - birth.getFullYear();
    let mois = now.getMonth() - birth.getMonth();
    let jour = now.getDate() - birth.getDate();
    if (jour < 0) {
        mois--;
        const dernier = new Date(now.getFullYear(), now.getMonth(), 0);
        jour += dernier.getDate();
    }
    if (mois < 0) {
        annee--;
        mois += 12;
    }
    return { annee, mois, jour };
}

/* 6 - Deduction de l'annee univ en cours */
function anneeUniv() {
    const date = new Date();
    if (date.getMonth() < 8) {
        return `${date.getFullYear() - 1}/${date.getFullYear()}`;
    } else {
        return `${date.getFullYear()}/${date.getFullYear() + 1}`;
    }
}

/* 7 -  */
function getFaculteParCodeFiliere(codeFiliere) {
    const relations = {
        se: {
            nom: 'Sciences Exactes',
            filieres: ['mat', 'inf']
        },
        st: {
            nom: 'Technologie',
            filieres: ['aut', 'tel']
        },
        ll: {
            nom: 'Lettres et des Langues',
            filieres: ['fra', 'ang']
        }
    };
    for (let codeFac in relations) {
        if (relations[codeFac].filieres.includes(codeFiliere)) {
            return {
                code: codeFac,
                nom: relations[codeFac].nom
            };
        }
    }

    return { code: 'unknown', nom: 'Faculté inconnue' };
}

/* 8 - Deduction de grade de l'util */
function grade() {
    const age = calcAge().annee;
    if (age >= 18 && age <= 21) {
        return `Licence`;
    } else if (age > 21 && age <= 23) {
        return `Master`;
    } else if (age > 23 && age <= 27) {
        return `Doctorant`;
    } else if (age >= 28) {
        return `Enseignant-Chercheur`;
    }
}

/* 9 - Interne ou externe */
function interne_externe() {
    const univValue = univ.value;
    const placeValue = birthplace.value;

    if (univValue === `UMMTO`) {
        if (placeValue === `bejaia`) {
            return false;
        } else if (placeValue === `tizi`) {
            return true;
        }
    } else if (univValue === `UAMB`) {
        if (placeValue === `bejaia`) {
            return 'interne';
        } else if (placeValue === `tizi`) {
            return false;
        }
    }
    return false;
}

/*Ensemble de deduction*/
function getUserInfo() {
    return {
        Nom: nom.value,
        Prenom: prenom.value,
        'Date de naissance': birthdate.value,
        'Lieu de naissance': birthplace.options[birthplace.selectedIndex].textContent,
        Filiere: filiere.options[filiere.selectedIndex].textContent,
        Faculte: getFaculteParCodeFiliere(filiere.value).nom,
        Grade: grade(),
        'Annee universitaire': anneeUniv(),
    };
}

/* 15 - Id personalise*/
function codeHex(chaine) {
    let result = "";
    for (let i = 0; i < chaine.length; i++) {
        let codeASCII = chaine.charCodeAt(i);
        let hex = codeASCII.toString(16).toUpperCase();
        result += hex;
    }
    return result;
}

function idPerso() {
    const birth = new Date(birthdate.value);
    const jj = String(birth.getDate()).padStart(2, '0');
    const mm = String(birth.getMonth() + 1).padStart(2, '0');
    const aaaa = birth.getFullYear();

    const ww = (birthplace.value === 'tizi') ? '15' : '06';
    const uu = (univ.value === 'UMMTO') ? '15' : '06';

    const fac = getFaculteParCodeFiliere(filiere.value).code.toUpperCase();

    let g = '';
    switch (grade()) {
        case 'Licence': g = 'L'; break;
        case 'Master': g = 'M'; break;
        case 'Doctorant': g = 'D'; break;
        case 'Enseignant-Chercheur': g = 'E'; break;
    }

    return `${codeHex(nom.value)}-${codeHex(prenom.value)}-${jj}/${mm}/${aaaa}-${ww}-${uu}-${filiere.value.toUpperCase()}-${fac}-${g}-${anneeUniv()}`;
}

document.getElementById('carte').addEventListener('click', () => {
    const idDiv = document.getElementById('idPers');
    if (idDiv) {
        idDiv.style.visibility = 'visible';
    }
});

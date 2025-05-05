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
        e.preventDefault();
        alert('Le nom ne doit pas dépasser 24 caractères.');
    }
    if (prenom.value.length > 24) {
        e.preventDefault();
        alert('Le prénom ne doit pas dépasser 24 caractères.');
    }
    if (!nom.value.match(/^[A-Za-zÀ-ÿ]+(-[A-Za-zÀ-ÿ]+)?$/u)) {
        e.preventDefault();
        alert('Le format de nom est incorrect');
    }
    if (!prenom.value.match(/^[A-Za-zÀ-ÿ]+(-[A-Za-zÀ-ÿ]+)?$/u)) {
        e.preventDefault();
        alert('Le format de prenom est incorrect');
    }
    const age = calcAge();
    if (age.annee < 18) {
        e.preventDefault();
        alert('Vous devez etre 18+');
    }
    // e.preventDefault();
    const donnees = getUserInfo();
    const select_carte = document.getElementById('carte');
    select_carte.innerHTML = '';
    const img = document.createElement('img');
    if (univ.value === `UAMB`) {
        img.src = './assets/bejaia.png';
    } else if (univ.value === `UMMTO`) {
        img.src = './assets/tizi.png';
    }
    const h3 = document.createElement('h3');
    if (age.annee >= 28) {
        h3.textContent = `CARTE ENSEIGNANT`;
    } else if (age.annee >= 18 && age.annee <= 27) {
        h3.textContent = `CARTE ETUDIANT`;
    } else {
        h3.textContent = `CARTE INVALID`;
    }
    const ul = document.createElement('ul');
    select_carte.appendChild(img);
    select_carte.appendChild(h3);
    Object.entries(donnees).forEach(([key, value]) => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${key}:</strong> ${
            typeof value === 'object'
                ? `${value.annee} ans, ${value.mois} mois, ${value.jour} jours`
                : value
        }`;
        ul.appendChild(li);
    });
    select_carte.appendChild(ul);
    select_carte.setAttribute('style', 'display: flex');
    if (interne_externe()) {
        select_carte.style.background =
            'linear-gradient(135deg, #8e00ff,#9900cc, #ff00ff )';
    } else if (!interne_externe()) {
        select_carte.style.background =
            'linear-gradient(135deg,  #0083b0, #0096c6,#00b4d8)';
    }
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
        mat: 'Sciences Exactes',
        inf: 'Sciences Exactes',
        aut: 'Technologie',
        tel: 'Technologie',
        fra: 'Lettres et des Langues',
        ang: 'Lettres et des Langues',
    };
    return relations[codeFiliere] || 'Faculté inconnue';
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
            return `interne`;
        } else if (placeValue === `tizi`) {
            return false;
        }
    }
}

/*Ensemble de deduction*/
function getUserInfo() {
    const userInfo = {
        Nom: nom.value,
        Prenom: prenom.value,
        'Date de naissance': birthdate.value,
        'Lieu de naissance':
            birthplace.options[birthplace.selectedIndex].textContent,
        Filiere: filiere.options[filiere.selectedIndex].textContent,
        Faculte: getFaculteParCodeFiliere(filiere.value),
        Grade: grade(),
        'Année universitaire': anneeUniv(),
    };
    return userInfo;
}

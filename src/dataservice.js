import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  doc,
  where,
} from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAi73jlLn5ilhby_Df6j-uaVrxpBB8s7cs",
  authDomain: "cooking-2aeb4.firebaseapp.com",
  projectId: "cooking-2aeb4",
  storageBucket: "cooking-2aeb4.firebasestorage.app",
  messagingSenderId: "1097679569718",
  appId: "1:1097679569718:web:fac91b710a8b5b2642e997"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const accountDB = collection(db, "account");

export default {
  //Restituisce l'oggetto utente in base alla mail passata
  login: function (mail) {
    return new Promise((resolve, reject) => {
      let utente = {}; // Crea un oggetto utente vuoto

      getDocs(query(accountDB, where("mail", "==", mail)))
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // Aggiungi i dati dell'utente all'oggetto utente
            Object.assign(utente, doc.data());
          });

          // Controlla se l'utente è stato trovato
          if (Object.keys(utente).length === 0) {
            reject("Utente non trovato");
          } else {
            resolve(utente);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  //Controlla che la mail passata non sia presente nel database
  presenza: function (mail) {
    return new Promise((resolve, reject) => {
      let presente = false;

      getDocs(query(accountDB, where("mail", "==", mail)))
        .then((querySnapshot) => {
          //Se è presente un documento in base alla query significa che l'utente è gia registrato è quindi setto la variabile presente a true
          querySnapshot.forEach((doc) => {
            presente = true;
          });
          resolve(presente);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  //Funzione che aggiunge al database il nuovo utente
  registra: function (nome, cognome, user, pass, mail) {
    return new Promise((resolve, reject) => {
      setDoc(doc(db, "account", mail), {
        nome: String(nome),
        cognome: String(cognome),
        username: String(user),
        password: String(pass),
        mail: String(mail),
      })
        .then(() => {
          resolve(); //Risolve la promessa
        })
        .catch((error) => {
          reject(error); //Rigetta la promessa in caso di errore
        });
    });
  },
  //Salva la recensione sul database e poi risolve la promise
  aggiungiRecensione: function (titolo, recensione, stelle, index, utente) {
    return new Promise((resolve, reject) => {
      setDoc(doc(db, index, utente), {
        index: index,
        utente: utente,
        recensione: recensione,
        stelle: stelle,
        titolo: titolo,
      })
        .then(() => {
          resolve(); //Risolve la promessa
        })
        .catch((error) => {
          reject(error); //Rigetta la promessa in caso di errore
        });
    });
  },
  //In base all'id del piatto riempie il vettore recensioni con le recensioni e lo restituisce
  scaricaRecensioni: function (piatto) {
    return new Promise((resolve, reject) => {
      getDocs(collection(db, piatto))
        .then(function (data) {
          let recensioni = [];
          for (let d of data.docs) {
            let recensione = d.data();
            recensioni.push(recensione);
          }
          resolve(recensioni);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  //Aggiungo preferito al database creando un nuovo documento
  aggiungiPreferito: function (mail, index, titolo, foto) {
    return new Promise((resolve, reject) => {
      setDoc(doc(db, mail, index.toString()), {
        index: String(index),
        titolo: String(titolo),
        foto: String(foto),
      })
        .then(() => {
          resolve(); //Risolve la promessa
        })
        .catch((error) => {
          reject(error); //Rigetta la promessa in caso di errore
        });
    });
  },
  //In base all'utente loggato riempie il vettore prefer con i piatti preferiti e lo restituisce
  riempiPreferiti: function (mail) {
    return new Promise(function (resolve, reject) {
      getDocs(collection(db, mail))
        .then(function (data) {
          let prefer = [];
          for (let d of data.docs) {
            let myData = d.data();
            prefer.push(myData);
          }
          resolve(prefer);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  },
  //Salva la ricetta creata
  salvaRicetta: function (
    utente,
    title,
    ingredienti,
    procedimento,
    url,
    indice
  ) {
    return new Promise((resolve, reject) => {
      setDoc(doc(db, "ricette", indice), {
        title: String(title),
        utente: String(utente),
        image: String(url),
        id: String(indice),
        ingredienti: ingredienti,
        procedimento: procedimento,
      })
        .then(() => {
          resolve(); //Risolve la promessa
        })
        .catch((error) => {
          reject(error); //Rigetta la promessa in caso di errore
        });
    });
  },
  //Riempie il vettore ricette con le ricette create presenti nel database e lo restituisce
  scaricaRicette: function () {
    return new Promise(function (resolve, reject) {
      getDocs(collection(db, "ricette"))
        .then(function (data) {
          let ricette = [];
          for (let d of data.docs) {
            let myData = d.data();
            ricette.push(myData);
          }
          resolve(ricette);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  },
  //Scarica dal database una ricetta creata dagli utenti in base all'id che viene passato
  scaricaRicetta: function (id) {
    return new Promise((resolve, reject) => {
      getDocs(query(collection(db, "ricette"), where("id", "==", id)))
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            resolve(doc.data());
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  //Serve per cancellare documenti dal database
  rimuoviDocumento: function (raccolta, documento) {
    deleteDoc(doc(db, raccolta, documento));
  },
  //Scarica tutte le mail degli utenti registrati
  scaricaAccount: function () {
    return new Promise(function (resolve, reject) {
      getDocs(collection(db, "account"))
        .then(function (data) {
          let utenti = [];
          for (let d of data.docs) {
            let myData = d.data();
            utenti.push(myData.mail);
          }
          resolve(utenti);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  },
};

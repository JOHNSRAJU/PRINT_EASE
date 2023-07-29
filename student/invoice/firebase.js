import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore, collection, getDoc,doc, where, orderBy, query, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getStorage, ref, getDownloadURL, deleteObject } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js';
const firebaseConfig = {
  apiKey: "AIzaSyBCtvK5bUFqSRGWYTVXnNLHsSdSMMfyEdQ",
  authDomain: "printease-875ad.firebaseapp.com",
  projectId: "printease-875ad",
  storageBucket: "printease-875ad.appspot.com",
  messagingSenderId: "903339769147",
  appId: "1:903339769147:web:cd509e3189d24e59ad8b1e",
  measurementId: "G-L1DX6GPNRG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage();

auth.onAuthStateChanged(async function (user) {
  if (user) {
    console.log(user.uid);
    const urlParams = new URLSearchParams(window.location.search);
    const docid = urlParams.get('docid');
    console.log(docid);

    // Retrieve data from Firestore
    const docRef = doc(db, "data", docid);
    try {
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()) {
          console.log(docSnap.data());
          document.getElementById("1").innerHTML = docSnap.data().email;
          document.getElementById("2").innerHTML = docSnap.data().FName;
          document.getElementById("3").innerHTML = "Date: "+ docSnap.data().Date;
          document.getElementById("4").innerHTML = "Time: "+ docSnap.data().time;
          document.getElementById("5").innerHTML = "Type: "+ docSnap.data().Fside;
          document.getElementById("6").innerHTML = "Color: "+ docSnap.data().FType;
          document.getElementById("7").innerHTML = "Pages: "+ docSnap.data().Fpage;
          document.getElementById("8").innerHTML = "Copies: "+ docSnap.data().Fcount;
          document.getElementById("9").innerHTML = "Price: "+ docSnap.data().Fprice;
          if(docSnap.data().Fmethod == "Offline"){
            document.getElementById("10").src = "../../images/notpaid.png"
          }else{
            document.getElementById("10").src = "../../images/paid.png"
          }
      } else {
          console.log("Document does not exist")
      }
  
  } catch(error) {
      console.log(error)
  }

    document.getElementById("logout").addEventListener("click", function (event) {
      event.preventDefault();
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          console.log('Sign-out successful.');
          alert('Sign-out successful.');
          document.getElementById('logout').style.display = 'none';
        })
        .catch((error) => {
          // An error happened.
          console.log('An error happened.');
        });
    });

  } else {
    // The user is not signed in.
    window.location.href = '../index.html';
  }
});

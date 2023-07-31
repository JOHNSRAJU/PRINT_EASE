import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore, collection, getDocs, where, orderBy, query, deleteDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
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
    document.getElementById("search").addEventListener("click",function(event){
      var searchQuery = document.getElementById("searchInput").value.toLowerCase();
      //write function for search from this card
      var tableRows = document.getElementById("card-container").getElementsByTagName("div");
      for (var i = 0; i < tableRows.length; i++) {
        var rowData = tableRows[i].textContent.toLowerCase();
        if (rowData.includes(searchQuery)) {
          tableRows[i].style.display = "";
        } else {
          tableRows[i].style.display = "none";
        }
      }
    });
    const collectionRefName = collection(db, 'user');
    const q = query(collectionRefName, where('UserId', '==', user.uid));
    const querySnapshotName = await getDocs(q);
    
    if (!querySnapshotName.empty) {
      querySnapshotName.forEach((docSnapshot) => {
        var userData = docSnapshot.data();
        document.getElementById("na").textContent = userData.Name;
      });
    } else {
      console.log("User not found");
    }
    
    // Retrieve data from Firestore
    const collectionRef = collection(db, 'data');
    const querySnapshot = await getDocs(query(collectionRef, where('uid', '==', user.uid), orderBy('timestamp', "desc")));

    // Get the container element where the cards will be displayed
    const cardContainer = document.getElementById('card-container');

    // Loop through the query snapshot and generate the HTML cards
    querySnapshot.forEach(async (doc) => {
      // Get the data from the document
      const data = doc.data();

      // Create the card element
      const card = document.createElement('div');
      card.className = 'container';

      // Create the box element
      const box = document.createElement('div');
      box.className = 'box';

      // Create the card content
      const cardContent = document.createElement('div');
      cardContent.className = 'card-content';

      // Get the reference to the file in Firebase Storage
      const storageRef = ref(storage, data.File);

      // Get the download URL for the file
      const downloadURL = await getDownloadURL(storageRef);

      // Create the delete button element
      const deleteButton = document.createElement('button');
      deleteButton.className = 'del';
      deleteButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
          <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" id="delete"></path>
        </svg>
      `;

      // Add the click event listener to the delete button
      deleteButton.addEventListener('click', async () => {
        let result = window.confirm("Are you sure to delete your order?");
        if (result === true) {
          try {
            if (data.Fstatus === 'Pending') {
              // Delete the document from Firestore
              await deleteDoc(doc.ref);
              // Delete the corresponding file from Firebase Storage
              //await deleteObject(storageRef);
              // Remove the card from the UI
              card.remove();
              console.log('Document and file deleted successfully.');
            } else {
              console.log('File cannot be deleted. Status is not pending.');
            }
          } catch (error) {
            console.error('Error deleting document and file:', error);
          }
        }
      });

      // Populate the card content with the retrieved data and download URL
      cardContent.innerHTML = `
        <object data="${downloadURL}" type="application/pdf"></object>
        <strong>${data.FName}</strong>
        <span>Price: Rs ${Math.ceil(data.Fprice)}</span><br>
        <span>Date: ${data.Date}</span><br>
        <span>Status: ${data.Fstatus}</span><br>
        <a href="./invoice/index.html?docid=${doc.ref.id}"><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-receipt" viewBox="0 0 16 16">
        <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z"/>
        <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z"/>
      </svg></a>
      `;
      if (data.Fstatus === 'Pending') {
        // Append the delete button to the card content
        cardContent.appendChild(deleteButton);
      }
      // Append the card content to the box
      box.appendChild(cardContent);

      // Append the box to the card
      card.appendChild(box);

      // Append the card to the card container
      cardContainer.appendChild(card);
    });

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

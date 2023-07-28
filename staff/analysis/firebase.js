
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { getFirestore, collection, doc, getDocs, updateDoc, query, orderBy, where } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
import { getStorage, ref, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js';

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
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();
const storage = getStorage(app);
var totalPrices = 0;
var totalCopy = 0;

var totalCompleted = 0;
var totalPricesCompleted = 0;
var totalPending = 0;
var totalPricesPending = 0;
var totalProcessing = 0;
var totalPricesProcessing = 0;

var online = 0;
var onlinePrice = 0;
var offline = 0;
var offlinePrice = 0;

var single = 0;
var singlePrice = 0;
var double = 0;
var doublePrice = 0;
var page = 0;
var paper = 0;

var black = 0;
var blackPrice = 0;
var color = 0;
var colorPrice = 0;


auth.onAuthStateChanged(async function (user) {
  if (user) {
    if (user.uid == "5w3QtqWjjSOazqmwX7teQEEPB6k2") {
      const currentDate = new Date()
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(currentDate.getDate()).padStart(2, '0');
      const date = `${year}-${month}-${day}`;

      // Set the value of the date input field to the current date
      document.getElementById('date').value = date;
      // Function to handle the query when the date input value changes
      const handleQuery = async function () {
        totalPrices = 0;
        totalCopy = 0;

        totalCompleted = 0;
        totalPricesCompleted = 0;
        totalPending = 0;
        totalPricesPending = 0;
        totalProcessing = 0;
        totalPricesProcessing = 0;

        online = 0;
        onlinePrice = 0;
        offline = 0;
        offlinePrice = 0;

        single = 0;
        singlePrice = 0;
        double = 0;
        doublePrice = 0;
        page = 0;
        paper = 0;

        black = 0;
        blackPrice = 0;
        color = 0;
        colorPrice = 0;


        const selectedDate = document.getElementById('date').value;
        console.log(selectedDate);

        const dataCollectionRef = collection(db, "data");
        let querySnapshot;
        querySnapshot = await getDocs(query(
          dataCollectionRef,
          orderBy("timestamp", "desc"),
          where('Date', '==', selectedDate)
        ));

        let count = 1;
        for (const doc of querySnapshot.docs) {
          totalPrices += parseFloat(doc.data().Fprice);
          totalCopy++;

          if (doc.data().Fstatus == "Done") {
            totalCompleted++;
            totalPricesCompleted += parseFloat(doc.data().Fprice);
          } else if (doc.data().Fstatus == "Pending") {
            totalPending++;
            totalPricesPending += parseFloat(doc.data().Fprice);
          } else if (doc.data().Fstatus == "Processing") {
            totalProcessing++;
            totalPricesProcessing += parseFloat(doc.data().Fprice);
          }

          if (doc.data().Fmethod == "Online") {
            online++;
            onlinePrice += doc.data().Fprice;
          } else if (doc.data().Fmethod == "Offline") {
            offline++;
            offlinePrice += doc.data().Fprice;
          }
          else {
            console.log("Error");
          }

          if (doc.data().Fside == "Single") {
            single++;
            page += doc.data().Fpage;
            paper += doc.data().Fpage;
            singlePrice += doc.data().Fprice;
          } else if (doc.data().Fside == "Double") {
            double++;
            page += doc.data().Fpage;
            paper += Math.ceil(((doc.data().Fpage) / 2));
            doublePrice += doc.data().Fprice;
            paper += 2;
          } else {
            console.log("Error");
          }

          if (doc.data().FType == "B & W") {
            black++;
            blackPrice += doc.data().Fprice;
          } else if (doc.data().FType == "Color") {
            color++;
            colorPrice += doc.data().Fprice;

          }

        }
        document.getElementById("t1").textContent = totalCopy;
        document.getElementById("t2").textContent = totalPrices + " Rs";
        document.getElementById("n1").textContent = totalCompleted;
        document.getElementById("p1").textContent = totalPricesCompleted + " Rs";
        document.getElementById("n2").textContent = totalPending;
        document.getElementById("p2").textContent = totalPricesPending + " Rs";
        document.getElementById("n3").textContent = totalProcessing;
        document.getElementById("p3").textContent = totalPricesProcessing + " Rs";

        document.getElementById("m1").textContent = online;
        document.getElementById("m2").textContent = onlinePrice + " Rs";
        document.getElementById("m3").textContent = offline;
        document.getElementById("m4").textContent = offlinePrice + " Rs";

        document.getElementById("s1").textContent = single;
        document.getElementById("s2").textContent = singlePrice + " Rs";
        document.getElementById("s3").textContent = double;
        document.getElementById("s4").textContent = doublePrice + " Rs";
        document.getElementById("t3").textContent = page;
        document.getElementById("t4").textContent = paper;

        document.getElementById("b1").textContent = black;
        document.getElementById("b2").textContent = blackPrice + " Rs";
        document.getElementById("b3").textContent = color;
        document.getElementById("b4").textContent = colorPrice + " Rs";

      };


      // Add event listener to the date input field
      document.getElementById("date").addEventListener("input", handleQuery);

      // Call the handleQuery function initially to perform the query with the initial date value
      handleQuery();

      document.getElementById("logout").addEventListener("click", function (event) {
        event.preventDefault();
        signOut(auth).then(() => {
          // Sign-out successful.
          console.log('Sign-out successful.');
          alert('Sign-out successful.');

        }).catch((error) => {
          // An error happened.
          console.log('An error happened.');
        });
      });
      document.getElementById("downloadButton").addEventListener("click", function (event) {
        // Handle download event
        const cardContainer = document.querySelector('.full');
        html2canvas(cardContainer).then(function (canvas) {
          const link = document.createElement('a');
          link.download = 'PRINTEASE_REPORT '+date+'';
          link.href = canvas.toDataURL('image/png');
          link.click();
        });
      });

    } else {
      window.location.href = "../index.html";
    }
  } else {
    window.location.href = "../index.html";
  }
});

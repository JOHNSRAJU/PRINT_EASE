import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js'
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js'
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js'
import { getFirestore, addDoc, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js'
import { getStorage, ref, uploadBytes } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-storage.js'
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


auth.onAuthStateChanged(function (user) {
  if (user) {
    const radio1 = document.querySelector('.radio1');
    const radio2 = document.querySelector('.radio2');
    const radio3 = document.querySelector('.radio3');
    const paymentMethod = document.querySelector('.wrapper');
    var type = 'B & W';
    var mode = 'Potrait';
    var side = 'Single';
    var method = 'Online'
    // Add event listener to the container
    radio1.addEventListener('change', function (event) {
      // Get the selected radio button value
      const selectedValue = event.target.value;
      //console.log(selectedValue);
      type = selectedValue;
    });
    radio2.addEventListener('change', function (event) {
      // Get the selected radio button value
      const selectedValue = event.target.value;
      //console.log(selectedValue);
      mode = selectedValue;
    });
    radio3.addEventListener('change', function (event) {
      // Get the selected radio button value
      const selectedValue = event.target.value;
      //console.log(selectedValue);
      side = selectedValue;
    });

    const plus = document.querySelector(".plus"),
      minus = document.querySelector(".minus"),
      num = document.querySelector(".num");
    let count = 1;
    plus.addEventListener("click", () => {
      count++;
      count = (count < 10) ? "0" + count : count;
      num.innerText = count;
      //console.log(a);
    });
    minus.addEventListener("click", () => {
      if (count > 1) {
        count--;
        count = (count < 10) ? "0" + count : count;
        num.innerText = count;
      }
    });

    paymentMethod.addEventListener('change', function (event) {
      // Get the selected radio button value
      const selectedValue = event.target.value;
      //console.log(selectedValue);
      method = selectedValue;
    });

    let mediaRecorder;
    let chunks = [];
    let stream;
    let audioPlayer = document.getElementById("audio-player");
    let audioUrl = ''

    document.getElementById("start").addEventListener('click', function (event) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function (streamData) {
          stream = streamData;
          mediaRecorder = new MediaRecorder(stream);
          mediaRecorder.addEventListener('dataavailable', function (event) {
            chunks.push(event.data);
          });
          mediaRecorder.start();
          console.log('Recording started');
          document.getElementById("stop").style.display="block";
          document.getElementById("start").style.display="none";
          document.getElementById("text").textContent="Recording : ";
        })
        .catch(function (error) {
          console.error('Error accessing microphone : ', error);
        });
    });
    document.getElementById("stop").addEventListener('click', function (event) {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.addEventListener('stop', function () {
          const audioBlob = new Blob(chunks, { type: 'audio/webm' });
          audioUrl = URL.createObjectURL(audioBlob);
          console.log(audioPlayer)
          audioPlayer.src = audioUrl;
          //audioPlayer.play(); // Uncomment this line to play the recorded audio automatically
          console.log('Recording stopped');
          document.getElementById("start").style.display="block";
          console.log('Audio URL:', audioUrl);
          document.getElementById("audio-player").style.display = "block";
          document.getElementById("stop").style.display="none";
          document.getElementById("text").textContent="To Change recording : ";
          // Do something with the recorded audio data (e.g., upload to Firebase)
        });
      }
    });

    let fileName;
    let fileInput;
    var pageCount;

    document.getElementById("file-upload").addEventListener('change', function (event) {
      fileInput = document.getElementById('file-upload');
      const labelUpload = document.getElementById('label-upload');
      if (fileInput.files.length > 0) {
        labelUpload.textContent = fileInput.files[0].name;
      } else {
        labelUpload.textContent = '';
      }
      fileName = fileInput.files[0].name;
    });

    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min.js';
    script.onload = function () {
      document.getElementById("file-upload").addEventListener('change', function (event) {
        const fileInput = document.getElementById('file-upload');

        // Check if a file is selected
        if (fileInput.files.length === 0) {
          console.log('No file selected.');
          return;
        }

        const file = fileInput.files[0];

        // Read the file
        const reader = new FileReader();
        reader.onload = function (e) {
          const fileData = new Uint8Array(e.target.result);

          // Load the PDF document
          pdfjsLib.getDocument(fileData).promise.then(function (pdf) {
            // Get the number of pages
            pageCount = pdf.numPages;
            //console.log('Number of pages:', pageCount);
          }).catch(function (error) {
            console.error('Error loading PDF:', error);
          });
        };
        reader.readAsArrayBuffer(file);
      });
    }
    document.head.appendChild(script);

    var price;
    function caluculatePrice() {
      if (pageCount > 0) {
        if (type == 'B & W') {
          if (side == 'Single') {
            price = pageCount * 1;
          } else {
            price = pageCount * 0.75;
          }
        } else {
          if (side == 'Single') {
            price = pageCount * 5;
          } else {
            price = pageCount * 2;
          }
        }
        price *= count;
      }
    }

    const currentDate = new Date();
    let date;
    function uDate() {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(currentDate.getDate()).padStart(2, '0');

      // Format the date
      date = `${day}-${month}-${year}`;

      console.log("Current date:", date);
    }


    document.getElementById("submit").addEventListener("click", async function (event) {
      event.preventDefault(); // Prevent form submission
      caluculatePrice();
      uDate();
      let status = "Pending";
      console(status);
      console.log(type);
      console.log(mode);
      console.log(side);
      console.log(count);
      console.log(method);
      console.log(audioUrl);
      console.log(fileName);
      console.log(pageCount);
      console.log(price);
      event.preventDefault();
      try {
        const collectionRef = collection(db, "data");
        // Upload PDF file
        const fileInput = document.getElementById('file-upload');
        const pdfFile = fileInput.files[0];
        const pdfRef = ref(storage, 'pdfs/' + pdfFile.name);
        await uploadBytes(pdfRef, pdfFile);

        // Upload audio file
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioRef = ref(storage, 'audios/' + fileName + '.webm');
        await uploadBytes(audioRef, audioBlob);

        // Add document to Firestore
        const docRef = await addDoc(collectionRef, {
          FName: fileName,
          uid: user.uid,
          File: pdfRef.fullPath,
          Fpage: pageCount,
          FType: type,
          Fmode: mode,
          Fside: side,
          Fcount: count,
          Fmethod: method,
          Faudio: audioRef.fullPath,
          Fprice: price,
          Date: date,
          Fstatus: status
        });
        console.log("Document written with ID: ", docRef.id);
        alert("Order has Placed");
        window.location.href = "../index.html";
      } catch (error) {
        console.error(error);
        alert("Error ordering");
      }
    });

  } else {
    // The user is not signed in.
    window.location.href = "../../login.html";
  }
});




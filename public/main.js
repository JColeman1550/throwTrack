const pitchCountDisplay = document.querySelector("#pitch-count");
const ballBtn = document.querySelectorAll(".ball-button");
const ballCountDisplay = document.querySelector("#ball-count");
const strikeBtn = document.querySelectorAll(".strike-button");
const strikeCountDisplay = document.querySelector("#strike-count");


// INITIALIZE COUNTS
let pitchCount = 0;
let ballCount = 0;
let strikeCount = 0;

////////////////////////////////PITCH COUNTER/////////////////////////////////////////////////////////////////////
// selecting counter buttons
const counterButtons = document.querySelectorAll(".counter-button");

// adding event listeners to buttons
counterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    if (this.textContent === "+") {
      pitchCount += 1; // increment pitch count by 1
      console.log("add clicked: Pitch count:", pitchCount);
    } else if (this.textContent === "-" && pitchCount > 0) {
      pitchCount -= 1; // decrement pitch count by 1, cant go past 0
      console.log("minus clicked: Pitch count:", pitchCount);
    }
    pitchCountDisplay.textContent = pitchCount; // updates display
  });
});

///////////////////////////////////////BALL COUNTER/////////////////////////////////////////////////////////////////////////////

// event listeners
ballBtn.forEach((button) => {
  button.addEventListener("click", function () {
    if (this.textContent === "Ball") {
      ballCount += 1; // + increment
      ballCountDisplay.textContent = ballCount; // update display
      console.log("ball clicked: Ball count:", ballCount);
    }
  });
});

////////////////////////////////////////STRIKE COUNTER////////////////////////////////////////////////////////////////////////////


strikeBtn.forEach((button) => {
  button.addEventListener("click", function () {
    if (this.textContent === "Strike") {
      strikeCount += 1;
      strikeCountDisplay.textContent = strikeCount;
      console.log("strike clicked: Strike count:", strikeCount);
    }
  });
});

///////////////////////////////////STRIKEZONE///////////////////////////////////////////////////////////////////////
// handles clicks in boxes
const strikezoneBoxes = document.querySelectorAll(".strikezone-box");
strikezoneBoxes.forEach((box) => {
  box.addEventListener("click", function () {
    // increment pitch count in zone
    let currentPitches = parseInt(this.textContent.split(": ")[1]) || 0;
    this.textContent = `${this.id}: ${currentPitches + 1}`;

    // updates display with h3 span from tracker.ejs
    const zoneClickedDisplay = document.querySelector("h3 span");
    zoneClickedDisplay.textContent = this.id; // updates zone number

    console.log("zone clicked. Zone:", this.id, "Current pitches:", currentPitches + 1);
  });
});

/////////////////////////////////END SESSION////////////////////////////////////////////////////////////////////


const endSessionButtons = document.querySelectorAll(".end-session-button");

endSessionButtons.forEach((button) => {
  button.addEventListener("click", function () {
    // collecting data to send in POST request
    const strikezoneData = {};
    const strikezoneBoxes = document.querySelectorAll(".strikezone-box");
    const sessionName = document.querySelector("#session-name").value;

    strikezoneBoxes.forEach((box) => {
      const zoneNumber = box.id; // gets zone number from box's id
      const count = box.textContent.split(": ")[1]; // extracts count value
      strikezoneData[zoneNumber] = parseInt(count, 10); // stores obj in key value pair
    });

    const sessionData = {
      sessionName,
      pitchCount,
      ballCount,
      strikeCount,
      strikezoneData,
      sessionEndedAt: new Date().toISOString(), // gives timestamp for when the session ended
    };

////////////////////////////////////////POST REQUEST////////////////////////////////////////////////////////////
    fetch("/pastsession", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sessionData), // Convert data to JSON string
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to save session data.");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Session data saved successfully:", data);
      })
      .catch((error) => {
        console.error("Error saving session data:", error);
      });

/////////////////////////// RESET STRIKEZONE VALUES TO INITIAL COUNT////////////////////////////////////////////////////
    strikezoneBoxes.forEach((box) => {
      const zoneNumber = box.id; // 
      box.textContent = `${zoneNumber}: 0`; 
      box.setAttribute("aria-label", `Zone ${zoneNumber}: 0`); 
    });

    // resets these counters
    pitchCount = 0;
    ballCount = 0;
    strikeCount = 0;

    // updates displays
    pitchCountDisplay.textContent = pitchCount;
    ballCountDisplay.textContent = ballCount;
    strikeCountDisplay.textContent = strikeCount;

    // resets zone display
    const zoneClickedDisplay = document.querySelector("h3 span");
    zoneClickedDisplay.textContent = ""; // clears displayed zone

    console.log("Session ended. All counters reset.");
  });
});



///////////////////////////////////////EDIT SESSION BUTTON/////////////////////////////////////////////////////////////////////////////

// // Add event listeners to the buttons
// const editBtn = document.querySelectorAll(".edit-session-button");
// editBtn.forEach((button) => {
//   button.addEventListener("click", function () {
//     // Check which button was clicked and update the corresponding count
//     if (this.textContent === "Ball") {
//       ballCount += 1; // Increment ball count
//       ballCountDisplay.textContent = ballCount; // Update the ball count display
//       console.log("Ball clicked: Ball count:", ballCount);
//     } else if (this.textContent === "Strike") {
//       strikeCount += 1; // Increment strike count
//       strikeCountDisplay.textContent = strikeCount; // Update the strike count display
//       console.log("Strike clicked: Strike count:", strikeCount);
//     } else if (this.textContent === "Pitch") {
//       pitchCount += 1; // Increment pitch count
//       pitchCountDisplay.textContent = pitchCount; // Update the pitch count display
//       console.log("Pitch clicked: Pitch count:", pitchCount);
//     }
//   });
// });

///////////////////////////////////////ADD SESSION BUTTON/////////////////////////////////////////////////////////////////////////////

// // Select the Add Session Button and Modal
// const addSessionButton = document.querySelector(".add-session-button");
// const modal = document.getElementById("add-session-modal");
// const closeModalButton = document.getElementById("close-modal");
// const addSessionForm = document.getElementById("add-session-form");

// // Open modal when Add Session button is clicked
// addSessionButton?.addEventListener("click", () => {
//   modal.style.display = "block";
// });

// // Close modal when Close button is clicked
// closeModalButton?.addEventListener("click", () => {
//   modal.style.display = "none";
// });

// // Handle form submission to add a session
// addSessionForm?.addEventListener("submit", (event) => {
//   event.preventDefault();

//   // Get the form data
//   const sessionName = document.getElementById("session-name").value;
//   const sessionDate = document.getElementById("session-date").value;
//   const pitchCount = document.getElementById("pitch-count").value || 0;
//   const strikeCount = document.getElementById("strike-count").value;
//   const ballCount = document.getElementById("ball-count").value;

//   // Log the session data 
//   console.log("New Session Added:", {
//     sessionName,
//     sessionDate,
//     pitchCount,
//     strikeCount,
//     ballCount,
//   });

//   // Send data to the server (POST request)
//   fetch('throws', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       sessionName,
//       sessionDate,
//       pitchCount,
//       strikeCount,
//       ballCount
//     }),
//   })
//     .then(response => response.json())
//     .then(data => {
//       console.log('Session added to database:', data);
//     })
//     .catch(error => {
//       console.error('Error adding session:', error);
//     });

//   // Clear the form after submission
//   addSessionForm.reset();

//   // Close the modal after submission
//   modal.style.display = "none";

//   // Display a success message or update the UI with the new session
//   alert("Session added successfully!");
// });

//////////////////////////////////////////ARRAY TO STORE SINGLE PITCH DATA///////////////////////////////////////////////////////////////////////////////////

const sessionPitches = []; // sets array to hold session data
let selectedZone = null; // var to store selected zone


document.querySelectorAll('.strikezone-box').forEach((box) => {
  box.addEventListener('click', (event) => {
    selectedZone = event.target.id; // Capture the id of the clicked zone
    console.log(`Selected Zone: ${selectedZone}`);
  });
});

document.querySelectorAll('.strike-button').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (selectedZone) {
      addPitch('strike', selectedZone); // adds pitch of selected zone
    } else {
      console.log('Please select a zone first!');
    }
  });
});

document.querySelectorAll('.ball-button').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (selectedZone) {
      addPitch('ball', selectedZone); 
    } else {
      console.log('Please select a zone first!');
    }
  });
});

// func to add a pitch to the sessionPitches array
function addPitch(strikeOrBall, zone) {
  const sessionName = document.getElementById("session-name").value || "Unnamed Session";
  const pitch = {
    sessionName: sessionName,
    strikeOrBall: strikeOrBall,
    zone: zone,
    timestamp: new Date() 
  };
  sessionPitches.push(pitch);
  console.log(sessionPitches);
}


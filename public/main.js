// Select the pitch count display
const pitchCountDisplay = document.querySelector("#pitch-count");
const ballBtn = document.querySelectorAll(".ball-button");
const ballCountDisplay = document.querySelector("#ball-count");
const strikeBtn = document.querySelectorAll(".strike-button");
const strikeCountDisplay = document.querySelector("#strike-count");


// Initialize counts
let pitchCount = 0;
let ballCount = 0;
let strikeCount = 0;

////////////////////////////////PITCH COUNTER/////////////////////////////////////////////////////////////////////
// Select the counter buttons
const counterButtons = document.querySelectorAll(".counter-button");

// Add event listeners to the buttons
counterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    if (this.textContent === "+") {
      pitchCount += 1; // Increment
      console.log("add clicked: Pitch count:", pitchCount);
    } else if (this.textContent === "-" && pitchCount > 0) {
      pitchCount -= 1; // Decrement, with minimum of 0
      console.log("minus clicked: Pitch count:", pitchCount);
    }
    pitchCountDisplay.textContent = pitchCount; // Update the display
  });
});

///////////////////////////////////////BALL COUNTER/////////////////////////////////////////////////////////////////////////////

// Add event listeners to the buttons
ballBtn.forEach((button) => {
  button.addEventListener("click", function () {
    if (this.textContent === "Ball") {
      ballCount += 1; // Increment
      ballCountDisplay.textContent = ballCount; // Update the display
      console.log("ball clicked: Ball count:", ballCount);
    }
  });
});

////////////////////////////////////////STRIKE COUNTER////////////////////////////////////////////////////////////////////////////

// Add event listeners to the buttons
strikeBtn.forEach((button) => {
  button.addEventListener("click", function () {
    if (this.textContent === "Strike") {
      strikeCount += 1; // Increment
      strikeCountDisplay.textContent = strikeCount; // Update the display
      console.log("strike clicked: Strike count:", strikeCount);
    }
  });
});

///////////////////////////////////STRIKEZONE///////////////////////////////////////////////////////////////////////
// Handle strike zone clicks
const strikezoneBoxes = document.querySelectorAll(".strikezone-box");
strikezoneBoxes.forEach((box) => {
  box.addEventListener("click", function () {
    // Increment the pitch count for this zone
    let currentPitches = parseInt(this.textContent.split(": ")[1]) || 0;
    this.textContent = `${this.id}: ${currentPitches + 1}`;
    
    // Update the display for the clicked zone
    const zoneClickedDisplay = document.querySelector("h3 span");
    zoneClickedDisplay.textContent = this.id; // Update the zone number in the span

    console.log("zone clicked. Zone:", this.id, "Current pitches:", currentPitches + 1);
  });
});

/////////////////////////////////END SESSION////////////////////////////////////////////////////////////////////


// Handle End Session/Inning
const endSessionButtons = document.querySelectorAll(".end-session-button");

endSessionButtons.forEach((button) => {
  button.addEventListener("click", function () {
    // Collect data to send in the POST request
    const strikezoneData = {};
    const strikezoneBoxes = document.querySelectorAll(".strikezone-box");
    const sessionName = document.querySelector("#session-name").value;

    strikezoneBoxes.forEach((box) => {
      const zoneNumber = box.id; // Get the zone number from the box's id
      const count = box.textContent.split(": ")[1]; // Extract the count value
      strikezoneData[zoneNumber] = parseInt(count, 10); // Store in the object as a key-value pair
    });

    const sessionData = {
      sessionName,
      pitchCount,
      ballCount,
      strikeCount,
      strikezoneData,
      sessionEndedAt: new Date().toISOString(), // Timestamp for session ending
    };

    // Make the POST request
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

    // Reset all strike zone boxes to initial state
    strikezoneBoxes.forEach((box) => {
      const zoneNumber = box.id; // Get the zone number from the box's id
      box.textContent = `${zoneNumber}: 0`; // Reset the text content
      box.setAttribute("aria-label", `Zone ${zoneNumber}: 0`); // Update the aria-label for accessibility
    });

    // Reset the pitch, ball, and strike counters
    pitchCount = 0;
    ballCount = 0;
    strikeCount = 0;

    // Update the displays
    pitchCountDisplay.textContent = pitchCount;
    ballCountDisplay.textContent = ballCount;
    strikeCountDisplay.textContent = strikeCount;

    // Reset the zone clicked display
    const zoneClickedDisplay = document.querySelector("h3 span");
    zoneClickedDisplay.textContent = ""; // Clear the displayed zone

    console.log("Session ended. All counters reset.");
  });
});



///////////////////////////////////////EDIT SESSION BUTTON/////////////////////////////////////////////////////////////////////////////

// Add event listeners to the buttons
const editBtn = document.querySelectorAll(".edit-session-button");
editBtn.forEach((button) => {
  button.addEventListener("click", function () {
    // Check which button was clicked and update the corresponding count
    if (this.textContent === "Ball") {
      ballCount += 1; // Increment ball count
      ballCountDisplay.textContent = ballCount; // Update the ball count display
      console.log("Ball clicked: Ball count:", ballCount);
    } else if (this.textContent === "Strike") {
      strikeCount += 1; // Increment strike count
      strikeCountDisplay.textContent = strikeCount; // Update the strike count display
      console.log("Strike clicked: Strike count:", strikeCount);
    } else if (this.textContent === "Pitch") {
      pitchCount += 1; // Increment pitch count
      pitchCountDisplay.textContent = pitchCount; // Update the pitch count display
      console.log("Pitch clicked: Pitch count:", pitchCount);
    }
  });
});

///////////////////////////////////////ADD SESSION BUTTON/////////////////////////////////////////////////////////////////////////////

// Select the Add Session Button and Modal
const addSessionButton = document.querySelector(".add-session-button");
const modal = document.getElementById("add-session-modal");
const closeModalButton = document.getElementById("close-modal");
const addSessionForm = document.getElementById("add-session-form");

// Open modal when Add Session button is clicked
addSessionButton?.addEventListener("click", () => {
  modal.style.display = "block";
});

// Close modal when Close button is clicked
closeModalButton?.addEventListener("click", () => {
  modal.style.display = "none";
});

// Handle form submission to add a session
addSessionForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get the form data
  const sessionName = document.getElementById("session-name").value;
  const sessionDate = document.getElementById("session-date").value;
  const pitchCount = document.getElementById("pitch-count").value || 0 ;
  const strikeCount = document.getElementById("strike-count").value;
  const ballCount = document.getElementById("ball-count").value;

  // Log the session data 
  console.log("New Session Added:", {
    sessionName,
    sessionDate,
    pitchCount,
    strikeCount,
    ballCount,
  });

  // Send data to the server (POST request)
  fetch('throws', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionName,
      sessionDate,
      pitchCount,
      strikeCount,
      ballCount
    }),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Session added to database:', data);
    })
    .catch(error => {
      console.error('Error adding session:', error);
    });

  // Clear the form after submission
  addSessionForm.reset();

  // Close the modal after submission
  modal.style.display = "none";

  // Display a success message or update the UI with the new session
  alert("Session added successfully!");
});

//////////////////////////////////////////ARRAY TO STORE SINGLE PITCH DATA///////////////////////////////////////////////////////////////////////////////////

const sessionPitches = []; // Array to hold the session's pitch data
let selectedZone = null; // Variable to store the selected zone

// Add event listeners to the strikezone boxes
document.querySelectorAll('.strikezone-box').forEach((box) => {
  box.addEventListener('click', (event) => {
    selectedZone = event.target.id; // Capture the id of the clicked zone
    console.log(`Selected Zone: ${selectedZone}`);
  });
});

// Add event listeners for the strike/ball buttons
document.querySelectorAll('.strike-button').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (selectedZone) {
      addPitch('strike', selectedZone); // Add pitch with selected zone
    } else {
      console.log('Please select a zone first!');
    }
  });
});

document.querySelectorAll('.ball-button').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (selectedZone) {
      addPitch('ball', selectedZone); // Add pitch with selected zone
    } else {
      console.log('Please select a zone first!');
    }
  });
});

// Function to add a pitch to the sessionPitches array
function addPitch(strikeOrBall, zone) {
  const sessionName = document.getElementById("session-name").value || "Unnamed Session";
  const pitch = {
    sessionName: sessionName,
    strikeOrBall: strikeOrBall,
    zone: zone,
    timestamp: new Date() // timestamp for each pitch
  };
  sessionPitches.push(pitch);
  console.log(sessionPitches); 
}
//////////////////////////////////////////////////////////////////////////////////////////////

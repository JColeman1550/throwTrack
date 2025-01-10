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
console.log("main.js");
var trash = document.querySelectorAll(".fa-trash-o");

//////////////////////////////////////DELETE SESSION////////////////////////////////////////////////////////////////
(trash).forEach((element) =>  {
  console.log("trash listener")
  element.addEventListener('click', () => {
 
     const id= element.getAttribute('data-id')
    console.log(id);

    // Send DELETE request to the server
    fetch('/pastsession', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id
      })
    })
    .then(response => {
      if (response.ok) {
        window.location.reload(); // Reload the page to reflect the deletion
      } else {
        console.error('Failed to delete the message');
      }
    })
    .catch(error => console.error('Error:', error));
  });
});

///////////////////////////////////////EDIT SESSION BUTTON/////////////////////////////////////////////////////////////////////////////

// Add event listeners to the buttons
var editButtons = document.querySelectorAll(".fa-edit");

(editButtons).forEach((element) => {
  element.addEventListener('click', () => {
    const id = element.getAttribute('data-id');
    const sessionName = element.getAttribute('data-sessionName');
    const pitchCount = element.getAttribute('data-pitchCount');
    const ballCount = element.getAttribute('data-ballCount');
    const strikeCount = element.getAttribute('data-strikeCount');

    // Open a modal with the session data
    openEditModal(id, sessionName, pitchCount, ballCount, strikeCount);
  });
});

function openEditModal(id, sessionName, pitchCount, ballCount, strikeCount) {
  // Get modal elements
  var modal = document.getElementById('editModal');
  var span = document.getElementsByClassName('close')[0];

  // Populate modal with session data
  document.getElementById('editSessionId').value = id;
  document.getElementById('editSessionName').value = sessionName;
  document.getElementById('editPitchCount').value = pitchCount;
  document.getElementById('editBallCount').value = ballCount;
  document.getElementById('editStrikeCount').value = strikeCount;

  // Show the modal
  modal.style.display = 'block';

  // Close the modal when the user clicks on <span> (x)
  span.onclick = function() {
    modal.style.display = 'none';
  }

  // Close the modal when the user clicks anywhere outside of the modal
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  }
}

// Handle form submission for editing session
document.getElementById('editForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const id = document.getElementById('editSessionId').value;
  const sessionName = document.getElementById('editSessionName').value;
  const pitchCount = document.getElementById('editPitchCount').value;
  const ballCount = document.getElementById('editBallCount').value;
  const strikeCount = document.getElementById('editStrikeCount').value;

  // Send PUT request to the server
  fetch('/pastsession', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      id: id,
      sessionName: sessionName,
      pitchCount: pitchCount,
      ballCount: ballCount,
      strikeCount: strikeCount
    })
  })
  .then(response => {
    if (response.ok) {
      window.location.reload(); // Reload the page to reflect the changes
    } else {
      console.error('Failed to update session');
    }
  });
});


///////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function() {
  const editIcons = document.querySelectorAll('.edit-icon');
  const editModal = document.getElementById('editModal');
  const closeModal = document.querySelector('.close');
  const editForm = document.getElementById('editForm');
  const editSessionId = document.getElementById('editSessionId');
  const editSessionName = document.getElementById('editSessionName');
  const editStrikezoneData = document.getElementById('editStrikezoneData');

  editIcons.forEach(icon => {
    icon.addEventListener('click', function() {
        const sessionId = this.getAttribute('data-sessionId');
        const strikezoneData = this.getAttribute('data-strikezoneData');
        // Populate the modal with the current data
        editSessionId.value = sessionId;
        editStrikezoneData.value = strikezoneData;
        // Show the modal
        editModal.style.display = 'block';
    });
});

closeModal.addEventListener('click', function() {
    editModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target == editModal) {
        editModal.style.display = 'none';
    }
});

editForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const sessionId = editSessionId.value;
    const updatedStrikezoneData = editStrikezoneData.value;

    fetch(`/sessions/${sessionId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ strikezoneData: updatedStrikezoneData })
    })
    .then(response => {
        if (response.ok) {
            window.location.reload(); // Reload the page to reflect the changes
        } else {
            console.error('Failed to update strikezone data');
        }
    });
});
});

/////////////////////////////////////////////////////////////

// Function to open the modal and populate the fields
function openEditModal(sessionId, sessionName, strikezoneData) {
  document.getElementById('editSessionId').value = sessionId;
  document.getElementById('editSessionName').value = sessionName;
  document.getElementById('editstrikezoneData').value = strikezoneData;

  const modal = document.getElementById('editModal');
  modal.style.display = 'block';
}

// Event listener for edit button/icon
document.querySelectorAll('.editBtn').forEach((button) => {
  button.addEventListener('click', (event) => {
    const sessionId = event.target.dataset.sessionId; // Replace with your dataset key
    const sessionName = event.target.dataset.sessionName;
    const strikezoneData = JSON.parse(event.target.dataset.strikezoneData);

    openEditModal(sessionId, sessionName, strikezoneData);
  });
});

// Close modal when 'Save' is clicked
document.querySelector('.close').addEventListener('click', () => {
  document.getElementById('editModal').style.display = 'none';
});

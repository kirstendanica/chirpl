document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const durationInput = document.getElementById("duration-input");
  const taskList = document.getElementById("task-list");
  const startButton = document.getElementById("start-button");
  const timerDisplay = document.getElementById("timer-display");
  const modeToggle = document.getElementById("mode-toggle");
  const timerCompleteAudio = document.getElementById("timer-complete-audio");

  // Initialize array for tasks & timerInterval variable
  let tasks = [];
  let timerInterval;

  startButton.addEventListener("click", () => {
    const taskName = taskInput.value;
    const duration = parseInt(durationInput.value);
    if (taskName && !isNaN(duration)) {
      tasks.push({ name: taskName, duration: duration });
      updateTaskList();
    }
  });

  modeToggle.addEventListener("click", () => {
    // Toggle nightmode | darkmode
    document.body.classList.toggle("night-mode");
  });

  updateTaskList();

  // Function for updating tasklist
  function updateTaskList() {
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const taskElement = document.createElement("div");
      taskElement.className = "task";
      taskElement.innerHTML = `
                <label><input type="checkbox" class="break-checkbox"> ${task.name} (${task.duration} min)</label>
                <div class="timer"></div>
                <button class="start-button">Start</button>
                <button class="stop-button" disabled>Stop</button>
                <button class="reset-button">Reset</button>
            `;
      taskList.appendChild(taskElement);
      createCountdownTimer(task, taskElement, index);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      taskElement.appendChild(deleteButton);

      const resetButton = taskElement.querySelector(".reset-button");
      const stopButton = taskElement.querySelector(".stop-button");

      resetButton.addEventListener("click", () => {
        clearInterval(timerInterval);
        remainingTime = task.duration * 60;
        updateTimerDisplay();
        startButton.disabled = false;
        stopButton.disabled = true;
        resetButton.disabled = true;
      });

      deleteButton.addEventListener("click", () => {
        tasks.splice(index, 1);
        updateTaskList();
      });
    });
  }
  // Countdown timer
  function createCountdownTimer(task, taskElement, index) {
    const timerElement = taskElement.querySelector(".timer");
    const startButton = taskElement.querySelector(".start-button");
    const stopButton = taskElement.querySelector(".stop-button");
    const resetButton = taskElement.querySelector(".reset-button");
    const breakCheckbox = taskElement.querySelector(".break-checkbox");
    // Initialize time remaining
    let remainingTime = task.duration * 60;

    startButton.addEventListener("click", () => {
      if (breakCheckbox.checked) {
        taskElement.classList.add("break");
      } else {
        taskElement.classList.remove("break");
      }

      startButton.disabled = true;
      stopButton.disabled = false;
      updateTimerDisplay();

      // Start timer display
      timerInterval = setInterval(() => {
        // Check if time remaining is 0
        if (remainingTime <= 0) {
            // Stop timer display
          clearInterval(timerInterval);
          timerElement.textContent = "Chiirrrpp! (Complete)";
          startButton.disabled = false;
          stopButton.disabled = true;
          resetButton.disabled = false;

          // 'Chirp' audio alert on timer completion
          timerCompleteAudio.play();
        } else {
          remainingTime--;
          updateTimerDisplay();
        }
      }, 1000);
    });

    stopButton.addEventListener("click", () => {
      clearInterval(timerInterval);
      startButton.disabled = false;
      stopButton.disabled = true;
    });

    resetButton.addEventListener("click", () => {
      clearInterval(timerInterval);
      remainingTime = task.duration * 60;
      updateTimerDisplay();
      startButton.disabled = false;
      stopButton.disabled = true;
      resetButton.disabled = true;
    });

    // Function for updating timer display
    function updateTimerDisplay() {
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      timerElement.textContent = `${minutes}:${
        seconds < 10 ? "0" : ""
      }${seconds}`;
    }
  }
  // Mascot
  const mascotGallery = document.querySelector(".mascot-gallery");
  const mascotPreview = document.querySelector(".mascot-preview");
  const toggleMascotGalleryButton = document.getElementById(
    "toggle-mascot-gallery"
  );
  const selectedMascotIndex = 0;

  // Array of mascot names & images
  const mascots = [
    "Baby Robin",
    "Hawklet",
    "Baby Jay",
    "Yellow-Tuft Orchestra",
    "ConklaREE!",
    "Sassy Borb",
    "Cooper's Chicken",
  ];

  const mascotImages = [
    "assets/img/mascot1.png",
    "assets/img/mascot2.png",
    "assets/img/mascot3.png",
    "assets/img/mascot4.png",
    "assets/img/mascot5.png",
    "assets/img/mascot6.png",
    "assets/img/mascot7.png",
  ];
  toggleMascotGalleryButton.addEventListener("click", () => {
    if (mascotGallery.style.display === "none") {
      openMascotGallery();
    } else {
      closeMascotGallery();
    }
  });

  // Functions for opening and closing mascot gallery
  function openMascotGallery() {
    mascotGallery.style.display = "flex";
  }

  function closeMascotGallery() {
    mascotGallery.style.display = "none";
  }

  // Functions for highlighting chosen mascot & removing highlight
  function highlightSelectedMascot(index) {
    const mascotImages = mascotGallery.querySelectorAll(".mascot-container");
    unhighlightAllMascots();
    mascotImages[index].classList.add("selected");
    updateSelectedMascot(index);
  }

  function unhighlightAllMascots() {
    const mascotImages = mascotGallery.querySelectorAll(".mascot-container");
    mascotImages.forEach((img) => {
      img.classList.remove("selected");
    });
  }

  // Function for updating - changing mascot
  function updateSelectedMascot(index) {
    const selectedMascot = mascots[index];
    const selectedMascotImage = mascotImages[index];
    mascotPreview.style.backgroundImage = `url(${selectedMascotImage})`;
    mascotPreview.textContent = selectedMascot;
  
    const selectedMascotName = document.querySelector(".selected-mascot-name");
    selectedMascotName.textContent = selectedMascot;
  
    if (selectedMascot) {
      selectedMascotName.style.display = "block"; // Show the selected mascot name
    } else {
      selectedMascotName.style.display = "none"; // Hide the selected mascot name
    }
  }
  
  mascotImages.forEach((imageSrc, index) => {
    const img = new Image();
    img.src = imageSrc;
    img.alt = `Mascot ${index + 1}`;
    img.addEventListener("click", () => {
      setMascot(index);
      closeMascotGallery();
    });
  
    const mascotName = document.createElement("div");
    mascotName.classList.add("mascot-name");
    mascotName.textContent = mascots[index];
  
    const mascotContainer = document.createElement("div");
    mascotContainer.classList.add("mascot-container");
    mascotContainer.appendChild(img);
    mascotContainer.appendChild(mascotName);
  
    mascotGallery.appendChild(mascotContainer);
  });
  
  // Set default mascot
  setMascot(selectedMascotIndex);
  
  function setMascot(index) {
    const selectedMascot = mascots[index];
    const selectedMascotImage = mascotImages[index];
  
    mascotPreview.style.backgroundImage = `url(${selectedMascotImage})`;
    highlightSelectedMascot(index);
  }
  
  mascotPreview.parentNode.insertBefore(
    mascotGallery,
    mascotPreview.nextSibling
  );
  
  mascotPreview.addEventListener("click", () => {
    if (mascotGallery.style.display === "none") {
      openMascotGallery();
    } else {
      closeMascotGallery();
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input");
    const durationInput = document.getElementById("duration-input");
    const taskList = document.getElementById("task-list");
    const startButton = document.getElementById("start-button");
    const timerDisplay = document.getElementById("timer-display");
    const modeToggle = document.getElementById("mode-toggle");
    const timerCompleteAudio = document.getElementById("timer-complete-audio");

    // Store Tasks
    let tasks = [];
    let timerInterval;

    // Add tasks
    startButton.addEventListener("click", () => {
        const taskName = taskInput.value;
        const duration = parseInt(durationInput.value);
        if (taskName && !isNaN(duration)) {
            tasks.push({ name: taskName, duration: duration });
            updateTaskList();
        }
    });

    // Toggle light / dark mode
    modeToggle.addEventListener("click", () => {
        document.body.classList.toggle("night-mode");
    });

    // Tasklist init
    updateTaskList();

    // Update tasklist w countdown timer
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

            timerInterval = setInterval(() => {
                if (remainingTime <= 0) {
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

        function updateTimerDisplay() {
            const minutes = Math.floor(remainingTime / 60);
            const seconds = remainingTime % 60;
            timerElement.textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        }
    }
});
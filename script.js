// Course Data
const courses = [
    {
        name: "Chinese (Mandarin)",
        description: "Uses Chinese characters and is mainly spoken in China, Taiwan, and Singapore. Known for its tones and complex characters, learning Mandarin offers a deep dive into Chinese culture.",
        image: "Chinese.jpg",
        video: "Chinese.mp4",
        status: "available"  // possible statuses: "available", "registered", "completed"
    },
    {
        name: "Spanish",
        description: "Written in the Latin alphabet and widely spoken in Spain, Latin America, and the U.S. Phonetic and similar to English, making it relatively easy to learn.",
        image: "Spanish.jpg",
        video: "Spanish.mp4",
        status: "available"
    },
    {
        name: "Korean",
        description: "Uses the Hangul alphabet, primarily spoken in South and North Korea. Known for its logical script and polite language levels, providing cultural context.",
        image: "Korean.jpg",
        video: "Korean.mp4",
        status: "available"
    },
    {
        name: "French",
        description: "Written in the Latin alphabet, spoken in France, parts of Canada, and Africa. Known for its nasal sounds and silent letters, French opens doors to art, cuisine, and literature.",
        image: "French.jpg",
        video: "French.mp4",
        status: "available"
    },
    {
        name: "German",
        description: "Uses the Latin alphabet, spoken in Germany, Austria, and Switzerland. Known for compound words and logical structure, it’s great for analytical learners.",
        image: "German.jpg",
        video: "German.mp4",
        status: "available"
    },
    {
        name: "Japanese",
        description: "Combines Kanji and two phonetic scripts, spoken mainly in Japan. Offers insight into Japanese culture, with a challenging yet rewarding writing system.",
        image: "Japanese.jpg",
        video: "Japanese.mp4",
        status: "available"
    },
    {
        name: "Italian",
        description: "Written in the Latin alphabet, primarily spoken in Italy. Known for its musical quality and connection to art and cuisine, Italian is straightforward to pronounce.",
        image: "Italian.jpg",
        video: "Italian.mp4",
        status: "available"
    },
    {
        name: "Portuguese",
        description: "Uses the Latin alphabet, spoken in Portugal, Brazil, and parts of Africa. Known for nasal sounds and verb complexity, offering access to vibrant cultures.",
        image: "Portuguese.jpg",
        video: "Portuguese.mp4",
        status: "available"
    },
    {
        name: "Hindi",
        description: "Written in the Devanagari script, widely spoken in India. Has a phonetic script and diverse vocabulary, connecting learners to Bollywood and rich Indian heritage.",
        image: "Hindi.jpg",
        video: "Hindi.mp4",
        status: "available"
    },
    {
        name: "Arabic",
        description: "Uses the Arabic script, spoken across the Middle East and North Africa. Root-based language with regional dialects, offering insights into a diverse cultural heritage.",
        image: "Arabic.jpg",
        video: "Arabic.mp4",
        status: "available"
    }
];

// Variables
const authForm = document.getElementById("auth-form");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const switchToRegister = document.getElementById("switch-to-register");
const authTitle = document.getElementById("auth-title");
const logoutButton = document.getElementById("logout");
const availableCourses = document.getElementById("available-courses");
const registeredCourses = document.getElementById("registered-courses");
const completedCourses = document.getElementById("completed-courses");
const appContent = document.getElementById("app-content");
const userNameSpan = document.getElementById("user-name");

let currentUser = null;

// Helper functions
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer)).map(byte => byte.toString(16).padStart(2, "0")).join("");
}

function saveUserData(username, password) {
    hashPassword(password).then(hashedPassword => {
        let users = JSON.parse(localStorage.getItem("users")) || [];
        users.push({ username, password: hashedPassword });
        localStorage.setItem("users", JSON.stringify(users));
    });
}

function getUserData() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveCourseProgress(username, courseName, status) {
    let progress = JSON.parse(localStorage.getItem(username + "_progress")) || {};
    progress[courseName] = status;
    localStorage.setItem(username + "_progress", JSON.stringify(progress));
}

function getCourseProgress(username, courseName) {
    let progress = JSON.parse(localStorage.getItem(username + "_progress")) || {};
    return progress[courseName] || "not-registered";
}

function loadCourses() {
    // Clear the current course sections
    availableCourses.innerHTML = '';
    registeredCourses.innerHTML = '';
    completedCourses.innerHTML = '';

    courses.forEach(course => {
        const courseItem = document.createElement("div");
        courseItem.classList.add("course-item");

        const img = document.createElement("img");
        img.src = course.image;
        courseItem.appendChild(img);

        const name = document.createElement("h3");
        name.innerText = course.name;
        courseItem.appendChild(name);

        const registerButton = document.createElement("button");
        registerButton.innerText = "Register";
        registerButton.onclick = () => registerCourse(course.name);
        courseItem.appendChild(registerButton);

        const markAsDoneButton = document.createElement("button");
        markAsDoneButton.innerText = "Mark as Done";
        markAsDoneButton.style.display = "none";
        markAsDoneButton.onclick = () => markCourseAsDone(course.name);
        courseItem.appendChild(markAsDoneButton);

        const seeVideoButton = document.createElement("button");
        seeVideoButton.innerText = "See Video";
        seeVideoButton.style.display = "none";
        seeVideoButton.onclick = () => showCourseVideo(course.name, course.video);
        courseItem.appendChild(seeVideoButton);

        const description = document.createElement("p");
        description.innerText = course.description;
        courseItem.appendChild(description);

        const unregisterButton = document.createElement("button");
        unregisterButton.innerText = "Unregister";
        unregisterButton.onclick = () => unregisterCourse(course.name);
        unregisterButton.style.display = "none"; // Initially hidden

        const reRegisterButton = document.createElement("button");
        reRegisterButton.innerText = "Re-register";
        reRegisterButton.style.display = "none";
        reRegisterButton.onclick = () => reRegisterCourse(course.name);

        const progressStatus = getCourseProgress(currentUser.username, course.name);
        if (progressStatus === "registered") {
            registerButton.style.display = "none";
            unregisterButton.style.display = "inline-block";
            seeVideoButton.style.display = "inline-block";
            markAsDoneButton.style.display = "inline-block";
            registeredCourses.appendChild(courseItem);
        } else if (progressStatus === "completed") {
            registerButton.style.display = "none";
            unregisterButton.style.display = "none";
            seeVideoButton.style.display = "none";
            markAsDoneButton.style.display = "none";
            reRegisterButton.style.display = "inline-block";
            completedCourses.appendChild(courseItem);
        } else {
            availableCourses.appendChild(courseItem);
        }

        courseItem.appendChild(unregisterButton);
        courseItem.appendChild(reRegisterButton);
    });
}

function registerCourse(courseName) {
    saveCourseProgress(currentUser.username, courseName, "registered");
    loadCourses();
}

function unregisterCourse(courseName) {
    saveCourseProgress(currentUser.username, courseName, "not-registered");
    loadCourses();
}

function reRegisterCourse(courseName) {
    saveCourseProgress(currentUser.username, courseName, "registered");
    loadCourses();
}

function showCourseVideo(courseName, video) {
    // Get the existing video element and source tag
    const videoElement = document.getElementById("courseVideo");
    const videoSource = document.getElementById("videoSource");

    // Update the video source
    videoSource.src = video;
    
    // Reload the video to reflect the new source
    videoElement.load();
    
    // Show the video modal (make the video element visible)
    videoElement.style.display = "block";

    // Create a close button for the modal
    const closeButton = document.getElementById("close-btn");
    closeButton.style.display = "block";
    // Event listener to close the modal when the button is clicked
    closeButton.onclick = () => {
        videoElement.style.display = "none";  // Hide the video
        const closeButton = document.getElementById("close-btn");
        closeButton.style.display = "none";
    };

}

function markCourseAsDone(courseName) {
    saveCourseProgress(currentUser.username, courseName, "completed");
    loadCourses();
}

// User Login/Registration
async function loginUser(username, password) {
    const users = getUserData();
    const hashedPassword = await hashPassword(password);
    return users.find(user => user.username === username && user.password === hashedPassword);
}

function switchToRegisterForm() {
    authTitle.innerText = "Register";
    authForm.reset();
    switchToRegister.style.display = "none";
}

// Event Listeners
authForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (authTitle.innerText === "Login") {
        loginUser(username, password).then(user => {
            if (user) {
                currentUser = user;
                userNameSpan.innerText = username;
                appContent.classList.remove("hidden");
                auth.style.display = "none";
                localStorage.setItem("currentUser", JSON.stringify(currentUser)); // Save the logged-in user
                loadCourses();
            } else {
                alert("Invalid login credentials.");
            }
        });
    } else {
        saveUserData(username, password);
        currentUser = { username, password };
        userNameSpan.innerText = username;
        appContent.classList.remove("hidden");
        auth.style.display = "none";
        localStorage.setItem("currentUser", JSON.stringify(currentUser)); // Save the logged-in user
        loadCourses();
    }
});

switchToRegister.addEventListener("click", switchToRegisterForm);

logoutButton.addEventListener("click", function () {
    appContent.classList.add("hidden");
    auth.style.display = "flex";
    currentUser = null;
    localStorage.removeItem("currentUser");  // Remove user session on logout
});

// Check login state on page load
window.addEventListener("load", function () {
    const loggedInUser = localStorage.getItem("currentUser");
    if (loggedInUser) {
        currentUser = JSON.parse(loggedInUser);
        userNameSpan.innerText = currentUser.username;
        appContent.classList.remove("hidden");
        auth.style.display = "none";
        loadCourses();
    } else {
        auth.style.display = "flex";
    }
});

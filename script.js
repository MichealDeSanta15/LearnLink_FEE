// ==================================
// ADVANCED INTERACTIVITY FOR LEARNLINK
// ==================================

// Reset session data on page reload
localStorage.removeItem('isLoggedIn');
localStorage.removeItem('userRole');
localStorage.removeItem('dashboardItems');


// --- THEME TOGGLE (Dark/Light Mode) ---
function toggleTheme() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    
    // Toggle the 'light-mode' class on the body element
    body.classList.toggle('light-mode');
    trackGamification('theme');
    
    // Update the Moon/Sun icon and save the user's preference to LocalStorage
    if (body.classList.contains('light-mode')) {
        icon.classList.replace('bx-moon', 'bx-sun');
        localStorage.setItem('theme', 'light');
    } else {
        icon.classList.replace('bx-sun', 'bx-moon');
        localStorage.setItem('theme', 'dark');
    }
}

// Ensures the theme stays consistent across page reloads
document.addEventListener('DOMContentLoaded', () => {
    // 1. Check LocalStorage Theme Preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        document.getElementById('themeIcon').classList.replace('bx-moon', 'bx-sun');
    }

    // 2. Start Typewriter Effect
    typeEffect();
});

// --- NAVBAR SCROLL EFFECT ---
// Triggers glassmorphism background on the navbar once scrolled 50px
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// --- TYPEWRITER EFFECT ---
const typewriterElement = document.getElementById('typewriter');
const words = ["Find <span class='highlight'>Mentorship.</span>", "Build <span class='highlight'>Projects.</span>", "Master <span class='highlight'>Skills.</span>"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentWord = words[wordIndex];
    if (!isDeleting) {
        typewriterElement.innerHTML = currentWord.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex > currentWord.length) {
            isDeleting = true;
            setTimeout(typeEffect, 1500); // Wait after typing word
            return;
        }
    } else {
        typewriterElement.innerHTML = currentWord.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length; // Loop to next word
        }
    }
    const speed = isDeleting ? 30 : 80;
    setTimeout(typeEffect, speed);
}

// --- SEARCH FILTERING ---
function filterMentors() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.mentor-card');
    
    if (input.length > 2) trackGamification('search');

    cards.forEach(card => {
        // Reads from the embedded HTML data-skills attribute
        const skills = card.getAttribute('data-skills').toLowerCase();
        if (skills.includes(input)) {
            card.style.display = 'block';
            card.style.animation = 'fade-in 0.5s ease forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// --- SCROLL REVEAL ANIMATIONS ---
const observerOptions = {
    threshold: 0.1, // Trigger when 10% visible
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// --- GENERIC LOGIN/ACTION MODAL ---
const genericModal = document.getElementById('customModal');
const modalTitle = document.getElementById('modalTitle');
const modalDefaultBody = document.getElementById('modalDefaultBody');
const loginFormBody = document.getElementById('loginFormBody');
const modalIcon = document.getElementById('modalIcon');

function showModal(titleText = "Secure Login") {
    modalTitle.innerText = titleText;
    genericModal.classList.add('active');
    
    // Toggle advanced login form
    if(titleText === 'Login') {
        if(modalDefaultBody) modalDefaultBody.style.display = 'none';
        if(loginFormBody) loginFormBody.style.display = 'block';
        if(modalIcon) modalIcon.className = "bx bx-lock-alt modal-icon";
    } else {
        if(modalDefaultBody) modalDefaultBody.style.display = 'block';
        if(loginFormBody) loginFormBody.style.display = 'none';
        if(modalIcon) modalIcon.className = "bx bxs-rocket modal-icon";
    }
}

function closeModal() {
    genericModal.classList.remove('active');
}

genericModal.addEventListener('click', (e) => {
    if (e.target === genericModal) closeModal();
});

// --- ADVANCED TEACHER PROFILE MODAL LOGIC ---
const profileModal = document.getElementById('profileModal');

function openProfile(buttonElement) {
    // Find the closest ancestor div with the class '.mentor-card'
    const card = buttonElement.closest('.mentor-card');
    
    // Extract hidden data securely from the DOM elements directly
    const name = card.getAttribute('data-name');
    const img = card.getAttribute('data-img');
    const dept = card.getAttribute('data-dept');
    const bio = card.getAttribute('data-bio');
    const timings = card.getAttribute('data-timings');
    
    // Inject the extracted data into the profile modal HTML structure
    document.getElementById('p-img').src = img;
    document.getElementById('p-name').innerText = name;
    document.getElementById('p-dept').innerText = dept;
    document.getElementById('p-bio').innerText = bio;
    
    // Process the timings list (expecting format: "TimeA|TimeB")
    const timingsList = document.getElementById('p-timings');
    timingsList.innerHTML = ''; // Wipe previous data securely
    
    // GitHub API removed

    if (timings) {
        const timingsArray = timings.split('|');
        timingsArray.forEach(time => {
            const li = document.createElement('li');
            li.innerHTML = `<i class='bx bx-time-five'></i> ${time}`;
            li.setAttribute('draggable', 'true');
            li.setAttribute('data-time', time);
            
            // Drag and Drop Schedule Builder Events
            li.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', time);
                setTimeout(() => li.style.opacity = '0.5', 0);
            });
            li.addEventListener('dragend', () => {
                li.style.opacity = '1';
            });
            
            timingsList.appendChild(li);
        });
    } else {
        timingsList.innerHTML = "<li><i class='bx bx-calendar-x'></i> Schedule subject to change. Contact directly.</li>";
    }
    
    // Make modal appear visually
    profileModal.classList.add('active');
}

function closeProfileModal() {
    profileModal.classList.remove('active');
}

// Ensure clicking the dark background behind the modal closes it
profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) closeProfileModal();
});

// Helper sequence to book a session inside the profile viewer
function bookFromProfile() {
    closeProfileModal();
    const teacherName = document.getElementById('p-name').innerText;
    // Utilize the general modal logic for booking
    showModal(`Mentorship Request sent to ${teacherName}`);
}

// ==================================
// SIMULATED AI CHATBOT LOGIC
// ==================================

const chatbotUI = document.getElementById('chatbotUI');
const chatBody = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');

// 1. Toggle Chat Window
function toggleChatbot() {
    chatbotUI.classList.toggle('active');
}

// 2. Handle Enter Keypress
function handleEnter(event) {
    if (event.key === 'Enter') {
        handleSend();
    }
}

// 3. Process Sending Message
async function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return; // Prevent sending empty bubbles
    
    trackGamification('chat');
    
    // Inject User Message Bubble
    appendMessage(text, 'user-message');
    chatInput.value = ''; // Clear input field
    
    // Temporarily show a typing indicator
    const typingID = showTypingIndicator();
    
    const lowerText = text.toLowerCase();
    
    // 2. Jokes API (Async Branch)
    if(lowerText.includes('joke')) {
        try {
            const res = await fetch('https://v2.jokeapi.dev/joke/Programming?type=single');
            const data = await res.json();
            removeElement(typingID);
            appendMessage(`Haha! Here's a live API joke:<br><br><i>"${data.joke}"</i>`, 'bot-message');
            return;
        } catch(e) {
            console.error("Joke API Failed", e);
        }
    }
    
    // Simulate AI "Thinking" Delay of 1.2 seconds for static responses
    setTimeout(() => {
        removeElement(typingID);
        const botReply = generateBotResponse(lowerText);
        appendMessage(botReply, 'bot-message');
    }, 1200);
}

// 4. Inject message bubble into DOM
function appendMessage(text, className, id = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${className}`;
    msgDiv.innerHTML = text; // allow bolding / html
    if (id) msgDiv.id = id;
    
    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight; // Auto scroll down
}

// 5. Visual Typing indicator
function showTypingIndicator() {
    const id = 'typing-' + Date.now();
    appendMessage("...", "bot-message", id);
    return id;
}
function removeElement(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// 6. The "Brain" - Keyword matching Engine
function generateBotResponse(input) {
    if (input.includes('hello') || input.includes('hi')) {
        return "Hello! I am the LearnLink AI. Are you looking to find a mentor or join a project today?";
    } 
    if (input.includes('mentor') || input.includes('teacher')) {
        return "We have incredible mentors available! Are you interested in <b>Web Development</b>, <b>AI/ML</b>, or something else?";
    } 
    if (input.includes('project') || input.includes('task')) {
        return "Active R&D projects are listed below. Specifically, the Smart Campus AI Bot is urgently looking for 2 developers!";
    } 
    if (input.includes('mongodb') || input.includes('node') || input.includes('web')) {
        return "<b>Dr. Amit Sharma</b> is our resident expert in MongoDB and Web Tech. You should view his profile and book a session!";
    } 
    if (input.includes('ai') || input.includes('python') || input.includes('machine learning')) {
        return "<b>Ms. Neha Gupta</b> leads our AI/ML group. She hosts workshops regularly. Check her availability in her profile!";
    } 
    if (input.includes('react') || input.includes('frontend') || input.includes('ui')) {
        return "If you want to master Frontend design and React, <b>Mr. Rahul Verma</b> is your best bet! He has 5+ years of industry UI experience.";
    } 
    if (input.includes('schedule') || input.includes('time') || input.includes('free')) {
        return "You can view each mentor's exact availability by clicking the <b>View Profile</b> button on their cards.";
    }
    
    // Fallback if no keywords match
    return "I'm still learning! You can try searching for a specific skill in the Explore bar, or ask me about 'mentors', 'projects', or topics like 'Python' and 'Web'.";
}

// ==================================
// ADVANCED FEATURES IMPLEMENTATION
// ==================================

// --- 1. Fake Backend Dashboard (LocalStorage) ---
let selectedTimeSlot = null;

function showDashboard(e) {
    if(e) e.preventDefault();
    document.getElementById('home').style.display = 'none';
    document.getElementById('mentors').style.display = 'none';
    document.getElementById('projects').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    
    // Update active nav link
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    const dashLink = document.querySelector('a[href="#dashboard"]');
    if (dashLink) dashLink.classList.add('active');
    
    window.scrollTo(0,0);
    renderDashboard();
}

function renderDashboard() {
    const grid = document.getElementById('dashboardGrid');
    const emptyMsg = document.getElementById('emptyDashboardMsg');
    const role = localStorage.getItem('userRole') || 'student';
    
    // Update Header
    const dbHeader = document.querySelector('#dashboard .section-header h2');
    if(dbHeader) {
        dbHeader.innerText = role === 'teacher' ? 'Teacher Dashboard' : 'Student Dashboard';
    }
    const dbDesc = document.querySelector('#dashboard .section-header p');
    if(dbDesc) {
        dbDesc.innerText = role === 'teacher' ? 'Track applications and session requests received.' : 'Track your upcoming mentorship sessions and project applications sent.';
    }
    
    // Clear everything except the empty message and chartCard
    const cards = grid.querySelectorAll('.dashboard-item-card');
    cards.forEach(c => c.remove());
    
    // Create summary counters
    let summaryCard = document.getElementById('dbSummaryCard');
    if(summaryCard) summaryCard.remove();
    
    const items = JSON.parse(localStorage.getItem('dashboardItems') || '[]');
    
    if(items.length > 0) {
        summaryCard = document.createElement('div');
        summaryCard.id = 'dbSummaryCard';
        summaryCard.className = 'glass-card fade-in visible';
        summaryCard.style.gridColumn = '1 / -1';
        summaryCard.style.display = 'flex';
        summaryCard.style.justifyContent = 'space-around';
        summaryCard.style.padding = '20px';
        
        let sessions = items.filter(i => i.type === 'session').length;
        let projects = items.filter(i => i.type === 'project').length;
        
        if (role === 'teacher') {
            summaryCard.innerHTML = `
                <div style="text-align:center;"><h3>${sessions}</h3><p style="color:var(--text-muted);">Sessions Received</p></div>
                <div style="text-align:center;"><h3>${projects}</h3><p style="color:var(--text-muted);">Applications Received</p></div>
            `;
        } else {
            summaryCard.innerHTML = `
                <div style="text-align:center;"><h3>${sessions}</h3><p style="color:var(--text-muted);">Sessions Sent</p></div>
                <div style="text-align:center;"><h3>${projects}</h3><p style="color:var(--text-muted);">Applications Sent</p></div>
            `;
        }
        // Insert right after chartCard
        const chart = document.getElementById('chartCard');
        if(chart && chart.nextSibling) {
            grid.insertBefore(summaryCard, chart.nextSibling);
        } else {
            grid.appendChild(summaryCard);
        }
    }
    
    if(items.length === 0) {
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
        items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'glass-card dashboard-item-card fade-in visible';
            
            // Adjust texts depending on role
            let displayTitle = item.title;
            let displayDesc = item.desc;
            
            if (role === 'teacher') {
                displayTitle = item.title.replace('Session:', 'Session Request from Student:');
                displayDesc = item.type === 'session' ? 'Student requested mentorship' : 'Student submitted portfolio';
            }
            
            div.innerHTML = `
                <div class="proj-header">
                    <span class="status pulse" style="background: rgba(46, 204, 113, 0.1); color: #2ecc71;">Active</span>
                    <i class='bx ${item.type === 'session' ? 'bx-calendar-star' : 'bx-briefcase'}'></i>
                </div>
                <h3>${displayTitle}</h3>
                <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 15px;">${displayDesc}</p>
                <div class="proj-meta">
                    <span><i class='bx bx-time'></i> ${item.timeInfo || 'Pending...'}</span>
                </div>
            `;
            grid.appendChild(div);
        });
    }
}

let pendingAction = null;

window.bookFromProfile = function() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        showToast("Please login first to request a session.");
        showModal('Login');
        return;
    }

    const teacherName = document.getElementById('p-name').innerText;
    
    // Require a time slot to be dragged if none selected
    if(!selectedTimeSlot && document.getElementById('p-timings').children.length > 0 && !document.getElementById('p-timings').innerHTML.includes('Contact directly')) {
        showToast("Please drag and drop a time slot to select it first!");
        return;
    }
    
    pendingAction = {
        type: 'session',
        title: `Session: ${teacherName}`,
        desc: `Mentorship request sent successfully.`,
        timeInfo: selectedTimeSlot || 'Not specified'
    };
    
    closeProfileModal();
    window.showModal(`Confirm Session with ${teacherName}`);
};

window.confirmPendingAction = function() {
    if (pendingAction) {
        const items = JSON.parse(localStorage.getItem('dashboardItems') || '[]');
        items.push(pendingAction);
        localStorage.setItem('dashboardItems', JSON.stringify(items));
        showToast("Successfully added to your Dashboard!");
        pendingAction = null;
    }
    closeModal();
    resetDropzone();
};

// Intercept project applications
const originalShowModal = showModal;
window.showModal = function(titleText) {
    if(titleText.includes("Applying for")) {
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            showToast("Please login first to apply for projects.");
            originalShowModal('Login');
            return;
        }
        pendingAction = {
            type: 'project',
            title: titleText.replace("Applying for ", "Project: "),
            desc: `Portfolio submitted for review.`,
            timeInfo: 'Awaiting Response'
        };
    } else if (!titleText.startsWith("Confirm")) {
        pendingAction = null;
    }
    originalShowModal(titleText);
};

// --- 2. Gamification & Easter Eggs ---
let unlockedGamification = localStorage.getItem('masterNetworker') === 'true';

if(unlockedGamification) {
    document.getElementById('easterEggBadge').style.display = 'block';
}

function trackGamification(action) {
    if(unlockedGamification) return;
    
    let progress = JSON.parse(localStorage.getItem('gamiProgress') || '{"theme":false, "search":false, "chat":false}');
    progress[action] = true;
    localStorage.setItem('gamiProgress', JSON.stringify(progress));
    
    if(progress.theme && progress.search && progress.chat) {
        unlockedGamification = true;
        localStorage.setItem('masterNetworker', 'true');
        document.getElementById('easterEggBadge').style.display = 'block';
        showToast("🏆 Achievement Unlocked: Master Networker!");
        drawConfetti(); // Optional flair
    }
}

function showToast(message) {
    let container = document.getElementById('toastContainer');
    if(!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class='bx bx-info-circle'></i> <span>${message}</span>`;
    container.appendChild(toast);
    
    // Clean up
    setTimeout(() => {
        if(toast.parentElement) toast.remove();
    }, 5000);
}

// Confetti Effect for Easter Egg
function drawConfetti() {
    for (let i = 0; i < 50; i++) {
        const conf = document.createElement('div');
        conf.style.position = 'fixed';
        conf.style.left = Math.random() * 100 + 'vw';
        conf.style.top = '-10px';
        conf.style.width = '10px';
        conf.style.height = '10px';
        conf.style.backgroundColor = ['#ff4d4d', '#2ecc71', '#f1c40f', '#3498db'][Math.floor(Math.random() * 4)];
        conf.style.zIndex = '99999';
        conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        conf.style.transition = 'transform 3s linear, top 3s linear';
        document.body.appendChild(conf);
        
        setTimeout(() => {
            conf.style.top = '100vh';
            conf.style.transform = `rotate(${Math.random() * 360}deg) scale(0)`;
        }, 50);
        setTimeout(() => conf.remove(), 3050);
    }
}

// --- 3. Drag and Drop Schedule Builder ---
const dropzone = document.getElementById('scheduleDropzone');

dropzone.addEventListener('dragover', (e) => {
    e.preventDefault(); // Allows drop
    dropzone.classList.add('dragover');
});

dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    
    const timeInfo = e.dataTransfer.getData('text/plain');
    if(timeInfo) {
        selectedTimeSlot = timeInfo;
        dropzone.classList.add('dropped');
        dropzone.innerHTML = `<i class='bx bx-check-circle'></i><span>Selected: ${timeInfo}</span><span style="font-size:12px;cursor:pointer;text-decoration:underline;" onclick="resetDropzone(event)">Clear</span>`;
        document.getElementById('bookSessionBtn').innerText = `Request Session for ${timeInfo.split(' ')[0]}`;
    }
});

function resetDropzone(e) {
    if(e) e.stopPropagation();
    selectedTimeSlot = null;
    dropzone.classList.remove('dropped');
    dropzone.innerHTML = `<i class='bx bx-calendar-plus'></i><span>Drag a time slot here to select</span>`;
    document.getElementById('bookSessionBtn').innerText = `Request Mentorship Session`;
}

// Ensure resetting logic when opening a new profile
const originalOpenProfile = openProfile;
window.openProfile = function(btn) {
    resetDropzone();
    originalOpenProfile(btn);
}



// --- 5. Interactive Node Network Canvas ---
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseInfo = {
    x: null,
    y: null,
    radius: 150
};

window.addEventListener('mousemove', (event) => {
    mouseInfo.x = event.x;
    mouseInfo.y = event.y;
});
window.addEventListener('mouseout', () => {
    mouseInfo.x = null;
    mouseInfo.y = null;
});

// Create Particle
class Particle {
    constructor(x, y, directionX, directionY, size) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        // Assign a random connection limit per node to mimic varied network density
        this.maxConnections = Math.floor(Math.random() * 3) + 2; 
        this.connections = 0;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        const color = document.body.classList.contains('light-mode') ? 'rgba(0, 0, 0, 0.4)' : 'rgba(204, 0, 0, 0.5)';
        ctx.fillStyle = color;
        ctx.fill();
    }
    update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        let dx = (mouseInfo.x || -1000) - this.x;
        let dy = (mouseInfo.y || -1000) - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);
        
        if (distance < mouseInfo.radius + this.size){
            if(mouseInfo.x != null && mouseInfo.y != null) {
                // Interactive repulsion/attraction can be adjusted. We'll do a subtle repulsion
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (mouseInfo.radius - distance) / mouseInfo.radius;
                
                this.x -= forceDirectionX * force * 3;
                this.y -= forceDirectionY * force * 3;
            }
        }
        
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function initCanvas() {
    particlesArray = [];
    let numberOfParticles = (canvas.width * canvas.height) / 12000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.5) - 0.25;
        let directionY = (Math.random() * 0.5) - 0.25;
        particlesArray.push(new Particle(x, y, directionX, directionY, size));
    }
}

function connectParticles() {
    // Reset connection counters
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].connections = 0;
    }
    
    const colorBase = document.body.classList.contains('light-mode') ? 'rgba(0,0,0,0.15)' : 'rgba(204,0,0,0.25)';
    ctx.strokeStyle = colorBase;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    
    let threshold = (canvas.width / 10) * (canvas.height / 10);
    
    for (let a = 0; a < particlesArray.length; a++) {
        let pA = particlesArray[a];
        for (let b = a + 1; b < particlesArray.length; b++) {
            let pB = particlesArray[b];
            
            // Fast bounding box check before expensive multiplication
            if (Math.abs(pA.x - pB.x) > 150 || Math.abs(pA.y - pB.y) > 150) continue;
            
            let distance = ((pA.x - pB.x) * (pA.x - pB.x)) + ((pA.y - pB.y) * (pA.y - pB.y));
            
            if (distance < threshold) {
                if(pA.connections < pA.maxConnections && pB.connections < pB.maxConnections) {
                    pA.connections++;
                    pB.connections++;
                    
                    ctx.moveTo(pA.x, pA.y);
                    ctx.lineTo(pB.x, pB.y);
                }
            }
        }
    }
    ctx.stroke();
}

function animateCanvas() {
    requestAnimationFrame(animateCanvas);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connectParticles();
}

// Window resizing
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        initCanvas();
    }, 200);
});

// Boot up Canvas
initCanvas();
animateCanvas();

// --- Make discover button go back to home --
const discoverLink = document.querySelector('a[href="#home"]');
if(discoverLink) {
    discoverLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('home').style.display = 'flex'; // Hero is flex
        document.getElementById('mentors').style.display = 'block';
        document.getElementById('projects').style.display = 'block';
        
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        discoverLink.classList.add('active');
        window.scrollTo(0,0);
    });
}

// ==================================
// PART 3: MORE WOW UI EXTENSIONS
// ==================================



// --- 2. Pure JS Bar Chart (Canvas) ---
const chartCanvas = document.getElementById('skillsChart');
let chartRendered = false;

function renderSkillChart() {
    if(!chartCanvas || chartRendered) return;
    const ctxC = chartCanvas.getContext('2d');
    if(!ctxC) return;
    
    chartRendered = true;
    const cw = chartCanvas.width;
    const ch = chartCanvas.height;
    
    const dbItems = JSON.parse(localStorage.getItem('dashboardItems') || '[]');
    let htmlVal = 40, jsVal = 30, reactVal = 20, pyVal = 20;
    
    dbItems.forEach(item => {
        const t = (item.title || "").toLowerCase();
        if(t.includes('ai') || t.includes('neha')) { pyVal += 30; }
        if(t.includes('analytics') || t.includes('rahul')) { reactVal += 35; jsVal += 20; }
        if(t.includes('amit')) { jsVal += 25; htmlVal += 15; }
    });
    
    const skillsData = [
        { label: 'HTML/CSS', val: Math.min(100, htmlVal), color: '#ff4d4d' },
        { label: 'JavaScript', val: Math.min(100, jsVal), color: '#f1c40f' },
        { label: 'React / Node', val: Math.min(100, reactVal), color: '#3498db' },
        { label: 'Python / AI', val: Math.min(100, pyVal), color: '#2ecc71' }
    ];
    
    let animProgress = 0;
    const padding = 40;
    const availableW = cw - (padding * 2);
    const availableH = ch - (padding * 2);
    const barWidth = Math.min(60, availableW / (skillsData.length * 2));
    const spacing = (availableW - (barWidth * skillsData.length)) / (skillsData.length + 1);

    function drawChartFrame() {
        ctxC.clearRect(0, 0, cw, ch);
        
        // Base Line
        ctxC.beginPath();
        ctxC.moveTo(padding, ch - padding);
        ctxC.lineTo(cw - padding, ch - padding);
        ctxC.strokeStyle = document.body.classList.contains('light-mode') ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';
        ctxC.lineWidth = 2;
        ctxC.stroke();
        
        skillsData.forEach((item, i) => {
            const x = padding + spacing + (i * (barWidth + spacing));
            const targetH = (item.val / 100) * availableH;
            const currentH = targetH * animProgress;
            const y = ch - padding - currentH;
            
            // Bar
            ctxC.fillStyle = item.color;
            ctxC.fillRect(x, y, barWidth, currentH);
            
            // Text Label
            ctxC.fillStyle = document.body.classList.contains('light-mode') ? '#333' : '#fff';
            ctxC.font = '14px Outfit';
            ctxC.textAlign = 'center';
            ctxC.fillText(item.label, x + (barWidth/2), ch - padding + 25);
            
            // Text Value
            if(animProgress > 0.1) {
                ctxC.fillText(Math.floor(item.val * animProgress) + '%', x + (barWidth/2), y - 10);
            }
        });
        
        if(animProgress < 1) {
            animProgress += 0.03;
            requestAnimationFrame(drawChartFrame);
        }
    }
    drawChartFrame();
}

// Trigger render when switching to dashboard
const originalShowDb = window.showDashboard;
window.showDashboard = function(e) {
    if(originalShowDb) originalShowDb(e);
    chartRendered = false; // Reset to allow redraw with new dynamic data
    setTimeout(renderSkillChart, 150);
}

// --- 3. Konami Code Secret Hologram Theme ---
const secretCode = ['h', 'a', 'c', 'k'];
let codePos = 0;

window.addEventListener('keydown', (e) => {
    // Ignore if typing in an input
    if(e.target.tagName.toLowerCase() === 'input') return;
    
    if (e.key.toLowerCase() === secretCode[codePos]) {
        codePos++;
        if (codePos === secretCode.length) {
            document.body.classList.toggle('hacker-theme');
            if(document.body.classList.contains('hacker-theme')) {
                showToast("🟢 SYSTEM OVERRIDE: Hologram mode engaged.");
                chartRendered = false; // Reset chart so it redraws
                if(document.getElementById('dashboard').style.display === 'block') renderSkillChart();
            } else {
                showToast("System returned to normal.");
            }
            codePos = 0;
        }
    } else {
        codePos = 0;
    }
});

// --- 4. Advanced Login Form Validation ---
window.togglePasswordVisibility = function() {
    const pwd = document.getElementById('passwordInput');
    const icon = document.getElementById('togglePasswordBtn');
    if(pwd.type === 'password') {
        pwd.type = 'text';
        icon.classList.replace('bx-show', 'bx-hide');
    } else {
        pwd.type = 'password';
        icon.classList.replace('bx-hide', 'bx-show');
    }
};

const pwdInput = document.getElementById('passwordInput');
const strBar = document.getElementById('passwordStrengthBar');
const strFeebback = document.getElementById('passwordFeedback');

if(pwdInput) {
    pwdInput.addEventListener('input', () => {
        const val = pwdInput.value;
        let score = 0;
        if(val.length > 5) score += 20;
        if(val.length > 8) score += 20;
        if(/[A-Z]/.test(val)) score += 20;
        if(/[0-9]/.test(val)) score += 20;
        if(/[^A-Za-z0-9]/.test(val)) score += 20;
        
        strBar.style.width = score + '%';
        
        if(score < 50) {
            strBar.style.background = '#ff4d4d';
            strFeebback.innerText = "Weak (Needs uppercase & numbers)";
            strFeebback.style.color = '#ff4d4d';
        } else if(score < 80) {
            strBar.style.background = '#f1c40f';
            strFeebback.innerText = "Medium (Good, add a special character)";
            strFeebback.style.color = '#f1c40f';
        } else {
            strBar.style.background = '#2ecc71';
            strFeebback.innerText = "Strong (Excellent!)";
            strFeebback.style.color = '#2ecc71';
        }
    });
}

window.handleLoginSubmit = function(e) {
    e.preventDefault();
    const val = pwdInput.value;
    const emailInput = document.getElementById('emailInput');
    const roleInput = document.getElementById('roleInput');
    
    if (!emailInput.value.toLowerCase().endsWith('@chitkara.edu.in')) {
        showToast("Access denied. Use your @chitkara.edu.in email.");
        return;
    }
    
    // Fake server validation delay
    const btn = e.target.querySelector('button[type="submit"]');
    btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i>";
    
    setTimeout(() => {
        if(val.length < 8 || !/[A-Z]/.test(val) || !/[0-9]/.test(val)) {
            // Force reflow to re-trigger shake animation
            const formBody = document.getElementById('loginFormBody');
            formBody.classList.remove('shake');
            void formBody.offsetWidth; 
            formBody.classList.add('shake');
            showToast("Password validation failed.");
            btn.innerText = "Login securely";
            return;
        }
        
        // Success
        localStorage.removeItem('dashboardItems'); // Reset data when logging in again
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userRole', roleInput.value);
        closeModal();
        showToast(`Authenticated successfully as ${roleInput.value}.`);
        
        // Update global Nav state
        const loginNavBtn = document.querySelector('button[onclick="showModal(\'Login\')"]');
        if(loginNavBtn) {
            loginNavBtn.innerHTML = "Dashboard <i class='bx bx-user'></i>";
            loginNavBtn.onclick = showDashboard;
            loginNavBtn.classList.remove('btn-glow');
            loginNavBtn.classList.add('btn-outline');
            loginNavBtn.style.color = "var(--primary)";
            loginNavBtn.style.borderColor = "var(--primary)";
        }
        btn.innerText = "Login securely";
    }, 800);
};

// --- 5. Custom HTML5 Video Player ---
const vidModal = document.getElementById('videoModal');
const promoVid = document.getElementById('promoVideo');
const ppIcon = document.getElementById('playPauseIcon');
const progBar = document.getElementById('progressBar');
const progContainer = document.getElementById('progressContainer');
const tDisplay = document.getElementById('timeDisplay');
const volIcon = document.getElementById('volumeIcon');

window.openVideoModal = function() {
    vidModal.classList.add('active');
    promoVid.play();
    ppIcon.classList.replace('bx-play', 'bx-pause');
};

window.closeVideoModal = function() {
    vidModal.classList.remove('active');
    promoVid.pause();
};

window.togglePlayPause = function() {
    if(promoVid.paused) {
        promoVid.play();
        ppIcon.classList.replace('bx-play', 'bx-pause');
    } else {
        promoVid.pause();
        ppIcon.classList.replace('bx-pause', 'bx-play');
    }
};

window.toggleMute = function() {
    promoVid.muted = !promoVid.muted;
    if(promoVid.muted) {
        volIcon.classList.replace('bx-volume-full', 'bx-volume-mute');
    } else {
        volIcon.classList.replace('bx-volume-mute', 'bx-volume-full');
    }
};

if(promoVid) {
    promoVid.addEventListener('timeupdate', () => {
        const cur = promoVid.currentTime;
        const dur = promoVid.duration;
        if(!dur) return;
        
        progBar.style.width = (cur / dur) * 100 + '%';
        tDisplay.innerText = `${fmTime(cur)} / ${fmTime(dur)}`;
    });
    
    promoVid.addEventListener('ended', () => {
        ppIcon.classList.replace('bx-pause', 'bx-play');
    });
}

function fmTime(secArgs) {
    const m = Math.floor(secArgs / 60);
    const s = Math.floor(secArgs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

window.seekVideo = function(e) {
    const rect = progContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    promoVid.currentTime = pos * promoVid.duration;
};

// ==================================
// PART 4: EXTERNAL API INTEGRATIONS
// ==================================

// --- Dev.to Tech News API (Dashboard) ---
async function fetchNews() {
    const newsGrid = document.getElementById('newsGrid');
    if(!newsGrid) return;
    
    try {
        const res = await fetch('https://dev.to/api/articles?per_page=3&tag=webdev');
        const articles = await res.json();
        
        newsGrid.innerHTML = '';
        articles.forEach(article => {
            newsGrid.innerHTML += `
                <a href="${article.url}" target="_blank" style="text-decoration:none; color:inherit;">
                    <div class="glass-card fade-in visible" style="height:100%; display:flex; flex-direction:column; padding:20px;">
                        <h3 style="font-size:16px; margin-bottom:10px; line-height:1.4;">${article.title}</h3>
                        <div style="flex:1;"></div>
                        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; color:var(--text-muted); margin-top:15px;">
                            <span><i class='bx bx-heart' style="color:var(--primary);"></i> ${article.public_reactions_count}</span>
                            <span>@${article.user.username}</span>
                        </div>
                    </div>
                </a>
            `;
        });
    } catch(err) {
        newsGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color:#ff4d4d;">Failed to load live news.</p>';
    }
}

// --- Daily Quote API (Hero Banner) ---
async function fetchDailyQuote() {
    const textEl = document.getElementById('quoteText');
    const authorEl = document.getElementById('quoteAuthor');
    if(!textEl) return;
    
    try {
        const res = await fetch('https://dummyjson.com/quotes/random?tags=technology');
        const data = await res.json();
        
        textEl.style.opacity = '0';
        authorEl.style.opacity = '0';
        
        setTimeout(() => {
            textEl.innerText = `"${data.quote}"`;
            authorEl.innerText = `- ${data.author}`;
            textEl.style.opacity = '1';
            authorEl.style.opacity = '1';
            textEl.style.transition = 'opacity 0.5s';
            authorEl.style.transition = 'opacity 0.5s';
        }, 300);
    } catch(err) {
        textEl.innerText = '"Errors are just undocumented features."';
        authorEl.innerText = '- Senior Developer';
    }
}

// Initialize Global APIs
fetchNews();
fetchDailyQuote();

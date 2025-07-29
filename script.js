// Store all activities, including predefined ones
let allActivities = [];

// Predefined activities
const predefinedActivities = {
    'immediate': [
        { name: 'Favorite Song Ritual', description: 'Play your most uplifting song with full attention and movement', duration: 5 },
        { name: 'Mindful Treat', description: 'Savor a small piece of dark chocolate or premium tea', duration: 10 },
        { name: 'Digital Inspiration', description: 'Browse curated content that sparks joy and creativity', duration: 15 },
        { name: 'Movement Break', description: 'Gentle stretching or spontaneous dance in private space', duration: 10 }
    ],
    'sustained': [
        { name: 'Literary Escape', description: 'Immerse in quality fiction or inspiring non-fiction', duration: 30 },
        { name: 'Creative Expression', description: 'Sketch, write, or craft with no expectations', duration: 25 },
        { name: 'Nature Connection', description: 'Mindful walk outdoors with phone in airplane mode', duration: 35 },
        { name: 'Social Nourishment', description: 'Meaningful conversation with someone you care about', duration: 40 }
    ],
    'restoration': [
        { name: 'Meditation Practice', description: 'Guided or silent meditation with breathing awareness', duration: 60 },
        { name: 'Ritual Bath', description: 'Luxurious bath with essential oils and soft music', duration: 90 },
        { name: 'Contemplative Writing', description: 'Journal reflection on gratitude and intentions', duration: 45 },
        { name: 'Mindful Creation', description: 'Slow crafting like knitting, pottery, or gardening', duration: 120 }
    ]
};

// Function to load activities from localStorage or use predefined
function loadActivities() {
    const storedActivities = localStorage.getItem('dopamineMenuActivities');
    if (storedActivities) {
        allActivities = JSON.parse(storedActivities);
    } else {
        // If no stored activities, populate with predefined ones
        for (const category in predefinedActivities) {
            predefinedActivities[category].forEach(activity => {
                allActivities.push({ ...activity, category: category, custom: false });
            });
        }
    }
    renderActivities();
}

// Function to save activities to localStorage
function saveActivities() {
    localStorage.setItem('dopamineMenuActivities', JSON.stringify(allActivities));
}

// Function to render all activities into their respective grids
function renderActivities() {
    document.getElementById('immediate-activities').innerHTML = '';
    document.getElementById('sustained-activities').innerHTML = '';
    document.getElementById('restoration-activities').innerHTML = '';

    allActivities.forEach((activity, index) => {
        const categoryMap = {
            'immediate': 'immediate-activities',
            'sustained': 'sustained-activities',
            'restoration': 'restoration-activities'
        };
        const grid = document.getElementById(categoryMap[activity.category]);
        if (grid) {
            const activityDiv = document.createElement('div');
            activityDiv.className = 'activity-item';
            activityDiv.innerHTML = `
                <div class="activity-duration">${activity.duration} min</div>
                <div class="activity-name">${activity.name}</div>
                <div class="activity-description">${activity.description}</div>
            `;
            grid.appendChild(activityDiv);

            // Animate in each item with a slight delay
            setTimeout(() => {
                activityDiv.style.opacity = '1';
                activityDiv.style.transform = 'translateY(0)';
            }, 100 * index); // Staggered animation

            // Add subtle click interaction to the item
            activityDiv.addEventListener('click', function() {
                this.style.transform = 'translateY(-5px) scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-5px) scale(1)';
                }, 150);
            });
        }
    });
}

// Function to open the modal
function openModal() {
    const modal = document.getElementById('activityModal');
    modal.style.display = 'flex';
    modal.classList.remove('closing'); /* Ensure no closing animation class */
    document.body.style.overflow = 'hidden';
    document.getElementById('activityForm').reset(); // Reset form on open
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('activityModal');
    modal.classList.add('closing'); /* Add closing animation class */
    modal.addEventListener('animationend', function handler() {
        modal.style.display = 'none';
        modal.classList.remove('closing');
        document.body.style.overflow = 'auto';
        modal.removeEventListener('animationend', handler);
    });
}

// Function to add a new custom activity
document.getElementById('activityForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('activityName').value.trim();
    const description = document.getElementById('activityDescription').value.trim();
    const duration = parseInt(document.getElementById('activityDuration').value);
    const category = document.getElementById('activityCategory').value;
    
    if (name && description && !isNaN(duration) && duration > 0) {
        allActivities.push({ name, description, duration, category, custom: true });
        saveActivities();
        renderActivities(); // Re-render all activities to include the new one
        closeModal();
    } else {
        showMessage("Please fill in all fields correctly!");
    }
});

// Function to pick a random activity
function pickRandomActivity() {
    if (allActivities.length === 0) {
        showMessage("No activities on the menu to pick from! Add some first.");
        return;
    }
    const randomIndex = Math.floor(Math.random() * allActivities.length);
    const picked = allActivities[randomIndex];
    
    document.getElementById('pickedActivityName').textContent = picked.name;
    document.getElementById('pickedActivityDescription').textContent = picked.description;
    document.getElementById('pickedActivityDuration').textContent = `${picked.duration} min`;
    
    const randomPickDisplay = document.getElementById('randomPickDisplay');
    randomPickDisplay.style.display = 'block';
    randomPickDisplay.style.animation = 'none'; /* Reset animation */
    void randomPickDisplay.offsetWidth; /* Trigger reflow */
    randomPickDisplay.style.animation = 'fadeInScale 0.6s ease-out forwards'; /* Restart animation */

    showMessage("Enjoy your Chef's Special Pick!");
}

// Function to clear all custom activities
function clearAllActivities() {
    // Filter out only custom activities and keep predefined ones
    allActivities = allActivities.filter(activity => activity.custom === false);
    saveActivities();
    renderActivities();
    showMessage("All custom dishes cleared from the menu!");
}

// Function to display a temporary message
function showMessage(msg) {
    const messageBox = document.createElement('div');
    messageBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #d4af37;
        color: #0a0a0a;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        z-index: 1001;
        font-family: 'Source Serif Pro', serif;
        font-size: 1.1rem;
        text-align: center;
        animation: fadeInOut 3s forwards;
    `;
    messageBox.textContent = msg;
    document.body.appendChild(messageBox);

    // Define keyframes for fadeInOut animation if not already defined globally
    if (!document.getElementById('fadeInOutKeyframes')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'fadeInOutKeyframes';
        styleSheet.innerHTML = `
            @keyframes fadeInOut {
                0% { opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { opacity: 0; display: none; }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    setTimeout(() => {
        messageBox.remove();
    }, 3000);
}

// Initialize activities on page load
document.addEventListener('DOMContentLoaded', loadActivities);

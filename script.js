document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const animateBtn = document.getElementById('animate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const animationBox = document.getElementById('animation-box');
    const colorPref = document.getElementById('color-pref');
    const speedPref = document.getElementById('speed-pref');
    const historyList = document.getElementById('history-list');
    
    // Animation types
    const animationTypes = ['pulse', 'spin', 'bounce'];
    let currentAnimationIndex = 0;
    
    // Load saved preferences
    loadPreferences();
    
    // Initialize history
    updateHistory();
    
    // Event Listeners
    animateBtn.addEventListener('click', triggerAnimation);
    resetBtn.addEventListener('click', resetPreferences);
    colorPref.addEventListener('change', savePreferences);
    speedPref.addEventListener('change', savePreferences);
    
    // Functions
    function triggerAnimation() {
        // Remove all animation classes first
        animationBox.classList.remove('pulse', 'spin', 'bounce', 'slow', 'fast');
        
        // Get current animation type
        const animationType = animationTypes[currentAnimationIndex];
        
        // Apply animation class
        animationBox.classList.add(animationType);
        
        // Apply speed class if not normal
        const speed = speedPref.value;
        if (speed !== 'normal') {
            animationBox.classList.add(speed);
        }
        
        // Update box color
        animationBox.style.backgroundColor = colorPref.value;
        
        // Save to history
        saveToHistory(animationType, speed);
        
        // Update animation index for next click
        currentAnimationIndex = (currentAnimationIndex + 1) % animationTypes.length;
    }
    
    function savePreferences() {
        localStorage.setItem('animationColorPref', colorPref.value);
        localStorage.setItem('animationSpeedPref', speedPref.value);
    }
    
    function loadPreferences() {
        const savedColor = localStorage.getItem('animationColorPref');
        const savedSpeed = localStorage.getItem('animationSpeedPref');
        
        if (savedColor) {
            colorPref.value = savedColor;
            animationBox.style.backgroundColor = savedColor;
        }
        
        if (savedSpeed) {
            speedPref.value = savedSpeed;
        }
    }
    
    function resetPreferences() {
        localStorage.removeItem('animationColorPref');
        localStorage.removeItem('animationSpeedPref');
        colorPref.value = '#3498db';
        speedPref.value = 'normal';
        animationBox.style.backgroundColor = '#3498db';
        animationBox.classList.remove('slow', 'fast');
    }
    
    function saveToHistory(animationType, speed) {
        const now = new Date();
        const timestamp = now.toLocaleTimeString();
        
        // Get current history or initialize empty array
        const history = JSON.parse(localStorage.getItem('animationHistory')) || [];
        
        // Add new entry
        history.unshift({
            type: animationType,
            speed: speed,
            color: colorPref.value,
            timestamp: timestamp
        });
        
        // Keep only last 5 entries
        if (history.length > 5) {
            history.pop();
        }
        
        // Save to localStorage
        localStorage.setItem('animationHistory', JSON.stringify(history));
        
        // Update displayed history
        updateHistory();
    }
    
    function updateHistory() {
        const history = JSON.parse(localStorage.getItem('animationHistory')) || [];
        historyList.innerHTML = '';
        
        if (history.length === 0) {
            historyList.innerHTML = '<li>No animation history yet</li>';
            return;
        }
        
        history.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.timestamp}: ${item.type} (${item.speed})`;
            li.style.color = item.color;
            historyList.appendChild(li);
        });
    }
});
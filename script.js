// Common colors array with names
const colors = [
    { hex: '#FF5733', name: 'Red' },
    { hex: '#33FF57', name: 'Green' },
    { hex: '#3357FF', name: 'Blue' },
    { hex: '#F3FF33', name: 'Yellow' },
    { hex: '#FF33F3', name: 'Pink' },
    { hex: '#33FFF3', name: 'Light Blue' },
    { hex: '#F333FF', name: 'Purple' },
    { hex: '#FF8333', name: 'Orange' },
    { hex: '#33FF83', name: 'Light Green' },
    { hex: '#000000', name: 'Black' },
    { hex: '#FFFFFF', name: 'White' }
];

// DOM elements
const randomizeBtn = document.getElementById('randomizeBtn');
const randomNumber = document.getElementById('randomNumber');
const colorBox = document.getElementById('colorBox');
const colorName = document.getElementById('colorName');
const historyList = document.getElementById('historyList');

// Function to get random number between 1 and 999
function getRandomNumber() {
    return Math.floor(Math.random() * 999) + 1; // +1 to shift the range to 1-999 instead of 0-998
}

// Function to get random color from the colors array
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Function to format date and time
function getFormattedDateTime() {
    const now = new Date();
    return now.toLocaleString();
}

// Function to add item to history
function addToHistory(number, color) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const colorIndicator = document.createElement('div');
    colorIndicator.className = 'history-color';
    colorIndicator.style.backgroundColor = color.hex;
    
    const content = document.createElement('div');
    content.className = 'history-content';
    content.innerHTML = `
        <div class="history-color-name">${color.name}</div>
        <strong>Number: ${number}</strong>
        <span style="margin-left: auto; color: #666;">${getFormattedDateTime()}</span>
    `;
    
    historyItem.appendChild(colorIndicator);
    historyItem.appendChild(content);
    
    // Add new item at the top of the list
    historyList.insertBefore(historyItem, historyList.firstChild);
}

// Event listener for the randomize button
randomizeBtn.addEventListener('click', () => {
    // Generate new random number and color
    const newNumber = getRandomNumber();
    const newColor = getRandomColor();
    
    // Update the display
    randomNumber.textContent = newNumber;
    colorBox.style.backgroundColor = newColor.hex;
    colorName.textContent = newColor.name;
    
    // Add to history
    addToHistory(newNumber, newColor);
    
    // Add animation effect
    randomNumber.style.animation = 'none';
    randomNumber.offsetHeight; // Trigger reflow
    randomNumber.style.animation = 'fadeIn 0.5s';
});

// Add some CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style); 
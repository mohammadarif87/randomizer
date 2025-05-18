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
const maxNumberInput = document.getElementById('maxNumber');
const maxNumberSlider = document.getElementById('maxNumberSlider');
const numberError = document.getElementById('numberError');
const enableColor = document.getElementById('enableColor');
const colorSelect = document.getElementById('colorSelect');
const exportBtn = document.getElementById('exportBtn');
const userName = document.getElementById('userName');
const userTeam = document.getElementById('userTeam');
const currentDateTime = document.getElementById('currentDateTime');

// Update current date and time
function updateDateTime() {
    const now = new Date();
    const dateOptions = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        timeZone: 'Europe/London'
    };
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Europe/London'
    };
    
    document.getElementById('currentDate').textContent = now.toLocaleString('en-GB', dateOptions);
    document.getElementById('currentTime').textContent = now.toLocaleString('en-GB', timeOptions);
}

// Update date/time every second
setInterval(updateDateTime, 1000);
updateDateTime();

// Sync number input and slider
maxNumberInput.addEventListener('input', () => {
    const value = parseInt(maxNumberInput.value);
    if (value >= 1 && value <= 999) {
        maxNumberSlider.value = value;
        numberError.style.display = 'none';
        randomizeBtn.disabled = false;
    } else {
        numberError.textContent = 'Please enter a number between 1 and 999';
        numberError.style.display = 'block';
        randomizeBtn.disabled = true;
    }
});

maxNumberSlider.addEventListener('input', () => {
    maxNumberInput.value = maxNumberSlider.value;
    numberError.style.display = 'none';
    randomizeBtn.disabled = false;
});

// Toggle color selection
enableColor.addEventListener('change', () => {
    colorSelect.disabled = !enableColor.checked;
    if (!enableColor.checked) {
        colorBox.style.display = 'none';
        colorName.style.display = 'none';
    } else {
        colorBox.style.display = 'block';
        colorName.style.display = 'block';
    }
});

// Function to get random number between 1 and max
function getRandomNumber(max) {
    return Math.floor(Math.random() * max) + 1;
}

// Function to get random color from the colors array
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Function to format date and time
function getFormattedDateTime() {
    const now = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Europe/London'
    };
    return now.toLocaleString('en-GB', options);
}

// Function to add item to history
function addToHistory(number, color, name, team) {
    const historyItem = document.createElement('div');
    historyItem.className = 'history-item';
    
    const colorIndicator = document.createElement('div');
    colorIndicator.className = 'history-color';
    if (color) {
        colorIndicator.style.backgroundColor = color.hex;
    } else {
        colorIndicator.style.display = 'none';
    }
    
    const content = document.createElement('div');
    content.className = 'history-content';
    
    const userInfo = name || team ? 
        `<div class="history-user-info">${name ? `Name: ${name}` : ''}${name && team ? ' | ' : ''}${team ? `Team: ${team}` : ''}</div>` : '';
    
    content.innerHTML = `
        ${color ? `<div class="history-color-name">${color.name}</div>` : ''}
        <strong>Number: ${number}</strong>
        ${userInfo}
        <span style="margin-left: auto; color: #666;">${getFormattedDateTime()}</span>
    `;
    
    historyItem.appendChild(colorIndicator);
    historyItem.appendChild(content);
    
    // Add new item at the top of the list
    historyList.insertBefore(historyItem, historyList.firstChild);
}

// Function to wrap text in PDF
function wrapText(doc, text, x, y, maxWidth) {
    const splitText = doc.splitTextToSize(text, maxWidth);
    doc.text(splitText, x, y);
    return splitText.length * 7; // Approximate line height
}

// Function to export history to PDF
function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Get current date/time for filename
    const now = new Date();
    const filename = `randomizer-history-${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}.pdf`;
    
    // Add title
    doc.setFontSize(20);
    doc.text('Randomizer History', 20, 20);
    
    // Add date/time
    doc.setFontSize(12);
    doc.text(`Generated on: ${getFormattedDateTime()}`, 20, 30);
    
    // Add user info if available
    if (userName.value || userTeam.value) {
        doc.text(`Name: ${userName.value || 'N/A'}`, 20, 40);
        doc.text(`Team: ${userTeam.value || 'N/A'}`, 20, 50);
    }
    
    // Get all history items
    const historyItems = Array.from(historyList.children);
    let yPosition = userName.value || userTeam.value ? 60 : 40;
    
    // Add table headers
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Colour', 20, yPosition);
    doc.text('Number', 60, yPosition);
    doc.text('User Info', 100, yPosition);
    doc.text('Timestamp', 150, yPosition);
    doc.setFont(undefined, 'normal');
    
    yPosition += 10;
    
    // Add each history item
    historyItems.forEach((item, index) => {
        const content = item.querySelector('.history-content');
        const colorName = content.querySelector('.history-color-name')?.textContent || 'N/A';
        const number = content.querySelector('strong').textContent.replace('Number: ', '');
        const userInfo = content.querySelector('.history-user-info')?.textContent || '';
        const timestamp = content.querySelector('span').textContent;
        
        // Add horizontal line
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 10;
        
        // Add color indicator
        const colorBox = item.querySelector('.history-color');
        if (colorBox && colorBox.style.backgroundColor) {
            doc.setFillColor(colorBox.style.backgroundColor);
            doc.rect(20, yPosition - 5, 5, 5, 'F');
            // Add border for all colors
            doc.setDrawColor(0); // Set border color to black
            doc.rect(20, yPosition - 5, 5, 5);
        }
        
        // Add content
        doc.text(colorName, 30, yPosition);
        doc.setFont(undefined, 'bold');
        doc.text(number, 60, yPosition);
        doc.setFont(undefined, 'normal');
        
        // Handle user info with wrapping
        const userInfoHeight = wrapText(doc, userInfo, 100, yPosition, 40);
        
        // Add timestamp with wrapping
        const timestampHeight = wrapText(doc, timestamp, 150, yPosition, 35);
        
        // Update y position based on the height of wrapped text
        yPosition += Math.max(10, Math.max(userInfoHeight, timestampHeight));
        
        // Check if we need a new page
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20;
        }
    });
    
    // Save the PDF
    doc.save(filename);
}

// Event listener for the randomize button
randomizeBtn.addEventListener('click', () => {
    // Validate required fields
    if (!userName.value.trim() || !userTeam.value.trim()) {
        alert('Please fill in both Name and Team fields');
        return;
    }
    
    // Validate field lengths
    if (userName.value.length > 24 || userTeam.value.length > 24) {
        alert('Name and Team fields must be 24 characters or less');
        return;
    }
    
    const max = parseInt(maxNumberInput.value);
    if (max < 1 || max > 999) {
        numberError.textContent = 'Please enter a number between 1 and 999';
        numberError.style.display = 'block';
        return;
    }
    
    // Generate new random number
    const newNumber = getRandomNumber(max);
    
    // Handle color
    let newColor;
    if (enableColor.checked) {
        if (colorSelect.value === 'random') {
            newColor = getRandomColor();
        } else {
            newColor = colors.find(c => c.hex === colorSelect.value);
        }
    }
    
    // Update the display
    randomNumber.textContent = newNumber;
    if (enableColor.checked) {
        colorBox.style.display = 'block';
        colorName.style.display = 'block';
        colorBox.style.backgroundColor = newColor.hex;
        colorName.textContent = newColor.name;
    } else {
        colorBox.style.display = 'none';
        colorName.style.display = 'none';
    }
    
    // Add to history
    addToHistory(newNumber, newColor, userName.value, userTeam.value);
    
    // Add animation effect
    randomNumber.style.animation = 'none';
    randomNumber.offsetHeight; // Trigger reflow
    randomNumber.style.animation = 'fadeIn 0.5s';
});

// Event listener for export button
exportBtn.addEventListener('click', exportToPDF);

// Add some CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style); 
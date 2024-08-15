const canvas = document.getElementById('cartesianPlane');
const ctx = canvas.getContext('2d');
let points = []; // Store marked points
let currentQuestionIndex = 0; // Initialize currentQuestionIndex
const questions = document.querySelectorAll('.question'); // Get all questions
const nextBtn = document.getElementById('nextbtn');

// Set canvas size based on container
const resizeCanvas = () => {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
};

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const range = 11; // Updated range for -8 to 8
const step = canvas.width / (2 * range); // Adjust step based on range
const halfWidth = canvas.width / 2;
const halfHeight = canvas.height / 2;

// Draw Cartesian Plane with Extended Axis Labels
const drawGrid = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;

    // Draw grid lines
    for (let i = -range; i <= range; i++) {
        const x = halfWidth + i * step;
        const y = halfHeight - i * step;

        // Vertical grid lines
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

        // Horizontal grid lines
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(halfWidth, 0);
    ctx.lineTo(halfWidth, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, halfHeight);
    ctx.lineTo(canvas.width, halfHeight);
    ctx.stroke();

    // Draw axis labels
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';

    // X-axis labels
    for (let i = -range; i <= range; i++) {
        const x = halfWidth + i * step;
        const label = i.toString();
        ctx.fillText(label, x + 2, halfHeight + 12);
    }

    // Y-axis labels
    for (let i = -range; i <= range; i++) {
        const y = halfHeight - i * step;
        const label = i.toString();
        ctx.fillText(label, halfWidth + 2, y - 2);
    }

    // Origin label
    ctx.fillText('0', halfWidth + 2, halfHeight + 12);

    // Redraw previously marked points
    points.forEach(point => {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
    });
};

drawGrid();

// const showQuestion = (direction) => {
//     resetPoints()
//     questions[currentQuestionIndex].style.display = 'none';
//     currentQuestionIndex += direction;
//     if (currentQuestionIndex < 0) {
//         currentQuestionIndex = 0;
//     } else if (currentQuestionIndex >= questions.length) {
//         currentQuestionIndex = questions.length - 1;
//     }
//     questions[currentQuestionIndex].style.display = 'block';
// };
const showQuestion = (direction) => {
console.log("called");
    console.log(`Current index before change: ${currentQuestionIndex}`);
    console.log('Direction:', direction);
    resetPoints();
    questions[currentQuestionIndex].style.display = 'none';

    currentQuestionIndex += direction;

    // Ensure index stays within bounds
    if (currentQuestionIndex < 0) {
        currentQuestionIndex = 0;
    } else if (currentQuestionIndex >= questions.length) {
        currentQuestionIndex = questions.length - 1;
    }

    console.log(`Current index after change: ${currentQuestionIndex}`);
    questions[currentQuestionIndex].style.display = 'block';

    // Hide "Previous" button on the first question
    document.getElementById('prevBtn').style.display = currentQuestionIndex === 0 ? 'none' : 'inline';
    // Hide "Next" button on the last question
    nextBtn.style.display = 'none';
};


// Mark points on the graph
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const canvasX = x - halfWidth;
    const canvasY = halfHeight - y;

    // Store the marked point
    points.push({ x: halfWidth + canvasX, y: halfHeight - canvasY });

    // Draw the point
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(halfWidth + canvasX, halfHeight - canvasY, 5, 0, Math.PI * 2);
    ctx.fill();
});

// Remove the last marked point
const removeLastPoint = () => {
    points.pop(); // Remove the last point from the array
    drawGrid(); // Redraw the grid with remaining points
};

// Reset all points on the graph
const resetPoints = () => {
    points = []; // Clear all points
    drawGrid(); // Redraw the grid with no points
};

// Check the answer and provide feedback
const checkAnswer = (correctAnswer, questionId) => {
    const feedbackElement = document.getElementById(`feedback-${questionId}`);
    const selectedOption = event.target;
    // Remove the color classes from all option buttons

    const buttons = document.querySelectorAll(`#${questionId} button`);
    console.log("buttons", buttons);
    // buttons.forEach(button => {
    //     button.classList.remove('correct-answer', 'wrong-answer');
    // });
    const failSound = document.getElementById('fail');
    // const nextBtn = document.getElementById('nextbtn');



    // Check if the selected option is correct
    if (selectedOption.textContent === correctAnswer) {
        feedbackElement.textContent = 'Good job! 🎉';
        feedbackElement.style.color = '#28a745';
        // selectedOption.classList.add('correct-answer');
        document.getElementById('point-sound').play();
        nextBtn.style.display = 'inline';

    } else {
        feedbackElement.textContent = 'Try again! ❌';
        feedbackElement.style.color = '#dc3545';
        // selectedOption.classList.add('wrong-answer');
        failSound.currentTime = 0;
        failSound.play();
        nextBtn.style.display = 'none';
    }
};




// Initialize the first question
showQuestion(0);

// Add event listeners to the navigation buttons
document.getElementById('prevBtn').addEventListener('click', () => showQuestion(-1));
nextBtn.addEventListener('click', () => showQuestion(1));

// Connect to the socket.io server
const socket = io();

const voteMessage = document.getElementById('vote-message');
const totalVotesDisplay = document.getElementById('total-votes');
const activityLog = document.getElementById('activity-log');
 
let hasVoted = false;

function submitVote(option) {
  if (hasVoted) return;
 
  // Emit the vote to the server
  socket.emit('submit-vote', option);
 
  hasVoted = true;
  disableAllButtons();
  showMessage(`You voted for "${option}"!`);
}
 
// Get updated vote counts from server
socket.on('vote-update', (votes) => {
  const total = Object.values(votes).reduce((sum, count) => sum + count, 0);
  totalVotesDisplay.textContent = total;
 
  // Update each bar and count label
  Object.keys(votes).forEach((option) => {
    const count = votes[option];
    const percent = total === 0 ? 0 : Math.round((count / total) * 100);
 
    document.getElementById(`count-${option}`).textContent = `${count} votes (${percent}%)`;
    document.getElementById(`bar-${option}`).style.width = `${percent}%`;
  });
});
 
// Show someone elase's vote in the activity log
socket.on('new-vote-notice', (option) => {
  logActivity(`Someone just voted for "${option}"`);
});
 
// For handling already voted case
socket.on('already-voted', (msg) => {
  showMessage(msg);
});
 
// Socket connection established
socket.on('connect', () => {
  logActivity('Connected! Cast your vote above.');
});
 
// Disable all buttons after voting
function disableAllButtons() {
  document.querySelectorAll('.vote-btn').forEach((btn) => {
    btn.disabled = true;
  });
}
 
// Message below the buttons
function showMessage(msg) {
  voteMessage.textContent = msg;
  voteMessage.classList.remove('hidden');
}
 
// Log activity in the sidebar
function logActivity(message) {
  const li = document.createElement('li');
  const time = new Date().toLocaleTimeString();
  li.textContent = `[${time}] ${message}`;
  activityLog.prepend(li);
 
  // Keep only the last 8 entries
  while (activityLog.children.length > 8) {
    activityLog.removeChild(activityLog.lastChild);
  }
}
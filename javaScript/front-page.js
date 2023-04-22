window.onload = function() {
  console.log('Fetching leaderboard data...');
  const url = '/fetch-leaderboard';
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  };

  fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error fetching the leaderboard!');
      }
      return response.json(); // Parse the response as JSON
    })
    .then(data => {
      console.log('Received leaderboard data:', data);
      displayLeaderboard(data); // Call the function to display the data in a table
    })
    .catch(error => {
      console.log('Error fetching leaderboard:', error);
    });
}

function displayLeaderboard(data) {
  // Get the table element by ID
  const table = document.getElementById('leaderboard-table-front-page');

  // Create table header row
  const headerRow = document.createElement('tr');
  const rankHeader = document.createElement('th');
  rankHeader.textContent = 'Rank';
  const usernameHeader = document.createElement('th');
  usernameHeader.textContent = 'Username';
  const wpmHeader = document.createElement('th');
  wpmHeader.textContent = 'WPM';
  headerRow.appendChild(rankHeader);
  headerRow.appendChild(usernameHeader);
  headerRow.appendChild(wpmHeader);
  table.appendChild(headerRow);

  // Create table body rows
  data.forEach((item, index) => {
    const row = document.createElement('tr');
    const rankCell = document.createElement('td');
    rankCell.textContent = index + 1;
    const usernameCell = document.createElement('td');
    usernameCell.textContent = item.uidUsers;
    const wpmCell = document.createElement('td');
    wpmCell.textContent = item.wpm;
    row.appendChild(rankCell);
    row.appendChild(usernameCell);
    row.appendChild(wpmCell);
    table.appendChild(row);
  });
}

const express = require("express")
const app = express();
const port= 3004

const { con } = require("./database-inc")
//configuration
app.set("view engine", "hbs");
app.set("views", "./view")
app.use(express.static(__dirname + "/public"))
app.use(express.json());
//routing
app.get("/front-page", (req, res) => {
  res.render("front-page");
});
app.get("/guest-mode", (req, res) => {
  res.render("guest-mode");
});

app.get("/", (req, res) => {
  res.render("typing-game")
});
app.get("/leaderboard", (req, res) => {
  res.render("leaderboard");
});

app.get("/progress-tracker", (req, res) => {
  res.render("progress-tracker");
});

app.get('/front-page.js', (req, res) => {
  res.set('Content-Type', 'text/javascript');
  res.sendFile(__dirname + '/front-page.js');
});

app.get('/guest-mode.js', (req, res) => {
  res.set('Content-Type', 'text/javascript');
  res.sendFile(__dirname + '/guest-mode.js');
});

app.get('/typing-game.js', (req, res) => {
  res.set('Content-Type', 'text/javascript');
  res.sendFile(__dirname + '/typing-game.js');
});
app.get('/leaderboard.js', (req, res) => {
  res.set('Content-Type', 'text/javascript');
  res.sendFile(__dirname + '/leaderboard.js');
});

app.get('/progress-tracker.js', (req, res) => {
  res.set('Content-Type', 'text/javascript');
  res.sendFile(__dirname + '/progress-tracker.js');
});

app.post('/fetch-leaderboard', (req, res) => {
  const query = `SELECT leaderboard.wpm, users.uidUsers
                 FROM leaderboard 
                 INNER JOIN users 
                 ON leaderboard.user_id = users.user_id
                 ORDER BY leaderboard.wpm DESC`;

  // execute the SQL query to fetch the data
  con.query(query, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error fetching data from the database');
      return;
    }

    // return the data as JSON
    res.json(result);
  });
});
 
app.post('/writeStats', (req, res) => {
  const { user_id, date, wpm, accuracy, timer_taken } = req.body;

  const query = 'INSERT INTO games (user_id, date, wpm, accuracy, time_taken) VALUES (?, ?, ?, ?, ?)';
  const values = [user_id, date, wpm, accuracy, timer_taken];

  con.query(query, values, (error, results, fields) => {
    if (error) {
      console.log(error);
      res.status(500).send('Error adding game data to database!');
    } else {
      // Check if the user's score is higher than any score in the leaderboard
      const leaderboardQuery = 'SELECT user_id, wpm FROM leaderboard ORDER BY wpm DESC LIMIT 10';
      con.query(leaderboardQuery, (leaderboardError, leaderboardResults, leaderboardFields) => {
        if (leaderboardError) {
          console.log(leaderboardError);
          res.status(500).send('Error getting leaderboard data from database!');
        } else {
          let userInLeaderboard = false;
          let lowestWpm = Number.MAX_SAFE_INTEGER;
          let lowestWpmUserId = null;

          for (const row of   leaderboardResults) {
            if (row.user_id === user_id) {
              userInLeaderboard = true;
              if (wpm > row.wpm) {
                const updateQuery = 'UPDATE leaderboard SET wpm = ? WHERE user_id = ?';
                const updateValues = [wpm, user_id];
                con.query(updateQuery, updateValues, (updateError, updateResults, updateFields) => {
                  if (updateError) {
                    console.log(updateError);
                    res.status(500).send('Error updating leaderboard data in database!');
                  } else {
                    res.send('Game data added successfully and leaderboard updated!');
                  }
                });
              } else {
                res.send('Game data added successfully but score not higher than existing score in leaderboard!');
              }
              break;
            }
            if (row.wpm < lowestWpm) {
              lowestWpm = row.wpm;
              lowestWpmUserId = row.user_id;
            }
          }

          if (!userInLeaderboard && wpm > lowestWpm) {
            const updateQuery = 'UPDATE leaderboard SET user_id = ?, wpm = ? WHERE user_id = ?';
            const updateValues = [user_id, wpm, lowestWpmUserId];
            con.query(updateQuery, updateValues, (updateError, updateResults, updateFields) => {
              if (updateError) {
                console.log(updateError);
                res.status(500).send('Error updating leaderboard data in database!');
              } else {
                res.send('Game data added successfully and leaderboard updated!');   
              }
            });
          } else if (!userInLeaderboard) {
            res.send('Game data added successfully but score not higher than lowest score in leaderboard!');
          }
        }
      });
    }
  });
});

app.post('/fetch-progress-tracker', (req, res) =>{
  const { user_id } = req.body;

    const fetchProgress ='SELECT * FROM games WHERE user_id= ?';
    con.query(fetchProgress, user_id, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error fetching data from the database');
        return;
      }
  
      // modify each object's date property
      const modifiedResult = result.map((game) => {
        const dateStr = game.date.toString();
        const year = dateStr.slice(0, 4);
        const month = dateStr.slice(4, 6);
        const day = dateStr.slice(6, 8);
        const formattedDate = `${year}-${month}-${day}`;
        return { ...game, date: formattedDate };
      });
      
  
      // return the modified array as JSON
      res.json(modifiedResult);
    });

  

});


//create server
app.listen(port, (err) => {
  if (err)
    throw err
  else 
    console.log("Server is running at port %d:", port);
});

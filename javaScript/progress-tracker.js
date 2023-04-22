class Stats {
  static readStats() {
    const url = '/fetch-progress-tracker';
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: sessionStorage.getItem('userId')
      })
    };

    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching your data!');
        }
        return response.json(); // parse response as JSON
      })
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  }
}

class ProgressTracker {
  constructor() {
    this._highestWpmElement = document.querySelector('.highest-wpm span');
    this._averageWpmElement = document.querySelector('.average-wpm span');
    this._highestAccuracyElement = document.querySelector('.highest-accuracy span');
    this._averageAccuracyElement = document.querySelector('.average-accuracy span');
    this._timeTypingElement = document.querySelector('.time-typing span');
    
  }

  calculateHighestWpm(data) {
    const highestWpm = data.reduce((acc, curr) => {
      return curr.wpm > acc ? curr.wpm : acc;
    }, 0);
    this._highestWpmElement.textContent = highestWpm;
  }
  calculateAverageWpm(data) {
    const sumWpm = data.reduce((acc, curr) => {
      return acc + curr.wpm;
    }, 0);
    const avgerageWpm = Math.round(sumWpm / data.length);
    this._averageWpmElement.textContent = avgerageWpm;
  }

  calculateHighestAccuracy(data) {
    const highestAccuracy = data.reduce((acc, curr) => {
      return curr.accuracy > acc ? curr.accuracy : acc;
    }, 0);
    this._highestAccuracyElement.textContent = highestAccuracy;
  }

  calculateAverageAccuracy(data) {
    const sumAccuracy = data.reduce((acc, curr) => {
      return acc + curr.accuracy;
    }, 0);
    const avgerageAccuracy = Math.round(sumAccuracy / data.length);
    this._averageAccuracyElement.textContent = avgerageAccuracy;
  }

  calculateTimeTyping(data) {
    const sumTimer = data.reduce((acc, curr) => {
      return acc + curr.time_taken;// sum of time_taken values
    }, 0); 
    this._timeTypingElement.textContent = formatTime(sumTimer);// setting the fomatted value to this element
  }
  calculateCurrentMonthWpm(data){ 
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();//
    const currentMonthDays = [];//
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const date = new Date(year, month, i);
      const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      
      currentMonthDays.push(formattedDate);
    }
    
   // Create an array of average WPM for each day of the current month
    const currentMonthWpm = currentMonthDays.map(day => {

      // Filter the games played on the current day
      const gamesOnDay = data.filter(game => game.date.startsWith(day));

      // Calculate the total WPM for all the games played on the current day
      const totalWpmOnDay = gamesOnDay.reduce((totalWpm, game) => totalWpm + game.wpm, 0);

      // Calculate the average WPM for all the games played on the current day
      const avgerageWpmOnDay = gamesOnDay.length > 0 ? totalWpmOnDay / gamesOnDay.length : 0;

      // Round the average WPM to the nearest whole number and return it
      return Math.round(avgerageWpmOnDay);
    });
    console.log(currentMonthWpm)


    const graph = new Graph();
    graph.currentMonthWpmGraph(currentMonthDays, currentMonthWpm);
  }

  calculateLastMonthWpm(data){
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() - 1;
    const daysInLastMonth = new Date(year, month + 1, 0).getDate();
    const lastMonthDays = [];
    for (let i = 1; i <= daysInLastMonth; i++) {
      const date = new Date(year, month, i);
      const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      lastMonthDays.push(formattedDate);
    }

    const lastMonthWpm = lastMonthDays.map(day => {
      const gamesOnDay = data.filter(game => game.date.startsWith(day));
      const totalWpmOnDay = gamesOnDay.reduce((totalWpm, game) => totalWpm + game.wpm, 0);
      const averageWpmOnDay = gamesOnDay.length > 0 ? totalWpmOnDay / gamesOnDay.length : 0;
      return Math.round(averageWpmOnDay);
    });
 
    const graph = new Graph();
    graph.lastMonthWpmGraph(lastMonthDays, lastMonthWpm);
  }
  calculateLastLastMonthWpm(data){
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() - 2;
    const daysInLastLastMonth = new Date(year, month + 1, 0).getDate();
    const lastLastMonthDays = [];
    for (let i = 1; i <= daysInLastLastMonth; i++) {
      const date = new Date(year, month, i);
      const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      lastLastMonthDays.push(formattedDate);
    }

    const lastLastMonthWpm = lastLastMonthDays.map(day => {
      const gamesOnDay = data.filter(game => game.date.startsWith(day));
      const totalWpmOnDay = gamesOnDay.reduce((totalWpm, game) => totalWpm + game.wpm, 0);
      const averageWpmOnDay = gamesOnDay.length > 0 ? totalWpmOnDay / gamesOnDay.length : 0;
      return Math.round(averageWpmOnDay);
    });

    const graph = new Graph();
    graph.lastLastMonthWpmGraph(lastLastMonthDays, lastLastMonthWpm);

  }
  calculateYearWpm(data){
    // Create a new date object with the current date and time
    const now = new Date(); 
    // Get the current year and month
    const year = now.getFullYear();
    const month = now.getMonth();
    // Initialize empty arrays to store the average WPM and month names for the past 12 months
    const yearWpm = [];
    const yearMonths = [];
    // Loop through the past 12 months, starting with the current month
    for (let i = 0; i < 12; i++) {
      // Calculate the month and year for the current iteration of the loop
      const monthToAverage = new Date(year, month - i, 1).toISOString().slice(0, 7);
      // Filter the data to only include games played in the current month
      const gamesInMonth = data.filter(game => game.date.startsWith(monthToAverage));
      // Calculate the total WPM for all games played in the current month
      const totalWpmInMonth = gamesInMonth.reduce((totalWpm, game) => totalWpm + game.wpm, 0);
      // Calculate the average WPM for all games played in the current month
      const averageWpmInMonth = gamesInMonth.length > 0 ? Math.round(totalWpmInMonth / gamesInMonth.length) : 0;
      // Add the average WPM for the current month to the beginning of the yearWpm array
      yearWpm.unshift(averageWpmInMonth);
      // Get the name of the current month and year and add it to the beginning of the yearMonths array
      const monthToPush = new Date(year, month - i, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
      yearMonths.unshift(monthToPush);   
    }
    console.log(yearMonths)
    console.log(yearWpm)
    const graph = new Graph();
    graph.yearWpmGraph(yearMonths, yearWpm);

  }
  calculateCurrentMonthAccuracy(data){
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const currentMonthDays = [];
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const date = new Date(year, month, i);
      const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      currentMonthDays.push(formattedDate);
    }
  
    const currentMonthAccuracy = currentMonthDays.map(day => {
      const gamesOnDay = data.filter(game => game.date.startsWith(day));
      const totalAccuracyOnDay = gamesOnDay.reduce((totalAccuracy, game) => totalAccuracy + game.accuracy, 0);
      const averageAccuracyOnDay = gamesOnDay.length > 0 ? totalAccuracyOnDay / gamesOnDay.length : 0;
      return Math.round(averageAccuracyOnDay);
    });

    const graph = new Graph();
    graph.currentMonthAccuracyGraph(currentMonthDays, currentMonthAccuracy);
  
  }

  calculateLastMonthAccuracy(data){
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() - 1;
    const daysInLastMonth = new Date(year, month + 1, 0).getDate();
    const lastMonthDays = [];
    for (let i = 1; i <= daysInLastMonth; i++) {
      const date = new Date(year, month, i);
      const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      lastMonthDays.push(formattedDate);
    }

    const lastMonthAccuracy = lastMonthDays.map(day => {
      const gamesOnDay = data.filter(game => game.date.startsWith(day));
      const totalAccuracyOnDay = gamesOnDay.reduce((totalAccuracy, game) => totalAccuracy + game.accuracy, 0);
      const averageAccuracyOnDay = gamesOnDay.length > 0 ? totalAccuracyOnDay / gamesOnDay.length : 0;
      return Math.round(averageAccuracyOnDay);
    });

    const graph = new Graph();
    graph.lastMonthAccuracyGraph(lastMonthDays, lastMonthAccuracy);
  }

  calculateLastLastMonthAccuracy(data){
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() - 2;
    const daysInLastLastMonth = new Date(year, month + 1, 0).getDate();
    const lastLastMonthDays = [];
    for (let i = 1; i <= daysInLastLastMonth; i++) {
      const date = new Date(year, month, i);
      const formattedDate = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      lastLastMonthDays.push(formattedDate);
    }

    const lastLastMonthAccuracy = lastLastMonthDays.map(day => {
      const gamesOnDay = data.filter(game => game.date.startsWith(day));
      const totalAccuracyOnDay = gamesOnDay.reduce((totalAccuracy, game) => totalAccuracy + game.accuracy, 0);
      const averageAccuracyOnDay = gamesOnDay.length > 0 ? totalAccuracyOnDay / gamesOnDay.length : 0;
      return Math.round(averageAccuracyOnDay);
    });

    const graph = new Graph();
    graph.lastLastMonthAccuracyGraph(lastLastMonthDays, lastLastMonthAccuracy);
  }
  calculateYearAccuracy(data){
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const yearAccuracy = [];
    const yearMonths = [];

    for (let i = 0; i < 12; i++) {
      const monthToAverage = new Date(year, month - i, 1).toISOString().slice(0, 7);
      const gamesInMonth = data.filter(game => game.date.startsWith(monthToAverage));
      const totalAccuracyInMonth = gamesInMonth.reduce((totalAccuracy, game) => totalAccuracy + game.accuracy, 0);
      const averageAccuracyInMonth = gamesInMonth.length > 0 ? Math.round(totalAccuracyInMonth / gamesInMonth.length) : 0;
      yearAccuracy.unshift(averageAccuracyInMonth);
      const monthToPush = new Date(year, month - i, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
      yearMonths.unshift(monthToPush);
    }


    const graph = new Graph();
    graph.yearAccuracyGraph(yearMonths, yearAccuracy);
    
  }
} 
class Graph {
  destroyWpmGraph(){
    // // Get references to canvas element
    const wpmGraph = document.getElementById('wpm-graph');
     
    // // Get the corresponding Chart instance for each canvas element and destroy it
    Chart.getChart(wpmGraph)?.destroy();
    
  }
  destroyAccuracyGraph(){
    const accuracyGraph = document.getElementById('accuracy-graph');
    Chart.getChart(accuracyGraph)?.destroy();

  }
  currentMonthWpmGraph(currentDays, currentMonthWpm) {
    this.destroyWpmGraph();
    const chart1 = new Chart(document.getElementById('wpm-graph'), {
      type: 'line',
      data: {
        labels: currentDays,
        datasets: [{
          label: 'Average WPM',
          data: currentMonthWpm,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'WPM'
            }
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Average WPM for current month'
          }
        }
      }
      
    });
  }
  
  lastMonthWpmGraph(lastMonthDays, lastMonthWpm ) {
    this.destroyWpmGraph();
    const chart2 = new Chart(document.getElementById('wpm-graph'), {
      type: 'line',
      data: {
        labels: lastMonthDays,
        datasets: [{
          label: 'Average WPM',
          data: lastMonthWpm,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'WPM'
            }
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Average WPM for previous month'
          }
        }
      }
      
    });
  }

  lastLastMonthWpmGraph(lastLastMonthDays, lastLastMonthWpm) {
     this.destroyWpmGraph();
    const chart3 = new Chart(document.getElementById('wpm-graph'), {
      type: 'line',
      data: {
        labels: lastLastMonthDays,
        datasets: [{
          label: 'Average WPM',
          data: lastLastMonthWpm,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'WPM'
            }
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Average WPM for last last month'
          }
        }
      }
      
    });
  }

  yearWpmGraph(yearMonths, yearWpm) {
    this.destroyWpmGraph();
    const chart4 = new Chart(document.getElementById('wpm-graph'), {
      type: 'line',
      data: {
        labels: yearMonths,
        datasets: [{
          label: 'Average WPM',
          data: yearWpm,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'WPM'
            }
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Average WPM for last 12 months'
          }
        }
      }
      
    });
  }

  currentMonthAccuracyGraph(currentDays, currentMonthAccuracy) {
    this.destroyAccuracyGraph()
    const chart5 = new Chart(document.getElementById('accuracy-graph'), {
      type: 'line',
      data: {
        labels: currentDays,
        datasets: [{
          label: 'Average Accuracy',
          data: currentMonthAccuracy,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Accuracy'
            }
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Average Accuracy for current month'
          }
        }
      }
      
    });
  }
  
  lastMonthAccuracyGraph(lastMonthDays, lastMonthAccuracy) {
    this.destroyAccuracyGraph();
    const chart6 = new Chart(document.getElementById('accuracy-graph'), {
      type: 'line',
      data: {
        labels: lastMonthDays,
        datasets: [{
          label: 'Average Accuracy',
          data: lastMonthAccuracy,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Accuracy'
            }
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Average Accuracy for previous month'
          }
        }
      }
      
    });
  }

  lastLastMonthAccuracyGraph(lastLastMonthDays, lastLastMonthAccuracy) {
     this.destroyAccuracyGraph();
    const chart7 = new Chart(document.getElementById('accuracy-graph'), {
      type: 'line',
      data: {
        labels: lastLastMonthDays,
        datasets: [{
          label: 'Average Accuracy',
          data: lastLastMonthAccuracy,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Accuracy'
            }
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Average Accuracy for last last month'
          }
        }
      }
      
    });
  }

  yearAccuracyGraph(yearMonths, yearAccuracy) {
    this.destroyAccuracyGraph();
    const chart8 = new Chart(document.getElementById('accuracy-graph'), {
      type: 'line',
      data: {
        labels: yearMonths,
        datasets: [{
          label: 'Average Accuracy',
          data: yearAccuracy,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Accuracy'
            }
          }
        },
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Average Accuracy for last 12 months'
          }
        }
      }
    });
  }

}
function formatTime(seconds) {
  let hours = Math.floor(seconds / 3600);// calculating how many hours in this many seconds
  let minutes = Math.floor((seconds - (hours * 3600)) / 60);//calculating how many whole minutes
  let remainingSeconds = seconds - (hours * 3600) - (minutes * 60);// remaining seconds. 
  
  // Add leading zeroes if necessary
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  
  if (remainingSeconds < 10) {
    remainingSeconds = "0" + remainingSeconds;
  }
  
  // Concatenate the values into a string
  return hours + ":" + minutes + ":" + remainingSeconds;
}
window.onload = function() {
  Stats.readStats().then(data => {
    const progressTracker = new ProgressTracker();
    progressTracker.calculateHighestWpm(data);
    progressTracker.calculateAverageWpm(data);
    progressTracker.calculateHighestAccuracy(data);
    progressTracker.calculateAverageAccuracy(data);
    progressTracker.calculateTimeTyping(data);



    optionMonthWpm.addEventListener('click', function() {
      progressTracker.calculateCurrentMonthWpm(data)
    });
    optionLastMonthWpm.addEventListener('click', function() {
      progressTracker.calculateLastMonthWpm(data)

    });
    optionLastLastMonthWpm.addEventListener('click', function() {
      progressTracker.calculateLastLastMonthWpm(data)
    });
    optionYearWpm.addEventListener('click', function() {
      progressTracker.calculateYearWpm(data)
    
    });
    optionMonthAccuracy.addEventListener('click', function() {
      progressTracker.calculateCurrentMonthAccuracy(data)
    });
    
    optionLastMonthAccuracy.addEventListener('click', function() {
      progressTracker.calculateLastMonthAccuracy(data)
    });
    
    optionLastLastMonthAccuracy.addEventListener('click', function() {
      progressTracker.calculateLastLastMonthAccuracy(data)
    });
    
    optionYearAccuracy.addEventListener('click', function() {
      progressTracker.calculateYearAccuracy(data)
    });
    
  });

  const optionYearWpm = document.getElementById('yearWpm');
  const optionMonthWpm = document.getElementById('currentMonthWpm');
  const optionLastMonthWpm = document.getElementById('lastMonthWpm');
  const optionLastLastMonthWpm = document.getElementById('lastLastMonthWpm');
  
  optionYearWpm.addEventListener('click', function() {
    optionYearWpm.classList.add('active');
    optionMonthWpm.classList.remove('active');
    optionLastMonthWpm.classList.remove('active');
    optionLastLastMonthWpm.classList.remove('active');
  });
  
  optionMonthWpm.addEventListener('click', function() {
    optionYearWpm.classList.remove('active');
    optionMonthWpm.classList.add('active');
    optionLastMonthWpm.classList.remove('active');
    optionLastLastMonthWpm.classList.remove('active');
  });
  
  optionLastMonthWpm.addEventListener('click', function() {
    optionYearWpm.classList.remove('active');
    optionMonthWpm.classList.remove('active');
    optionLastMonthWpm.classList.add('active');
    optionLastLastMonthWpm.classList.remove('active');
  });
  
  optionLastLastMonthWpm.addEventListener('click', function() {
    optionYearWpm.classList.remove('active');
    optionMonthWpm.classList.remove('active');
    optionLastMonthWpm.classList.remove('active');
    optionLastLastMonthWpm.classList.add('active');
  });

  const optionYearAccuracy = document.getElementById('yearAccuracy');
  const optionMonthAccuracy = document.getElementById('currentMonthAccuracy');
  const optionLastMonthAccuracy = document.getElementById('lastMonthAccuracy');
  const optionLastLastMonthAccuracy = document.getElementById('lastLastMonthAccuracy');

  optionYearAccuracy.addEventListener('click', function() {
    optionYearAccuracy.classList.add('active');
    optionMonthAccuracy.classList.remove('active');
    optionLastMonthAccuracy.classList.remove('active');
    optionLastLastMonthAccuracy.classList.remove('active');
  });

  optionMonthAccuracy.addEventListener('click', function() {
    optionYearAccuracy.classList.remove('active');
    optionMonthAccuracy.classList.add('active');
    optionLastMonthAccuracy.classList.remove('active');
    optionLastLastMonthAccuracy.classList.remove('active');
  });

  optionLastMonthAccuracy.addEventListener('click', function() {
    optionYearAccuracy.classList.remove('active');
    optionMonthAccuracy.classList.remove('active');
    optionLastMonthAccuracy.classList.add('active');
    optionLastLastMonthAccuracy.classList.remove('active');
  });

  optionLastLastMonthAccuracy.addEventListener('click', function() {
    optionYearAccuracy.classList.remove('active');
    optionMonthAccuracy.classList.remove('active');
    optionLastMonthAccuracy.classList.remove('active');
    optionLastLastMonthAccuracy.classList.add('active');
  });

  

  
  const currentDate = new Date();  // Get the current date
  const currentMonth = currentDate.getMonth();  // Get the current month (0-indexed)
  // Define an array of month names
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Compute the index of the last month (0-indexed)
  let lastMonth = currentMonth - 1;
  if (lastMonth < 0) {
    lastMonth = 11; // If the current month is January, set the last month to December
  }
  // Compute the index of the month before the last month (0-indexed)
  let lastLastMonth = lastMonth - 1;
  if (lastLastMonth < 0) {
    lastLastMonth = 11; // If the last month is January, set the month before it to December
  }
  // Set the text content of the HTML elements with the corresponding month names
  document.getElementById("currentMonthWpm").innerHTML = monthNames[currentMonth];
  document.getElementById("lastMonthWpm").innerHTML = monthNames[lastMonth];
  document.getElementById("lastLastMonthWpm").innerHTML = monthNames[lastLastMonth];

  document.getElementById("currentMonthAccuracy").innerHTML = monthNames[currentMonth];
  document.getElementById("lastMonthAccuracy").innerHTML = monthNames[lastMonth];
  document.getElementById("lastLastMonthAccuracy").innerHTML = monthNames[lastLastMonth];

  


}

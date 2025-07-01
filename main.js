const runs = [];

function getRandomColor() {
  const hue = Math.floor(Math.random() * 360); 
  return `hsl(${hue}, 70%, 70%)`; 
}

document.getElementById("runForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const distance = parseFloat(document.getElementById("distance").value);

  if (!date || !time || isNaN(distance)) return;
  
  const color = getRandomColor();
  const run = { date, time, distance, color };
  runs.push(run);

  renderRuns();
});

function calculateSpeed(distance, timeStr) {
  const [hh, mm, ss] = timeStr.split(':').map(Number);
  const timeInHours = (hh || 0) + (mm || 0) / 60 + (ss || 0) / 3600;
  return distance / timeInHours
}

document.getElementById("sortSelect").addEventListener("change", renderRuns);

function renderRuns() {
  const display = document.getElementById("trackDisplay");
  const runList = document.getElementById("runList");
  const sortBy = document.getElementById("sortSelect").value;
  display.innerHTML = "";
  runList.innerHTML = "";

  // Sort runs
  const sortedRuns = [...runs].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortBy === "time") {
      return a.time.localeCompare(b.time);
    } else if (sortBy === "distance") {
      return a.distance - b.distance;
    } else if (sortBy === "speed") {
      return calculateSpeed(a.distance, a.time) - calculateSpeed(b.distance, b.time);
    }
  });

  const centerX = 300;
  const centerY = 300;

  sortedRuns.forEach((run, index) => {
    const oval = document.createElement("div");

    const size = 100 + run.distance * 10;

    oval.classList.add("run-oval");
    oval.style.width = `${size}px`;
    oval.style.height = `${size / 2}px`;
    oval.style.position = "absolute";
    oval.style.left = `${centerX - size / 2}px`;
    oval.style.top = `${centerY - size / 4}px`;

    // Put smaller runs on top by assigning higher z-index
    oval.style.zIndex = `${sortedRuns.length - index}`;

    // Visual styles
    oval.style.border = `2px solid ${run.color}`;
    oval.style.borderRadius = "50%";
    oval.style.backgroundColor = "transparent";
    oval.title = `📅 ${run.date}\n⏱️ ${run.time}\n🏃 ${run.distance} km`;

    display.appendChild(oval);
    oval.classList.add("bounce");

    const speed = calculateSpeed(run.distance, run.time).toFixed(2);
    const entry = document.createElement("div");
    entry.className = "run-entry";
    entry.innerHTML = `
      <strong>Date:</strong> ${run.date}<br>
      <strong>Time:</strong> ${run.time}<br>
      <strong>Distance:</strong> ${run.distance} km<br>
      <strong>Speed:</strong> ${speed} km/h
      <button class="delete-btn">❌</button>
  `;
    entry.querySelector(".delete-btn").addEventListener("click", () => {
      // Remove from array
      const index = runs.findIndex(r => r.id === run.id);
      if (index !== -1) {
        runs.splice(index, 1); // Remove from data
        renderRuns(); // Re-render everything
      }
  });

  runList.appendChild(entry);
});
}
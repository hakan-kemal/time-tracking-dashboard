const timeframeDailyBtn = document.getElementById('daily');
const timeframeWeeklyBtn = document.getElementById('weekly');
const timeframeMonthlyBtn = document.getElementById('monthly');
const profileCard = document.getElementById('profile-card');

let cachedData = null;

const timeframeLabel = (key) =>
  ({ daily: 'Day', weekly: 'Week', monthly: 'Month' }[key]);

const removeExistingActivityCards = () =>
  document.querySelectorAll('.activity-card').forEach((el) => el.remove());

const createCard = (item, timeframe) => {
  const card = document.createElement('article');
  const activityClass = item.title.toLowerCase().replace(/\s+/g, '-');

  card.className = `activity-card ${activityClass}`;

  card.innerHTML = `
    <img class="activity-image"
         src="./images/icon-${activityClass}.svg"
         alt="${item.title} icon">

    <div class="activity-content">
      <div class="activity-header">
        <h3 class="activity-title">${item.title}</h3>
        <img src="./images/icon-ellipsis.svg" alt="Ellipsis icon">
      </div>

      <div class="activity-stats">
        <p class="activity-hours">${item.timeframes[timeframe].current}hrs</p>
        <p class="previous-stats">
          Last ${timeframeLabel(timeframe)} - ${
    item.timeframes[timeframe].previous
  }hrs
        </p>
      </div>
    </div>
  `;

  return card;
};

const buttons = {
  daily: timeframeDailyBtn,
  weekly: timeframeWeeklyBtn,
  monthly: timeframeMonthlyBtn,
};

const setActiveButton = (timeframe) => {
  Object.values(buttons).forEach((btn) => btn.classList.remove('active'));
  buttons[timeframe].classList.add('active');
};

const renderActivities = (data, timeframe) => {
  removeExistingActivityCards();

  for (let i = data.length - 1; i >= 0; i--) {
    const card = createCard(data[i], timeframe);
    profileCard.insertAdjacentElement('afterend', card);
  }
};

const loadTimeframe = (timeframe) => {
  const fetchData = cachedData
    ? Promise.resolve(cachedData)
    : fetch('/data.json')
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
          return res.json();
        })
        .then((json) => {
          cachedData = json;
          return json;
        });

  fetchData
    .then((data) => {
      renderActivities(data, timeframe);
      setActiveButton(timeframe);
    })
    .catch((err) =>
      console.error('Failed to load activity data from /data.json.', err)
    );
};

timeframeDailyBtn.addEventListener('click', () => loadTimeframe('daily'));
timeframeWeeklyBtn.addEventListener('click', () => loadTimeframe('weekly'));
timeframeMonthlyBtn.addEventListener('click', () => loadTimeframe('monthly'));

loadTimeframe('weekly');

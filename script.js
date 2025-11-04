
let cars = [];
let currentSort = 'name';
let searchQuery = '';
let activeFilters = {
    body: [],
    engine: []
};
let nextCarId = 5;

function showPage(pageId) {
    
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    if (pageId === 'results') {
        renderCars();
    }
}

function searchCars() {
    searchQuery = document.getElementById('searchBar').value.toLowerCase();
    renderCars();
}

function openFilterModal() {
    document.getElementById('filterModal').classList.add('active');
}

function closeFilterModal() {
    document.getElementById('filterModal').classList.remove('active');
}

function toggleFilter(type, value) {
    const index = activeFilters[type].indexOf(value);
    if (index > -1) {
        activeFilters[type].splice(index, 1);
    } else {
        activeFilters[type].push(value);
    }
    updateFilterUI();
}

function updateFilterUI() {
    document.querySelectorAll('.filter-option').forEach(option => {
        option.classList.remove('selected');
    });

    activeFilters.body.forEach(filter => {
        const option = Array.from(document.querySelectorAll('#bodyTypeFilters .filter-option'))
            .find(el => el.textContent.toLowerCase() === filter);
        if (option) option.classList.add('selected');
    });

    activeFilters.engine.forEach(filter => {
        const option = Array.from(document.querySelectorAll('#engineFilters .filter-option'))
            .find(el => el.textContent.toLowerCase().includes(filter.toLowerCase()));
        if (option) option.classList.add('selected');
    });
}

function clearFilters() {
    activeFilters = {
        body: [],
        engine: []
    };
    updateFilterUI();
}

function applyFilters() {
    closeFilterModal();
    renderCars();
}

async function renderCars() {
  const grid = document.getElementById('carGrid');
  const snapshot = await getDocs(collection(db, "cars"));
  const cars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  if (cars.length === 0) {
    grid.innerHTML = '<p style="color:#888;">No cars found.</p>';
    return;
  }

  grid.innerHTML = cars.map(car => `
    <div class="car-card" onclick="showCarDetail('${car.id}')">
      <div class="car-image">${car.name}</div>
      <div class="car-info">
        <h3>${car.name}</h3>
        <p>${car.description}</p>
        <div class="car-specs">
          <span class="spec-tag">${car.make}</span>
          <span class="spec-tag">${car.year}</span>
          <span class="spec-tag">${car.engine}</span>
          <span class="spec-tag">${car.body}</span>
        </div>
      </div>
    </div>
  `).join('');
}


function sortCars(sortType) {
    currentSort = sortType;
    renderCars();
}

function showCarDetail(carId) {
    const car = cars.find(c => c.id === carId);
    if (!car) return;

    document.getElementById('detailName').textContent = car.name;
    document.getElementById('detailImage').textContent = car.name;
    document.getElementById('detailOpinion').textContent = car.opinion;

    document.getElementById('detailSpecs').innerHTML = `
        <span class="spec-tag">${car.make}</span>
        <span class="spec-tag">${car.model}</span>
        <span class="spec-tag">${car.year}</span>
        <span class="spec-tag">${car.engine}</span>
        <span class="spec-tag">${car.body}</span>
    `;

    document.getElementById('detailResults').innerHTML = `
    <div class="result-card"><h3>0–60 mph</h3><div class="result-value">${car.zeroToSixty || '—'}</div></div>
    <div class="result-card"><h3>0–100 mph</h3><div class="result-value">${car.zeroToHundred || '—'}</div></div>
    <div class="result-card"><h3>¼ Mile</h3><div class="result-value">${car.quarterMile || '—'}</div></div>
    <div class="result-card"><h3>60–0 Braking</h3><div class="result-value">${car.braking || '—'}</div></div>
    `;


    showPage('detail');
}

// Initialize
renderCars();

async function handleSignIn(event) {
  event.preventDefault();
  const email = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('signinError');

  try {
    await signInWithEmailAndPassword(auth, email, password);
    errorDiv.textContent = '';
    alert('Signed in successfully');
    showPage('home');
  } catch (error) {
    errorDiv.textContent = 'Invalid email or password';
  }
}

// Watch for auth state changes
onAuthStateChanged(auth, (user) => {
  const submitLink = document.getElementById('submitTestLink');
  const signInLink = document.getElementById('signInLink');
  const signOutLink = document.getElementById('signOutLink');

  if (user) {
    submitLink.style.display = 'block';
    signOutLink.style.display = 'block';
    signInLink.style.display = 'none';
  } else {
    submitLink.style.display = 'none';
    signOutLink.style.display = 'none';
    signInLink.style.display = 'block';
  }
});

async function signOutUser() {
  await signOut(auth);
  alert('Signed out');
  showPage('home');
}

async function handleTestSubmit(event) {
  event.preventDefault();
  const user = auth.currentUser;
  if (!user) {
    alert('You must be signed in to submit a test.');
    return;
  }

  const newCar = {
    name: document.getElementById('carName').value,
    make: document.getElementById('make').value,
    model: document.getElementById('model').value,
    year: document.getElementById('year').value,
    engine: document.getElementById('engine').value,
    body: document.getElementById('bodyType').value,
    description: document.getElementById('description').value,
    zeroToSixty: document.getElementById('zeroToSixty').value,
    zeroToHundred: document.getElementById('zeroToHundred').value,
    quarterMile: document.getElementById('quarterMile').value,
    braking: document.getElementById('braking').value,
    opinion: document.getElementById('opinion').value
  };

  try {
    await addDoc(collection(db, "cars"), newCar);
    alert('Car test submitted successfully!');
    document.getElementById('submitTestForm').reset();
    showPage('results');
  } catch (e) {
    alert('Error submitting test: ' + e.message);
  }
}


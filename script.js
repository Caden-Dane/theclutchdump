// Sample car data
const cars = [
    {
        id: 1,
        name: "2018 Ford Mustang GT",
        make: "Ford",
        model: "Mustang",
        year: "2018",
        engine: "V8",
        body: "coupe",
        description: "Powerful American muscle with impressive straight-line performance",
        results: {
            "0-60 mph": "4.2s",
            "0-100 mph": "9.8s",
            "Quarter Mile": "12.6s @ 115mph",
            "60-0 Braking": "105ft"
        },
        opinion: "The 2018 Mustang GT delivers exceptional performance for the price. The 5.0L V8 provides thrilling acceleration and a soundtrack to match. While the independent rear suspension greatly improves handling over previous generations, it still feels more at home on the highway than a tight canyon road."
    },
    {
        id: 2,
        name: "2020 Tesla Model 3 Performance",
        make: "Tesla",
        model: "Model 3",
        year: "2020",
        engine: "Electric",
        body: "sedan",
        description: "Electric performance sedan with instant torque delivery",
        results: {
            "0-60 mph": "3.1s",
            "0-100 mph": "8.4s",
            "Quarter Mile": "11.5s @ 120mph",
            "60-0 Braking": "98ft"
        },
        opinion: "The Model 3 Performance redefines what we expect from a sports sedan. The instant torque delivery is addictive, and the handling is surprisingly nimble for a heavy EV. Track mode unlocks even more potential, making this one of the best-performing vehicles we've tested."
    },
    {
        id: 3,
        name: "2019 Chevrolet Corvette Z06",
        make: "Chevrolet",
        model: "Corvette",
        year: "2019",
        engine: "V8",
        body: "coupe",
        description: "Supercharged American supercar with track-focused performance",
        results: {
            "0-60 mph": "2.95s",
            "0-100 mph": "7.2s",
            "Quarter Mile": "10.9s @ 127mph",
            "60-0 Braking": "94ft"
        },
        opinion: "The C7 Z06 represents incredible performance value. The supercharged LT4 V8 delivers relentless power, and the chassis can handle it all. This is a legitimate supercar competitor at a fraction of the price."
    },
    {
        id: 4,
        name: "2021 Toyota GR Yaris",
        make: "Toyota",
        model: "GR Yaris",
        year: "2021",
        engine: "3-cyl",
        body: "hatchback",
        description: "Rally-bred hot hatch with all-wheel drive",
        results: {
            "0-60 mph": "5.5s",
            "0-100 mph": "14.3s",
            "Quarter Mile": "14.1s @ 98mph",
            "60-0 Braking": "108ft"
        },
        opinion: "The GR Yaris is a proper homologation special. The turbocharged three-cylinder delivers surprising punch, and the GR-Four AWD system provides incredible grip. This is a car built for the twisties, not the drag strip."
    }
];

let currentSort = 'name';
let searchQuery = '';
let activeFilters = {
    body: [],
    engine: []
};

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

function renderCars() {
    const grid = document.getElementById('carGrid');
    let filteredCars = [...cars];

    // Apply search
    if (searchQuery) {
        filteredCars = filteredCars.filter(car => 
            car.name.toLowerCase().includes(searchQuery) ||
            car.make.toLowerCase().includes(searchQuery) ||
            car.model.toLowerCase().includes(searchQuery) ||
            car.description.toLowerCase().includes(searchQuery)
        );
    }

    // Apply body type filters
    if (activeFilters.body.length > 0) {
        filteredCars = filteredCars.filter(car => 
            activeFilters.body.includes(car.body)
        );
    }

    // Apply engine filters
    if (activeFilters.engine.length > 0) {
        filteredCars = filteredCars.filter(car => 
            activeFilters.engine.includes(car.engine)
        );
    }

    // Apply sorting
    filteredCars.sort((a, b) => {
        if (currentSort === 'name') return a.name.localeCompare(b.name);
        if (currentSort === 'year') return b.year - a.year;
        if (currentSort === 'performance') {
            const aTime = parseFloat(a.results["0-60 mph"]);
            const bTime = parseFloat(b.results["0-60 mph"]);
            return aTime - bTime;
        }
        return 0;
    });

    if (filteredCars.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">No cars found matching your criteria.</p>';
        return;
    }

    grid.innerHTML = filteredCars.map(car => `
        <div class="car-card" onclick="showCarDetail(${car.id})">
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

    document.getElementById('detailResults').innerHTML = Object.entries(car.results)
        .map(([key, value]) => `
            <div class="result-card">
                <h3>${key}</h3>
                <div class="result-value">${value}</div>
            </div>
        `).join('');

    showPage('detail');
}

// Initialize
renderCars();

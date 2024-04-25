let currentIndex = 0; // Current carousel item index

function searchDrinks() {
    const searchTerm = document.getElementById('searchInput').value;
    const apiUrl = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayResults(data.drinks);
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
            document.getElementById('result').innerText = 'Error loading information';
        });
}

function displayResults(drinks) {
    const resultDiv = document.getElementById('result');
    const drinkImage = document.getElementById('drinkImage');

    if (drinks && drinks.length > 0) {
        const drink = drinks[0];
        let drinkInfo = `Name: ${drink.strDrink}\nCategory: ${drink.strCategory}\nAlcoholic: ${drink.strAlcoholic}\nGlass: ${drink.strGlass}\nIngredients:\n`;
        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`];
            if (ingredient) {
                drinkInfo += `- ${ingredient}\n`;
            }
        }
        drinkInfo += `Instructions: ${drink.strInstructions}`;
        resultDiv.innerText = drinkInfo;
        drinkImage.src = drink.strDrinkThumb;
        drinkImage.style.display = 'block';
    } else {
        resultDiv.innerText = 'No drink found with the name ' + searchTerm;
        drinkImage.style.display = 'none';
    }
}

function navigateCarousel(direction) {
  console.log('navigateCarousel called with direction:', direction); // Debugging line
  const items = document.querySelectorAll('.carousel-item');
  items[currentIndex].classList.remove('active'); // Hide current item
  currentIndex += direction;

  if (currentIndex >= items.length) {
      currentIndex = 0;
  } else if (currentIndex < 0) {
      currentIndex = items.length - 1;
  }

  items[currentIndex].classList.add('active'); // Show new item
  console.log('Current index after navigation:', currentIndex); // Debugging line
}

function setupCarousel() {
  console.log('Setting up carousel...'); // Debugging line
  const prevButton = document.querySelector('.prev');
  const nextButton = document.querySelector('.next');

  prevButton.addEventListener('click', () => navigateCarousel(-1));
  nextButton.addEventListener('click', () => navigateCarousel(1));

  const items = document.querySelectorAll('.carousel-item');
  if (items.length > 0) {
      items[currentIndex].classList.add('active');
  }
  console.log('Carousel setup complete.'); // Debugging line
}

// Make sure DOM is loaded before running setup script
if (document.readyState === 'loading') {  // Loading hasn't finished yet
  document.addEventListener('DOMContentLoaded', setupCarousel);
} else {  // `DOMContentLoaded` has already fired
  setupCarousel();
}
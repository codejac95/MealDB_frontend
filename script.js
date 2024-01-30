let searchResults = document.getElementById("searchResults");
let myRecipes = document.getElementById("myRecipes");
let searchBtn = document.getElementById("searchBtn");
let searchForm = document.getElementById("searchForm");
let searchInput = document.getElementById("searchInput");
let toggleMyRecipesBtn = document.getElementById("toggleMyRecipesBtn");
let recipeDetails = document.getElementById("recipeDetails");

function searchRecipes(query){
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
  .then(res => res.json())
  .then(data => {
    data.meals.forEach(recipe => {
      console.log(recipe)
      let ul = document.createElement("ul");
      let content= document.createElement("ul");
      content.innerText = recipe.strMeal;
      content.addEventListener("click", function () {
        displayRecipeDetails(recipe.idMeal);
    });
      ul.appendChild(content);
      searchResults.appendChild(ul);
    });
})
}
searchBtn.addEventListener("click", function () {
  let searchTerm = searchInput.value.trim();
  if (searchTerm !== "") {
    searchResults.innerHTML="";
    searchRecipes(searchTerm);
    searchInput.value="";
  }
});

toggleMyRecipesBtn.addEventListener("click", function () {
  myRecipes.style.display = (myRecipes.style.display === "none") ? "block" : "none";
});
  
function displayRecipeDetails(recipeId) {
  recipeDetails.innerHTML="";
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
  .then(res => res.json())
  .then(data => {
    let ul = document.createElement("ul")
    let name = document.createElement("h2");
   
    name.innerText = data.meals[0].strMeal;
    ul.appendChild(name);
    for(let i = 1; i<=30; i++) {
      let ingredient = data.meals[0][`strIngredient${i}`];
      let measure = data.meals[0][`strMeasure${i}`];
      if(!ingredient) {
        break;
      }       
      let content = document.createElement("ul")
      content.innerText = `${ingredient} - ${measure}`;
      ul.appendChild(content) 
    }
    recipeDetails.appendChild(ul)     
  });
}

fetch("http://localhost:8080/recipes")
.then(res => res.json())
.then(data => {
  data.forEach(myRecipe => {
    let ul = document.createElement("ul");
    let content = document.createElement("ul");
    content.innerText = myRecipe.name;
    ul.appendChild(content);
    myRecipes.appendChild(ul); 
  });
})
  
addToMyRecipesBtn.addEventListener("click", function () {
  let currentRecipeName = document.getElementById("recipeDetails").querySelector("h2").innerText;
  fetch("http://localhost:8080/recipes")
      .then(res => res.json())
      .then(data => {
        let recipeExists = data.some(recipe => recipe.name === currentRecipeName);
          if (recipeExists) {
              alert("Receptet finns redan i dina recept!");
          } else {
              fetch("http://localhost:8080/recipes/add", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                      name: currentRecipeName,
                      comment: "comment",
                  }),
              })
              .then(response => response.json())
                  alert("Tillagt recept: "+ currentRecipeName)
                  let ul = document.createElement("ul");
                  let li = document.createElement("li");
                  li.innerText = currentRecipeName;
                  ul.appendChild(li);
                  myRecipes.appendChild(ul);
              
          }
      })
});


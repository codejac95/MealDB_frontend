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
  recipeDetails.innerHTML = "";
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
    .then(res => res.json())
    .then(data => {
      let ul = document.createElement("ul");
      let name = document.createElement("h2");
      let addBtn = document.createElement("button");
      addBtn.innerText = "Lägg till recept";
      let commentForm = document.createElement("form");
      let commentInput = document.createElement("input");
      commentInput.type = "text";
      commentInput.placeholder = "Skriv din kommentar här";
      commentForm.appendChild(commentInput);

      name.innerText = data.meals[0].strMeal;
      ul.appendChild(name);
      for (let i = 1; i <= 30; i++) {
        let ingredient = data.meals[0][`strIngredient${i}`];
        let measure = data.meals[0][`strMeasure${i}`];
        if (!ingredient) {
          break;
        }
        let content = document.createElement("ul");
        content.innerText = `${ingredient} - ${measure}`;
        ul.appendChild(content);
      }
      ul.appendChild(commentForm);
      ul.appendChild(addBtn);
      recipeDetails.appendChild(ul);

      addBtn.addEventListener("click", function () {
        console.log("adds"+ recipeId)
        fetch("http://localhost:8080/recipes")
          .then(res => res.json())
          .then(data => {
            let currentComment = commentInput.value;
            let currentRecipeName = name.innerText;
            let recipeExists = data.some(recipe => recipe.name === currentRecipeName);
            if (recipeExists) {
              alert("Receptet finns redan i dina recept!");
            } else {
              alert("Tillagt recept: " + currentRecipeName);
              fetch("http://localhost:8080/recipes/add", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  name: currentRecipeName,
                  comment: currentComment
                }),
              })
               location.reload();
              
            }
          });
      });
    });
}

fetch("http://localhost:8080/recipes")
.then(res => res.json())
.then(data => {
  data.forEach(myRecipe => {
    let ul = document.createElement("ul");
    let recipeContainer = document.createElement("div");
    let content = document.createElement("span");
    content.innerText = myRecipe.name;
    recipeContainer.appendChild(content)
    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "[X]";
    deleteBtn.addEventListener("click", function () {
      deleteRecipe(myRecipe.id); 
      ul.remove(); 
    });
    recipeContainer.appendChild(deleteBtn)
    ul.appendChild(recipeContainer)
    myRecipes.appendChild(ul); 
    myRecipeDetails(content)
  });
})
function displayMyRecipeDetails(recipeId) {
  recipeDetails.innerHTML = "";
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`)
    .then(res => res.json())
    .then(data => {
      let ul = document.createElement("ul");
      let name = document.createElement("h2");
      let changeBtn = document.createElement("button");
      changeBtn.innerText = "Ändra";
      let commentForm = document.createElement("form");
      let commentInput = document.createElement("input");
      commentInput.type = "text";
      commentInput.placeholder = "Ändra din kommentar här";
      commentForm.appendChild(commentInput);

      name.innerText = data.meals[0].strMeal;
      ul.appendChild(name);
      for (let i = 1; i <= 30; i++) {
        let ingredient = data.meals[0][`strIngredient${i}`];
        let measure = data.meals[0][`strMeasure${i}`];
        if (!ingredient) {
          break;
        }
        let content = document.createElement("ul");
        content.innerText = `${ingredient} - ${measure}`;
        ul.appendChild(content);
      }     
      ul.appendChild(commentForm);
      ul.appendChild(changeBtn);
      recipeDetails.appendChild(ul);

      changeBtn.addEventListener("click", function () {
        fetch("http://localhost:8080/recipes")
          .then(res => res.json())
          .then (data => {
            data.forEach (myRecipe => {
            let currentComment = commentInput.value;
            updateRecipe(myRecipe.id, currentComment);
            })
            
          })          
      });
    });   
}
  
function myRecipeDetails(myRecipe) {
  myRecipe.addEventListener("click", function () {
    let recipeName = myRecipe.innerText;
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${recipeName}`)
      .then(res => res.json())
      .then(data => {
        let recipeId = data.meals[0].idMeal;
        displayMyRecipeDetails(recipeId);
      });
  });
}
function deleteRecipe(recipeId) {
  console.log(recipeId)
  fetch(`http://localhost:8080/recipes/delete/${recipeId}`, {
    method: "DELETE",
  })
}
function updateRecipe(recipeId, currentComment) {
  console.log("id: "+recipeId)
  console.log("kommentar: " +currentComment)
  console.log(recipeId)
  fetch(`http://localhost:8080/recipes/update/${recipeId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      comment: currentComment,
    }),
  })

}
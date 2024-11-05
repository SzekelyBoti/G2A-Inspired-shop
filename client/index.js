const page = window.location.href;
const adminPW = "asd";
let shoppingCart = [];
let isEditFormActive = false;

document.addEventListener("DOMContentLoaded", () => {
  if (page === "http://localhost:8000/") {
    main();
  }

  if (page === "http://localhost:8000/admin") {
    const loginForm = document.createElement("form");
    loginForm.setAttribute("id", "loginDiv");
    loginForm.innerHTML = `
    <p class="hidden red" id="wrongPW">Wrong Password!</p>
    <label for="pwText"><h1>Admin Login:</h1></label>
    <input type="password" id="pwText" name="pwText" placeholder="Enter password" required/>
    <button id="loginButton" type="submit">Login</button>
    `;
    document.body.appendChild(loginForm);
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const currentPW = document.getElementById("pwText").value;
      const wrongPassword = document.getElementById("wrongPW");
      if (currentPW == adminPW) {
        wrongPassword.textContent = "Successfully logged in";
        wrongPassword.classList.remove("hidden");
        wrongPassword.classList.remove("red");
        wrongPassword.classList.add("visible");
        wrongPassword.classList.add("green");
        setTimeout(() => {
          wrongPassword.classList.remove("visible");
          wrongPassword.classList.add("hidden");
        }, 1500);
        setTimeout(() => {
          const loginButton = document.getElementById("login");
          const newButton = document.getElementById("createNew");
          newButton.style.display = "block";
          setTimeout(() => {
            newButton.classList.remove("hidden");
            newButton.classList.add("visible");
          }, 500);

          loginButton.textContent = "Logout";
          loginButton.setAttribute("id", "logout");
          loginForm.remove();

          main();
          setTimeout(() => {
            const toRemove = document.querySelectorAll(".gameCart");
            toRemove.forEach((element) => {
              element.parentNode.removeChild(element);
            });
          }, 50);
        }, 2000);
      } else {
        wrongPassword.classList.remove("hidden");
        wrongPassword.classList.add("visible");
        setTimeout(() => {
          wrongPassword.classList.remove("visible");
          wrongPassword.classList.add("hidden");
        }, 1500);
      }
    });
  }
});

document.addEventListener("click", (event) => {
  const gameContainer = document.getElementById("gameContainer");

  if (event.target.id === "navLogo") {
    window.location.href = "http://localhost:8000/";
    gameContainer.innerHTML = "";
  }

  if (event.target.id === "login") {
    window.location.replace("http://localhost:8000/admin");
    gameContainer.innerHTML = "";
  }

  if (event.target.id === "logout") {
    window.location.replace("http://localhost:8000/");
  }

  if (event.target.id === "editButton") {
    const gameId = event.target.closest(".card").id;
    quickEditDetails(gameId);
  }

  if (event.target.id === "createNew") {
    addGame();
  }

  if (event.target.id === "cart") {
    addGameToCart(event.target.closest(".card").id);
  }

  if (event.target.id === "shopCart") {
    if (page === "http://localhost:8000/admin") {
      alert(
        "You are logged in as an Admin, there can't be anything in your cart"
      );
      return;
    }

    if (shoppingCart.length === 0) {
      alert("You're shopping cart is empty");
      return;
    }

    localStorage.setItem("cart", JSON.stringify(shoppingCart));
    window.location.replace("http://localhost:8000/cart");
  }
});

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const gameHTML = (game) => {
  let htmlContent = `
  <div class="card" id="${game.id}" onclick="toggleCardScale(this)" ondblclick="fadeInCard(this)">
    <img class="gameImage" src="${game.image}" alt="${game.title}"></img>
    <div class="gameName" id="gameName">${game.name}</div>
    <div class="gameGenre" id="gameGenre">${game.genre}</div>
  <div class="container1">
    <div class="gamePrice" id="gamePrice">$ ${game.price}</div><span id="cart" class="gameCart">🛒</span>
    <div class="gameQuantity" id="gameQuantity"><span class="red">${game.quantity}</span> LEFT FOR SALE</div>`;
  if (page === "http://localhost:8000/admin") {
    htmlContent += `<div id="editButton">Edit</div></div></div> `;
    return htmlContent;
  } else {
    htmlContent += `</div></div>`;
  }
  return htmlContent;
};

const renderGames = (games) => {
  const gameContainer = document.getElementById("gameContainer");
  games.forEach((game) => {
    gameContainer.insertAdjacentHTML("beforeend", gameHTML(game));
  });
};

const addGame = async () => {
  const bigBoy = document.getElementById("expandedCard");
  const adminEdit = document.getElementById("adminEdit");
  const adminDelete = document.getElementById("adminDelete");

  const existingEscapeDiv = document.querySelector(".escapeDiv");
  const existingForm = document.querySelector(".newForm");
  if (existingEscapeDiv) {
    existingEscapeDiv.removeEventListener("click", escapeDivClickHandler);
    existingForm.removeEventListener("submit", submitFormHandler);
  }

  const newEscapeDiv = document.createElement("div");
  newEscapeDiv.classList.add("escapeDiv");
  newEscapeDiv.textContent = "x";
  bigBoy.appendChild(newEscapeDiv);

  if (adminEdit) {
    adminEdit.remove();
  }
  if (adminDelete) {
    adminDelete.remove();
  }
  bigBoy.style.display = "block";
  bigBoy.classList.remove("hidden");
  bigBoy.classList.add("visible");

  const newGameForm = document.createElement("form");
  //newGameForm.classList.add("newForm");
  newGameForm.innerHTML = `
    <label for="newName">Name:</label>
    <input type="text" id="newName" name="newName" required><br><br>
    
    <label for="newGenre">Genre:</label>
    <input type="text" id="newGenre" name="newGenre" required><br><br>
    
    <label for="newPrice">Price:</label>
    <input type="text" id="newPrice" name="newPrice" required><br><br>
    
    <label for="newQuantity">Quantity:</label>
    <input type="text" id="newQuantity" name="newQuantity" required><br><br>
    
    <label for="newRelease">Release Date:</label>
    <input type="text" id="newRelease" name="newRelease" required><br><br>
    
    <label for="newDescription">Description:</label>
    <input type="text" id="newDescription" name="newDescription" required><br><br>
    
    <label for="newDev">Developer:</label>
    <input type="text" id="newDev" name="newDev" required><br><br>
    
    <label for="newImg">Image:</label>
    <input type="text" id="newImg" name="newImg" required><br><br>
    
    <button type="submit">Add Game</button><span id="submitButton"></span>
    `;

  bigBoy.appendChild(newGameForm);

  const escapeDivClickHandler = (event) => {
    console.log("x-pressed");
    bigBoy.classList.remove("visible");
    bigBoy.classList.add("hidden");
    newGameForm.remove();
    newEscapeDiv.remove();

    setTimeout(() => {
      bigBoy.style.display = "none";
    }, 600);
  };

  const submitFormHandler = async (event) => {
    event.preventDefault();
    const newGame = {
      name: document.getElementById("newName").value,
      genre: document.getElementById("newGenre").value,
      price: document.getElementById("newPrice").value,
      quantity: document.getElementById("newQuantity").value,
      release_date: document.getElementById("newRelease").value,
      description: document.getElementById("newDescription").value,
      developer: document.getElementById("newDev").value,
      image: document.getElementById("newImg").value,
    };

    try {
      const postResponse = await fetch("http://localhost:8000/shop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGame),
      });

      if (postResponse.ok) {
        main();
      } else {
        console.error("Failed to create new game:", postResponse.statusText);
      }
    } catch (error) {
      console.error("Error creating new game:", error.message);
    }
  };
  newEscapeDiv.addEventListener("click", escapeDivClickHandler);
  newGameForm.addEventListener("submit", submitFormHandler);
};

const editGame = async (gameId, bigBoy) => {
  const gameName = bigBoy.querySelector(".bigName");
  const gameGenre = bigBoy.querySelector(".bigGenre");
  const gamePrice = bigBoy.querySelector(".bigPrice");
  const gameQuantity = bigBoy.querySelector(".bigQuantity");
  const gameRelease = bigBoy.querySelector(".bigRelease");
  const gameDescription = bigBoy.querySelector(".bigDescription");
  const gameDeveloper = bigBoy.querySelector(".bigDeveloper");
  const gameImage = bigBoy.querySelector(".bigImage");

  const originalName = gameName.textContent;
  const originalGenre = gameGenre.textContent;
  const originalPrice = gamePrice.textContent;
  const originalQuantity = gameQuantity.textContent;
  const originalRelease = gameRelease.textContent;
  const originalDescription = gameDescription.textContent;
  const originalDeveloper = gameDeveloper.textContent;
  const originalImage = gameImage.src;

  gameName.innerHTML = `<input type="text" id="gameNameInput" value="${originalName}">`;
  gameGenre.innerHTML = `<input type="text" id="gameGenreInput" value="${originalGenre}">`;
  gamePrice.innerHTML = `<input type="text" id="gamePriceInput" value="${originalPrice.replace(
    "$ ",
    ""
  )}">`;
  gameQuantity.innerHTML = `<input type="text" id="gameQuantityInput" value="${originalQuantity.replace(
    " LEFT FOR SALE",
    ""
  )}">`;
  gameRelease.innerHTML = `<input type="text" id="gameReleaseInput" value="${originalRelease}">`;
  gameDescription.innerHTML = `<textarea id="gameDescriptionInput" rows="6" cols="70">${originalDescription}</textarea>`;
  gameDeveloper.innerHTML = `<input type="text" id="gameDeveloperInput" cols="70" value="${originalDeveloper}">`;
  gameDescription.insertAdjacentHTML(
    "beforeend",
    `<br><textarea id="imageInput" rows="2" cols="70">${originalImage}</textarea>`
  );

  const inputs = bigBoy.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("keypress", async (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const updatedGame = {
          name: document.getElementById("gameNameInput").value,
          genre: document.getElementById("gameGenreInput").value,
          price: document.getElementById("gamePriceInput").value,
          quantity: document.getElementById("gameQuantityInput").value,
          release: document.getElementById("gameReleaseInput").value,
          description: document.getElementById("gameDescriptionInput").value,
          developer: document.getElementById("gameDeveloperInput").value,
          image:
            document.getElementById("imageInput").value ||
            "https://http.cat/images/102.jpg",
        };

        try {
          const response = await fetch(`http://localhost:8000/shop/${gameId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedGame),
          });

          const data = await response.json();
          if (response.ok) {
            gameName.textContent = updatedGame.name;
            gameGenre.textContent = updatedGame.genre;
            gamePrice.textContent = `$ ${updatedGame.price}`;
            gameQuantity.innerHTML = `<span class="red">${updatedGame.quantity}</span> LEFT FOR SALE`;
            gameRelease.innerHTML = updatedGame.release;
            gameDescription.innerHTML = updatedGame.description;
            gameDeveloper.innerHTML = updatedGame.developer;
            gameImage.src = updatedGame.image;
          } else {
            console.error("Error updating game details:", data.error);
          }
        } catch (error) {
          console.error("Error updating game details:", error);
        }
      }
    });
  });
};

async function deleteGame(gameId, bigBoy) {
  try {
    const response = await fetch(`http://localhost:8000/shop/${gameId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const bigDeleted = document.createElement("div");
      bigDeleted.classList.add("bigName");
      bigDeleted.textContent = "Successfully deleted the game";
      bigBoy.appendChild(bigDeleted);
      setTimeout(() => {
        bigBoy.classList.remove("visible");
        bigBoy.classList.add("hidden");
      }, 1500);
      setTimeout(() => {
        const gameContainer = document.getElementById("gameContainer");
        gameContainer.innerHTML = "";
        bigBoy.style.display = "none";
        main();
      }, 2500);
    } else {
      console.error("Failed to delete game:", response.statusText);
    }
  } catch (error) {
    console.error("Error deleting game:", error.message);
  }
}

const main = async () => {
  const gameContainer = document.getElementById("gameContainer");
  if (!gameContainer) {
    console.error("gameContainer element not found");
    return;
  }
  gameContainer.innerHTML = "";

  try {
    const games = await fetchData("http://localhost:8000/api/shop");
    if (games) {
      renderGames(games);
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

const quickEditDetails = async (gameId) => {
  isEditFormActive = true;
  const gameCard = document.getElementById(gameId);
  const gameName = gameCard.querySelector(".gameName");
  const gameGenre = gameCard.querySelector(".gameGenre");
  const gamePrice = gameCard.querySelector(".gamePrice");
  const gameQuantity = gameCard.querySelector(".gameQuantity");

  const originalName = gameName.textContent;
  const originalGenre = gameGenre.textContent;
  const originalPrice = gamePrice.textContent;
  const originalQuantity = gameQuantity.textContent;

  gameName.innerHTML = `<input type="text" id="gameNameInput" value="${originalName}">`;
  gameGenre.innerHTML = `<input type="text" id="gameGenreInput" value="${originalGenre}">`;
  gamePrice.innerHTML = `<input type="text" id="gamePriceInput" value="${originalPrice.replace(
    "$ ",
    ""
  )}">`;
  gameQuantity.innerHTML = `<input type="text" id="gameQuantityInput" value="${originalQuantity.replace(
    " LEFT FOR SALE",
    ""
  )}">`;

  const inputs = gameCard.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("keypress", async (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const updatedGame = {
          name: document.getElementById("gameNameInput").value,
          genre: document.getElementById("gameGenreInput").value,
          price: document.getElementById("gamePriceInput").value,
          quantity: document.getElementById("gameQuantityInput").value,
        };

        try {
          const response = await fetch(`http://localhost:8000/shop/${gameId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedGame),
          });

          const data = await response.json();
          if (response.ok) {
            gameName.textContent = updatedGame.name;
            gameGenre.textContent = updatedGame.genre;
            gamePrice.textContent = `$ ${updatedGame.price}`;
            gameQuantity.innerHTML = `<span class="red">${updatedGame.quantity}</span> LEFT FOR SALE`;
            isEditFormActive = false;
          } else {
            console.error("Error updating game details:", data.error);
          }
        } catch (error) {
          console.error("Error updating game details:", error);
        }
      }
    });
  });
};

function toggleCardScale(card) {
  if (!isEditFormActive) {
    card.classList.toggle("big-scale");
  }
}

async function fadeInCard(card) {
  const bigBoy = document.getElementById("expandedCard");
  bigBoy.innerHTML = "";
  const newEscapeDiv = document.createElement("div");
  newEscapeDiv.classList.add("escapeDiv");
  newEscapeDiv.textContent = "x";

  bigBoy.style.display = "block";
  setTimeout(() => {
    bigBoy.classList.remove("hidden");
    bigBoy.classList.add("visible");
  }, 100);

  bigBoy.appendChild(newEscapeDiv);

  const currentGame = await fetchGame(parseInt(card.id));
  const img = document.createElement("img");
  img.classList.add("bigImage");
  img.src = currentGame.image;
  img.alt = currentGame.title;
  bigBoy.appendChild(img);

  const bigName = document.createElement("div");
  bigName.classList.add("bigName");
  bigName.textContent = currentGame.name;
  bigBoy.appendChild(bigName);

  const bigGenre = document.createElement("div");
  bigGenre.classList.add("bigGenre");
  bigGenre.textContent = currentGame.genre;
  bigBoy.appendChild(bigGenre);

  const bigPrice = document.createElement("div");
  bigPrice.classList.add("bigPrice");
  bigPrice.textContent = `$ ${currentGame.price}`;
  bigBoy.appendChild(bigPrice);

  const bigQuantity = document.createElement("div");
  bigQuantity.classList.add("bigQuantity");
  bigQuantity.innerHTML = `<span class="red">${currentGame.quantity}</span> LEFT FOR SALE`;
  bigBoy.appendChild(bigQuantity);

  const bigRelease = document.createElement("div");
  bigRelease.classList.add("bigRelease");
  bigRelease.textContent = currentGame.release_date;
  bigBoy.appendChild(bigRelease);

  const bigDescription = document.createElement("div");
  bigDescription.classList.add("bigDescription");
  bigDescription.textContent = currentGame.description;
  bigBoy.appendChild(bigDescription);

  const bigDeveloper = document.createElement("div");
  bigDeveloper.classList.add("bigDeveloper");
  bigDeveloper.textContent = currentGame.developer;
  bigBoy.appendChild(bigDeveloper);

  const addToCart = document.createElement("div");
  addToCart.classList.add("addToCart");
  addToCart.id = "bigAddToCart";
  addToCart.textContent = "Add to cart";
  bigBoy.appendChild(addToCart);
  addToCart.addEventListener(
    "click",
    addToCart.addEventListener("click", () => addGameToCart(currentGame.id))
  );

  if (page === "http://localhost:8000/admin") {
    const adminEdit = document.createElement("div");
    adminEdit.classList.add("adminEdit");
    adminEdit.id = "adminEdit";
    adminEdit.textContent = "Edit Content";
    bigBoy.appendChild(adminEdit);
    adminEdit.addEventListener("click", (event) => {
      console.log("click");
      editGame(card.id, bigBoy);
    });

    const adminDelete = document.createElement("div");
    adminDelete.classList.add("adminDelete");
    adminDelete.id = "adminDelete";
    adminDelete.textContent = "Delete";
    bigBoy.appendChild(adminDelete);
    adminDelete.addEventListener("click", (event) => {
      deleteGame(card.id, bigBoy);
    });

    const addToCart = document.getElementById("bigAddToCart");
    addToCart.remove();
  }

  newEscapeDiv.addEventListener("click", (event) => {
    bigBoy.classList.remove("visible");
    bigBoy.classList.add("hidden");
    img.remove();
    bigName.remove();
    bigGenre.remove();
    bigPrice.remove();
    bigQuantity.remove();
    bigRelease.remove();
    bigDescription.remove();
    bigDeveloper.remove();
    addToCart.remove();

    setTimeout(() => {
      bigBoy.style.display = "none";
      newEscapeDiv.remove();
    }, 600);
  });
}

async function fetchGame(id) {
  try {
    const response = await fetch("http://localhost:8000/shop/" + id);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

const addGameToCart = async (gameId) => {
  try {
    const response = await fetch("http://localhost:8000/shop/" + gameId);
    const game = await response.json();
    if (!shoppingCart.some((item) => item.id === game.id)) {
      const gameContainer = document.getElementById("gameContainer");
      gameContainer.insertAdjacentHTML(
        "afterbegin",
        `<h1 class="notif hidden" id="notif">You added <span class=green>${game.name}</span> to your cart</h1>`
      );
      const notif = document.getElementById("notif");
      setTimeout(() => {
        notif.classList.remove("hidden");
        notif.classList.add("visible");
      }, 200);
      setTimeout(() => {
        notif.classList.remove("visible");
        notif.classList.add("hidden");
      }, 1500);

      shoppingCart.push({
        id: game.id,
        name: game.name,
        image: game.image,
        price: game.price,
        quantity: game.quantity,
      });
      const cartNotif = document.getElementById("shopElement");
      cartNotif.textContent = shoppingCart.length;
      if (shoppingCart.length > 0) {
        cartNotif.classList.remove("hidden");
        cartNotif.classList.add("visible");
      }
    } else {
      const gameContainer = document.getElementById("gameContainer");
      gameContainer.insertAdjacentHTML(
        "afterbegin",
        `<h1 class="notif hidden" id="notif">You removed <span class=red>${game.name}</span> from your cart</h1>`
      );
      const notif = document.getElementById("notif");
      setTimeout(() => {
        notif.classList.remove("hidden");
        notif.classList.add("visible");
      }, 200);
      setTimeout(() => {
        notif.classList.remove("visible");
        notif.classList.add("hidden");
      }, 1500);
      shoppingCart = shoppingCart.filter((item) => item.id !== game.id);
      const cartNotif = document.getElementById("shopElement");
      cartNotif.textContent = shoppingCart.length;
      if (shoppingCart.length <= 0) {
        cartNotif.classList.remove("visible");
        cartNotif.classList.add("hidden");
      }
    }
  } catch (error) {
    console.error(error);
  }
};

window.onload = function () {
  if (window.location.href === "http://localhost:8000/cart") {
    let totalPrice = 0;

    const savedCart = localStorage.getItem("cart");
    const currentCart = JSON.parse(savedCart);

    const cartContainer = document.createElement("div");
    cartContainer.classList.add("cartContainer");

    const cartItemsContainer = document.createElement("div");
    cartItemsContainer.id = "cartItems";

    const totalPriceContainer = document.createElement("div");
    totalPriceContainer.classList.add("totalPrice");
    totalPriceContainer.innerHTML =
      "Total Price: $<span id='totalPrice'>0</span>";

    const checkoutButton = document.createElement("div");
    checkoutButton.classList.add("checkoutButton");
    checkoutButton.textContent = "Checkout";

    cartContainer.appendChild(cartItemsContainer);
    cartContainer.appendChild(totalPriceContainer);
    cartContainer.appendChild(checkoutButton);
    document.body.appendChild(cartContainer);

    currentCart.forEach((element) => {
      const cartItemDiv = document.createElement("div");
      cartItemDiv.classList.add("cartItem");
      cartItemDiv.dataset.gameId = element.id;

      const gameImg = document.createElement("img");
      gameImg.src = element.image;
      cartItemDiv.appendChild(gameImg);

      const gameName = document.createElement("div");
      gameName.textContent = element.name;
      gameName.id = "cartGameName";
      cartItemDiv.appendChild(gameName);

      const quantityInput = document.createElement("input");
      quantityInput.classList.add("quantity");
      quantityInput.type = "number";
      quantityInput.value = 1;
      quantityInput.min = 1;
      quantityInput.addEventListener("change", updateCartItemPrice);
      cartItemDiv.appendChild(quantityInput);

      const gamePrice = document.createElement("div");
      gamePrice.textContent = `$${element.price}`;
      gamePrice.dataset.unitPrice = element.price;
      cartItemDiv.appendChild(gamePrice);

      const deleteIcon = document.createElement("div");
      deleteIcon.innerHTML = "🗑";
      deleteIcon.classList.add("deleteIcon");
      deleteIcon.addEventListener("click", () =>
        removeCartItem(element, currentCart)
      );
      cartItemDiv.appendChild(deleteIcon);

      cartItemsContainer.appendChild(cartItemDiv);

      totalPrice += element.price;
    });

    updateTotalPrice();

    checkoutButton.addEventListener("click", async () => {
      const cartItems = document.querySelectorAll(".cartItem");
      let appeared = false;
      try {
        for (const cartItem of cartItems) {
          const gameId = cartItem.dataset.gameId;
          const userQuantityInput = cartItem.querySelector(".quantity");
          const userQuantity = parseInt(userQuantityInput.value);
          const game = currentCart.find((item) => item.id === parseInt(gameId));
          game.userQuantity = userQuantity;

          const totalQuantity = parseInt(game.quantity);

          if (userQuantity > totalQuantity) {
            console.error(
              `Requested quantity for game ${gameId} exceeds available quantity.`
            );
            continue;
          }

          const updatedGame = {
            quantity: totalQuantity - userQuantity,
          };

          const response = await fetch(`http://localhost:8000/shop/${gameId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedGame),
          });

          if (response.ok) {
            if (!appeared) {
              cartContainer.insertAdjacentHTML(
                "beforebegin",
                `
            <div id="thank" class="thank hidden">🎉 Thank you for your purchase 🎉</div>
            `
              );
              const thank = document.getElementById("thank");
              cartContainer.appendChild(thank);
              setTimeout(() => {
                thank.classList.remove("hidden");
                thank.classList.add("visible");
              }, 150);

              setTimeout(() => {
                cartContainer.classList.remove("visible");
                cartContainer.classList.add("hidden");
              }, 1500);
              appeared = true;

              setTimeout(() => {
                cartContainer.innerHTML = "";
                afterCheckout(currentCart);
              }, 2500);
            }
          } else {
            console.error(`Failed to update quantity for game ${gameId}.`);
          }
        }
      } catch (error) {
        console.error("Error updating quantities:", error);
      }
    });
  }
};

function updateCartItemPrice(event) {
  const quantity = event.target.value;
  const priceElement =
    event.target.parentElement.querySelector("div:nth-child(4)");
  const unitPrice = parseFloat(priceElement.dataset.unitPrice);
  const previousQuantity = parseInt(event.target.dataset.previousValue) || 1;

  const priceDifference = unitPrice * (quantity - previousQuantity);
  const newPrice =
    parseFloat(priceElement.textContent.slice(1)) + priceDifference;
  priceElement.textContent = `$${newPrice.toFixed(2)}`;

  event.target.dataset.previousValue = quantity;

  updateTotalPrice();
}

function updateTotalPrice() {
  const totalPriceElement = document.getElementById("totalPrice");
  const cartItems = document.querySelectorAll(".cartItem");

  let totalPrice = 0;
  cartItems.forEach((item) => {
    const price = parseFloat(
      item.querySelector("div:nth-child(4)").textContent.slice(1)
    );
    totalPrice += price;
  });

  totalPriceElement.textContent = totalPrice.toFixed(2);
}

function removeCartItem(item, cart) {
  const cartItemsContainer = document.getElementById("cartItems");
  const cartItems = cartItemsContainer.querySelectorAll(".cartItem");

  cartItems.forEach((cartItem, index) => {
    const itemName = cartItem.querySelector("div:nth-child(2)").textContent;
    if (itemName === item.name) {
      cartItemsContainer.removeChild(cartItem);
      cart.splice(index, 1);
      updateTotalPrice();
    }
  });
}

function afterCheckout(cart) {
  const container = document.createElement("div");
  container.id = "keyContainer";
  container.classList.add("keyGrid", "hidden");

  cart.forEach((e) => {
    const keyItem = document.createElement("div");
    keyItem.id = "keyItem";
    keyItem.innerHTML = `
      <img id="keyImg" src="${e.image}"/>
      <h1 id="keyName">${e.name}</h1>
      <div class="showKeysContainer">
        <div class="showKeys">Show Keys</div>
        <div class="keysList">${generateRandomString(e.userQuantity).join(
          "<hr><br>"
        )}</div>
      </div> 
    `;

    keyItem.classList.add("keyItem");
    container.appendChild(keyItem);
  });

  document.body.appendChild(container);

  setTimeout(() => {
    container.classList.remove("hidden");
    container.classList.add("visible");
  }, 1000);

  const showKeysButtons = document.querySelectorAll(".showKeys");
  showKeysButtons.forEach((button) => {
    let isAnimating = false;
    button.addEventListener("click", () => {
      if (!isAnimating) {
        isAnimating = true;
        const keysList = button.nextElementSibling;
        keysList.classList.toggle("visible");
        keysList.addEventListener("transitionend", () => {
          isAnimating = false;
        });
      }
    });
  });
}

function generateRandomPart(length, chance) {
  const alphabet = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  let part = "";
  for (let i = 0; i < length; i++) {
    const random = Math.random();
    if (random < chance) {
      part += Math.floor(Math.random() * 10);
    } else {
      const randomLetter =
        alphabet[Math.floor(Math.random() * alphabet.length)].toUpperCase();
      part += randomLetter;
    }
  }
  return part;
}

function generateRandomString(n) {
  const randomStrings = [];
  for (let i = 0; i < n; i++) {
    const partA = generateRandomPart(5, 0.5);
    const partB = generateRandomPart(5, 0.5);
    const partC = generateRandomPart(5, 0.5);
    const partD = generateRandomPart(5, 0.5);
    const partE = generateRandomPart(5, 0.5);
    const randomString = `${partA}-${partB}-${partC}-${partD}-${partE}`;
    randomStrings.push(randomString);
  }
  return randomStrings;
}

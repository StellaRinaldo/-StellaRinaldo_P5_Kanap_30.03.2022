//Récupérer les produits depuis le local storage

let productStorage = JSON.parse(localStorage.getItem("product"));
console.log("cart", productStorage);

//Organiser chaque élements dans une fonction avec pour paramètre "item"
productStorage.forEach(item => displayItem(item))

/*const orderButton = document.querySelector("#order")
orderButton.addEventListener("click", (e) => submitForm(e))

//

/*retrieveItemsFromCache()
function retrieveItemsFromCache() {//Récupère le panier depuis le local storage

    const fullCart = productStorage.length;
    for (let i = 0; i > fullCart; i++) {
        const item = productStorage[i]; //récupération de l'item présent dans le panier
        
    }

}*/


function displayItem(item) {//Affiche les parties principales créées dans les différentes fonctions
    const article = createArticle(item)
    const div = createImageDiv(item)
    article.appendChild(div)


    const cartItemContent = createCartContent(item)
    article.appendChild(cartItemContent)
    displayArticle(article)

    displayTotalQuantity()
    displayTotalPrice()
}


function createArticle(item) {//Crée la balise "article" dans le HTML
    const article = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.idProduct
    article.dataset.color = item.color

    return article
}


function displayArticle(article) {//Situe la balise "article" dans le HTML
    document.querySelector("#cart__items").appendChild(article)
}


function createImageDiv(item) {//Crée la zone où placer l'image du produit avec son texte alternatif
    const div = document.createElement("div")
    div.classList.add("cart__item__img")

    const image = document.createElement("img")
    image.src = item.imageUrl
    image.alt = item.altTxt
    div.appendChild(image)
    return div
}


function createCartContent(item) {//Crée la zone contenant les détails du produit

    const div = document.createElement("div")
    div.classList.add("cart__item__content")
    const description = createDescription(div, item)
    const settings = createSettings(item)
    div.appendChild(description)
    div.appendChild(settings)
    return div
}

function createDescription(div, item) {//Crée la description du produit en générant son nom, sa couleur et son prix

    const description = document.createElement("div")
    description.classList.add("cart__item__content__description")

    const h2 = document.createElement("h2")
    h2.textContent = item.productName
    const p = document.createElement("p")
    p.textContent = item.color

    const p2 = document.createElement("p")

    fetch('http://localhost:3000/api/products/' + item.idProduct)//Récupère les infos d'un produit à partir de son id pour en extraire son prix
        .then((resp) => resp.json())
        .then(function (data) {
            p2.innerHTML = data.price + ' €';

        })

        .catch(function (error) {
            console.log(error);
        })

    description.appendChild(h2)
    description.appendChild(p)
    description.appendChild(p2)
    div.appendChild(description)

    return description

}

function createSettings(item) {//Crée la zone de paramètres de chaque article (au sujet de la quantité et de la suppression)
    const divSettings = document.createElement("div")
    divSettings.classList.add("cart__item__content__settings")
    divSettings.appendChild(addQuantityToSettings(item))
    divSettings.appendChild(createDeleteSettings(item))

    return divSettings
}


function addQuantityToSettings(item) {//Affiche la quantité

    const divQuantity = document.createElement("div")
    divQuantity.classList.add("cart__item__content__settings__quantity")

    const pQuantity = document.createElement("p")
    divQuantity.appendChild(pQuantity)
    pQuantity.textContent = "Qté : "

    const inputQuantity = document.createElement("input")
    divQuantity.appendChild(inputQuantity)
    inputQuantity.setAttribute("type", "number")
    inputQuantity.setAttribute("name", "itemQuantity")
    inputQuantity.setAttribute("min", "1")
    inputQuantity.setAttribute("max", "100")
    inputQuantity.setAttribute("value", item.quantity)
    inputQuantity.classList.add("itemQuantity")

    inputQuantity.addEventListener("change", () => changeQuantity(item.idProduct, inputQuantity.value))

    return divQuantity
}


function changeQuantity(idSelect, newValue) {//Ajoute la possibilité de changer la quantité directement depuis la page panier

    const itemSelect = productStorage.find(item => item.idProduct === idSelect)
    itemSelect.quantity = Number(newValue)
    console.log(itemSelect);


    return itemSelect
}


function displayTotalQuantity() { //A FAIRE : AFFICHER LE NOMBRE TOTAL D'ARTICLES

    let itemQuantity = document.getElementsByName("itemQuantity")
    //console.log("quantity", itemQuantity);

    let totalQuantity = 0
    for (let i = 0; i < itemQuantity.length; i++) {

        totalQuantity += itemQuantity[i].valueAsNumber//valueAsNumber renvoi à l'élément présent dans le console.log de itemQuantity("NodeList")
        //Il y a deux termes pour la valeur : "value" qui est en format string et "valueAsNumber" qui est au format "Number"
        //console.log(itemQuantity)
    }

    const total = document.getElementById('totalQuantity')
    total.textContent = totalQuantity
    //console.log("quantity", totalQuantity);
}

async function displayTotalPrice() {
    let totalPrice = 0
    let itemQuantity = document.getElementsByName("itemQuantity")
    for (let i = 0; i < itemQuantity.length; i++) {

        let price = await fetch('http://localhost:3000/api/products/' + productStorage[i].idProduct)//Récupère les infos d'un produit à partir de son id pour en extraire son prix

            .then((resp) => resp.json())
            .then(function (data) {

                return data.price

            })

        totalPrice += price * itemQuantity[i].valueAsNumber// itemQuantity de la boucle for num2


    }
    const finalTotal = document.getElementById('totalPrice')
    finalTotal.textContent = totalPrice
    console.log("total", totalPrice);
}


function createDeleteSettings(item) {//A FAIRE : Créer le bouton "supprimer"

    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings__delete")

    const pDelete = document.createElement("p")
    div.appendChild(pDelete)
    pDelete.classList.add("deleteItem")
    pDelete.textContent = "Supprimer"

    return div
}

function addDeleteFunction() {

    let deleteItem = document.getElementsByClassName("deleteItem")

    for (let i = 0; i < deleteItem.length; i++) {//parcours les produits avec les boutons "supprimer"

        deleteItem[i].addEventListener('click', () => {

            let productSelect = productStorage[i]
            productStorage = productStorage.filter(element => element.idProduct !== productSelect.idProduct && element.color !== productSelect.color)//filter = extraire
            localStorage.setItem("product", JSON.stringify(productStorage));
            if (productStorage.lenght === 0) {

                localStorage.removeItem("product")
            }
            location.reload();//permet de recharger la page avec le nouveau panier après suppression de produit sélectionné
        })
    }

    //console.log("storage", productStorage);


}
addDeleteFunction()


//REPRENDRE TOUT A PARTIR DE LA (sans oublier la contante avec le bouton "order" en haut), AVEC LA VIDEO NUMERO 24

/*function submitForm(e) {
    //alert ("Formulaire envoyé !")
    e.preventDefault()
    if (productStorage.length === 0) alert("Veuillez remplir votre panier")
    const form = document.querySelector(".cart__order__form")
    const body = createRequestBody()

    fetch("http://localhost:3000/api/products/order", {

        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((res) => res.json())
        .then((data) => console.log(data))

    //console.log(form.elements)
}

function createRequestBody() {

    const body = {
        contact: {
            firstName: "test",
            lasttName: "test",
            adress: "test",
            city: "test",
            email: "test",
        },
        products: ["034707184e8e4eefb46400b5a3774b5f"]
    }
    return body
}




/*function orderButton(){

    const orderButton = document.querySelector("#order")

    orderButton.addEventListener('click', (event) => submitOrder(event))

}


function submitOrder(event) {
    event.preventDefault()
    const form = document.querySelector(".cart__order__form")
    console.log(form.elements)


}


const fetchTest =
    fetch("http://localhost:3000/api/products/order", {

        //Ajout du type de méthode utilisé
        method: "POST",

        //Ajout d'un body ou d'un contenu à envoyer
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }


    })
        .then((res) => res.json())
        .then((data) => console.log(data))


function createRequestBody() {// creation des éléments à envoyer via "POST"
    const body = {
        contact: {
            firstName: "test",
            lastName: "test",
            adress: "test",
            city: "test",
            email: "test",
        },
        products: ["test"]
    }
    return body
}*/

/**
*
* Expects request to contain:
* contact: {
*   firstName: string,
*   lastName: string,
*   address: string,
*   city: string,
*   email: string
* }
* products: [string] <-- array of product _id
*
*/


//localStorage.postItem("product", JSON.stringify(productStorage));





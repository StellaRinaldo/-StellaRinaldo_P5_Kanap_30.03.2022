//Récupérer les produits depuis le local storage

let productStorage = JSON.parse(localStorage.getItem("product"));
console.log("product", productStorage);


//Organiser chaque élements dans une fonction avec pour paramètre "item"
productStorage.forEach(item => displayItem(item))

//Affichage des éléments crées, dans la page panier
function displayItem(item) {

    const sectionArticle = document.querySelector("#cart__items")
    const article = createArticle(item)
    sectionArticle.appendChild(article)
    const div = createImageDiv(item)
    article.appendChild(div)

    const cartItemContent = createCartContent(item)
    article.appendChild(cartItemContent)
    

    displayTotalQuantity()
    displayTotalPrice()
}

//Création de la balise "article"
function createArticle(item) {
    const article = document.createElement("article")
    article.classList.add("cart__item")
    article.dataset.id = item.idProduct
    article.dataset.color = item.color

    return article
}

//Création de l'image
function createImageDiv(item) {
    const div = document.createElement("div")
    div.classList.add("cart__item__img")

    const image = document.createElement("img")
    image.src = item.imageUrl
    image.alt = item.altTxt
    div.appendChild(image)
    return div
}

//Création de la div contenant les informations du produit
function createCartContent(item) {

    const div = document.createElement("div")
    div.classList.add("cart__item__content")
    const description = createDescription(item)
    const settings = createSettings(item)
    div.appendChild(description)
    div.appendChild(settings)
    return div
}

//Création de la description du produit
function createDescription(item) {

    const description = document.createElement("div")
    description.classList.add("cart__item__content__description")

    const h2 = document.createElement("h2")
    h2.textContent = item.productName

    const colorP = document.createElement("p")
    colorP.textContent = item.color

    const priceP = document.createElement("p")

    description.appendChild(h2)
    description.appendChild(colorP)
    description.appendChild(priceP)

    //Requête du prix du produit depuis l'API
    //Récupère les infos d'un produit à partir de son id pour en extraire son prix
    fetch('http://localhost:3000/api/products/' + item.idProduct)
        .then((resp) => resp.json())
        .then(function (data) {

            priceP.textContent = data.price + ' €';
        })

        .catch(function (error) {
            console.log(error);
        })

    return description

}

//Création de la div contenant les paramètres du produit
function createSettings(item) {
    const divSettings = document.createElement("div")
    divSettings.classList.add("cart__item__content__settings")
    divSettings.appendChild(addQuantityToSettings(item))
    divSettings.appendChild(createDeleteSettings(item))

    return divSettings
}

//Affichage de la quantité du produit
function addQuantityToSettings(item) {

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

    inputQuantity.addEventListener("change", () => changeQuantity(item.idProduct, inputQuantity.value, item.color))

    return divQuantity
}

//Ajout de la posiibilité de changer la quantité directement depuis la page panier
function changeQuantity(idSelect, newQuantity, colorSelect) {
    const itemSelect = productStorage.find(item => item.idProduct === idSelect && item.color === colorSelect)
    itemSelect.quantity = Number(newQuantity)
    localStorage.setItem("product", JSON.stringify(productStorage))
    //console.log(itemSelect);
    displayTotalQuantity()
    displayTotalPrice()
    return itemSelect
}

//Calcul et affichage du nombre total d'articles
function displayTotalQuantity() {

    let itemQuantity = document.getElementsByName("itemQuantity")

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

//Affichage du prix total après le calcul de la quantité
async function displayTotalPrice() {
    let totalPrice = 0
    let itemQuantity = document.getElementsByName("itemQuantity")

    for (let i = 0; i < itemQuantity.length; i++) {

        let price = await fetch('http://localhost:3000/api/products/' + productStorage[i].idProduct)

            .then((resp) => resp.json())
            .then(function (data) {

                return data.price
            })

        totalPrice += price * itemQuantity[i].valueAsNumber

    }

    const finalTotal = document.getElementById('totalPrice')
    finalTotal.textContent = totalPrice
    //console.log("total", totalPrice);
}

//Création du bouton "supprimer"
function createDeleteSettings(item) {

    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings__delete")

    const pDelete = document.createElement("p")
    div.appendChild(pDelete)
    pDelete.classList.add("deleteItem")
    pDelete.textContent = "Supprimer"

    return div
}

//Gestion de la suppression d'un produit
addDeleteFunction()
function addDeleteFunction() {

    let deleteItem = document.getElementsByClassName("deleteItem")

    for (let i = 0; i < deleteItem.length; i++) {

        deleteItem[i].addEventListener('click', () => {

            let productSelect = productStorage[i].idProduct + productStorage[i].color
            productStorage = productStorage.filter(element => element.idProduct + element.color !== productSelect)//filter = extraire
            //productStorage = productStorage.filter(element => element.idProduct !== productSelect.idProduct && element.color !== productSelect.color)//filter = extraire
            
            console.log(productStorage);

            localStorage.setItem("product", JSON.stringify(productStorage));
            if (productStorage.lenght === 0) {

                localStorage.removeItem("product")
            }
            location.reload();/*permet de recharger la page avec le nouveau panier après suppression de produit sélectionné*/
        })
    }
}


//***********************Formulaire de commande*************************/



function orderButton() {

    const orderButton = document.querySelector("#order")
    orderButton.addEventListener("click", (event) => submitOrder(event))
}
orderButton()

//Gestion du bouton "commander"
function submitOrder(event) {//lui passer le paramètre event

    event.preventDefault()
    if (productStorage.length === 0) alert("Veuillez ajouter des articles dans votre panier.")

    //Contrôle des champs du formulaire
    
    if (invalidFirstName()) {
        let error = document.getElementById('firstNameErrorMsg');
        error.textContent = "Veuillez saisir un prénom valide avec une majuscule.";
    }

    if (invalidLastName()) {
        let error = document.getElementById('lastNameErrorMsg')
        error.textContent = "Veuillez saisir un nom valide avec une majuscule.";
    }
    if (invalidAdress()){
        let error = document.getElementById('addressErrorMsg')
        error.textContent = "Veuillez saisir une adresse valide.";
    }
    if (invalidCity()) {
        let error = document.getElementById('cityErrorMsg')
        error.textContent = "Veuillez saisir un code postal suivi d'une ville valide.";
    }
    if (invalidEmail()) {
        let error = document.getElementById('emailErrorMsg')
        error.textContent = "Veuillez saisir une adresse mail valide en minuscules.";
    }

    if (invalidFirstName()===false && invalidLastName()===false && invalidAdress()===false && invalidCity()===false && invalidEmail()===false && productStorage.length !== 0) {



        //Envoi du formulaire dans le local Storage
        JSON.parse(localStorage.getItem("form"));
        localStorage.setItem("form", JSON.stringify(createRequestBody()))

        fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            body: JSON.stringify(createRequestBody()),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((res) => res.json())
            .then((data) => {

                const orderId = data.orderId

                window.location.href = "../html/confirmation.html" + "?orderId=" + orderId // donc dans la barre d'adresse, il y aura "?orderId=" suivi du numero de commande"

                return console.log(data)
            })

            .catch((err) => console.log(err))
    }
}


function invalidFirstName() {
    const nameControl = document.querySelector("#firstName").value
    const regex = /^[A-Z][A-Za-z\é\è\ê\ë\ô\ö\ï\î\-\'][^0-9\^ ]+$/
    if (regex.test(nameControl) === false) {
        
        return true /*donc, effectivement, il y a une erreur et un message d'alerte apparaît*/
    }
    return false /*donc il n'y a pas d'erreur et la condition d'invalidité est "false"*/
}


function invalidLastName() {
    const lastNameControl = document.querySelector("#lastName").value
    const regex = /^[A-Z][A-Za-z\é\è\ê\ë\ô\ö\ï\î\-\'][^0-9\^ ]+$/
    if (regex.test(lastNameControl) === false) {
        
        return true
    }
    return false
}


function invalidAdress() {
    const addressControl = document.querySelector("#address").value
    const regex = /^[0-9]+\s*([a-zA-Z\-\']+\s*[a-zA-Z\-\'])*$/
    if (regex.test(addressControl) === false) {
        
        return true
    }
    return false
}


function invalidCity() {
    const cityControl = document.querySelector("#city").value
    const regex = /[0-9]{5} [A-Za-z\-\']{3,40}$/
    if (regex.test(cityControl) === false) {
        
        return true
    }
    return false
}


function invalidEmail() {
    const emailControl = document.querySelector("#email").value
    const regex = /^[0-9\a-z\.]+@([0-9\a-z]+\.)+[\a-z]{2,4}$/
    if (regex.test(emailControl) === false) {
        
        return true
    }
    return false
}


function createRequestBody() {
    const body = {
        contact: {
            firstName: document.querySelector("#firstName").value,
            lastName: document.querySelector("#lastName").value,
            address: document.querySelector("#address").value,
            city: document.querySelector("#city").value,
            email: document.querySelector("#email").value
        },
        products: getIds()
    }

    return body

}


function getIds() { //récupération de l'array comprenant les ids des produits du panier

    let ids = []
    for (let i = 0; i < productStorage.length; i++) {

        let id = productStorage[i].idProduct
        ids.push(id)
    }
    return ids
}
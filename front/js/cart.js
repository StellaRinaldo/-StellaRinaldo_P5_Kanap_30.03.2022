//Récupérer les produits depuis le local storage

let productStorage = JSON.parse(localStorage.getItem("product"));
console.log("cart", productStorage);



//Organiser chaque élements dans une fonction avec pour paramètre "item"
productStorage.forEach(item => displayItem(item))


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


addDeleteFunction()
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


//***********************Formulaire de commande*************************/

//Sélection et action du bouton "commander"




orderButton()//appel de la fonction du bouton "commander"
function orderButton() {

    const orderButton = document.querySelector("#order")
    orderButton.addEventListener("click", (event) => {
        event.preventDefault()
        if (productStorage.length === 0) {
            alert("Veuillez ajouter des articles dans votre panier")
            return //empêche tout envoi tant que le panier est vide
        }

        //********************CONTROLE DU FORMULAIRE********************

        if (invalidForm()) return

        function invalidForm() {

            const formControl = document.querySelector(".cart__order__form")
            const inputs = formControl.querySelectorAll("input")
            inputs.forEach((input) => {
                if (input.value === "") {
                    alert("Veuillez remplir tous les champs")
                    return true
                }
                return false
            })
        }

        //TROUVER BON REGEX POUR NOM, PRENOM ET ADRESSE RURALE

        /*inputName()
        function inputName(){
            const firstName = document.querySelector("#firstName").value
            const lastName = document.querySelector("#lastName").value
        }

        if(invalidName()) return

        function invalidName(){
            const nameControl = inputName()
            const regex = /^[A-Za-z]{3,20}$/
            if (regex.test(nameControl) === false) {
                alert ("Veuillez saisir un nom et un prénom valide")
                return true
            }
            return false
        }*/

        if (invalidEmail()) return

        function invalidEmail() {//comment faire pour interdire les majuscules ?
            const emailControl = document.querySelector("#email").value
            const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
            if (regex.test(emailControl) === false) {
                alert("Veuillez saisir une adresse mail valide en minuscules")
                return true
            }
            return false
        }


        /*if (invalidAddress()) return

        function invalidAddress(){
            const addressControl = document.querySelector("#address").value
            const regex = /^[A-Za-z0-9]{10,50}$/
            if (regex.test(addressControl) === false) {
                alert ("Veuillez saisir une voie valide avec des chiffres et des lettres")
                return true
            }
            return false
        }*/


        if (invalidCity()) return

        function invalidCity() {
            const cityControl = document.querySelector("#city").value
            const regex = /[0-9]{5} [A-Za-z]{3,40}$/
            if (regex.test(cityControl) === false) {
                alert("Veuillez saisir un code postal suivi d'une ville valide")
                return true
            }
            return false
        }

        valuesForm()//appel de la fonction contenant les valeurs du formulaire
        function valuesForm() {
            const form = {
                firstName: document.querySelector("#firstName").value,
                lastName: document.querySelector("#lastName").value,
                address: document.querySelector("#address").value,
                city: document.querySelector("#city").value,
                email: document.querySelector("#email").value,

            }
            console.log("form", form);
            return form
        }

        /*function formControl(){
            const form = document.querySelector(".cart__order__form")
            const input = form.querySelectorAll("input")
        }*/

        //Envoi du formulaire dans le local Storage
        let formStorage = JSON.parse(localStorage.getItem("form"));
        localStorage.setItem("form", JSON.stringify(valuesForm()))

        //Mettre le formulaire et les produits sélectionnés dans un objet à envoyer au serveur
        const toSend = {

            formStorage,
            productStorage
        }

        console.log("to send", toSend);

        //Envoi de l'objet "toSend" vers le serveur

        //J'EN SUIS ICI : ERROR 400 (BAD REQUEST)
        const sendToBackend = fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            body: JSON.stringify(toSend),
            headers: {"Content-Type": "application/json"}
        })   
        .then(res => res.json())
        .then(console.log("post"))
        });

    }












/*function orderButton(event){ //Ecouter lorsque l'utilisateur soumet le formulaire de commande

    const orderButton = document.querySelector("#order")
    orderButton.addEventListener("click", (event) => {//Ne fonctionne pas et rafraîchit la page malgré le "preventDefault"//
        event.preventDefault();
        formToSend(event);
        submitOrder(event);
    } )
    return orderButton
}


function formToSend(event){

    const form = document.querySelector(".cart__order__form")
    let formToSubmit = {
        contact: {
            firstName: document.querySelector("#firstName"),
            lastName: document.querySelector("#lastName"),
            address: document.querySelector("#adress"),
            city: document.querySelector("#city"),
            email: document.querySelector("#email"),
            }
    }
    console.log(formToSubmit);
    return form 
}


function submitOrder(event){
    
    fetch("http://localhost:3000/api/products/order", {

        method: "POST",
        body: formToSend(event),

    })
        .then((res) => res.json())
        .then((data) => console.log(data))

    
    .catch(function (error) {
    console.log(error);
    });
})*/

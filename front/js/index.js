
//Requête de l'API
fetch('http://localhost:3000/api/products')
    .then((resp) => resp.json())
    .then(function (data) {

        //Création d'une boucle "for...of" pour parcourir le tableau de l'API
        for (let product of data) {

            //Affichage des éléments crées, dans la page d'accueil
            displayItem(product)
            
        }
    })
    .catch(function (error) {
        console.log(error);
    });


//*************************************** CREATION DES ELEMENTS ********************************************


function displayItem(product) {
    const linkItem = createLink(product)
    const article = createArticle()
    linkItem.appendChild(article)

    const image = createImage(product)
    article.appendChild(image)

    const titleItem = createTitleItem(product)
    article.appendChild(titleItem)
    const description = createDescription(product)
    article.appendChild(description)
}

//Création de la balise "link"           
function createLink(product) {

    const items = document.querySelector('#items');
    const link = document.createElement("a");
    link.setAttribute("href", `./product.html?id=${product._id}`);/*Insert dynamiquement l'id dans la boucle.*/

    items.appendChild(link);

    return link
}

//Création de la balise "article"
function createArticle() {

    const article = document.createElement("article");
    return article
}

//Création de l'image'
function createImage(product) {

    const img = document.createElement('img');
    img.src = product.imageUrl;
    img.alt = product.altTxt;

    return img
}

//Création du titre du produit
function createTitleItem(product) {

    const h3 = document.createElement("h3");
    h3.classList.add("productName");
    h3.textContent = product.name;

    return h3

}

//Création de la description du produit
function createDescription(product) {

    let p = document.createElement("p");
    p.classList.add("productDescription");
    p.textContent = product.description;

    return p
}


//Récupération de l'id du produit sélectionné depuis la page d'accueil

function getIdItem() {

    // permet de récupérer l'url de la page avant de lui ajouter l'id correspondant
    let params = (new URL(document.location)).searchParams;
    console.log("params" + params);
    let id = params.get("id");
    return id
}


//Récupération des informations liées à l'id du produit

fetch("http://localhost:3000/api/products/" + getIdItem())
    .then((resp) => resp.json())
    .then(function (data) {

        displayElements(data)
        function displayElements(data) {

            const image = createImage(data)
            const titlePrice = createTitlePrice(data)
            const description = createDescription(data)
            const color = createColor(data)
        }

        //Ajout de l'image
        function createImage(data) {

            const itemImg = document.querySelector(".item__img");

            let img = document.createElement("img");
            itemImg.appendChild(img);
            img.src = data.imageUrl;
            img.alt = data.altTxt;
        }

        //Ajout du titre et du prix
        function createTitlePrice(data) {

            const titleItem = document.querySelector("#title");
            titleItem.textContent = data.name;

            const price = document.querySelector("#price");
            price.textContent = data.price;
        }

        //Ajout de la description
        function createDescription(data) {

            const description = document.querySelector("#description");
            description.textContent = data.description;
        }

        //Ajout de la couleur
        function createColor(data) {

            let colorsList = data.colors;

            for (let i = 0; i < colorsList.length; i++) {

                const select = document.querySelector("#colors");
                let option = document.createElement("option");
                option.value = colorsList[i];
                select.appendChild(option);
                option.textContent = colorsList[i];

            };


        }

        //Gestion du bouton "Ajouter au panier"
        addToCart()
        function addToCart() {

            const addCart = document.querySelector("#addToCart");

            addCart.addEventListener("click", (event) => saveCart(event))
        }


        function saveCart(event) {

            event.preventDefault();

            if (invalidColor()) return
            function invalidColor() {
                let colors = document.querySelector("#colors");
                if (colors.value === '') {
                    alert("Veuillez sélectionner une couleur.")
                    return true
                }

                return false
            }

            if (invalidQuantity()) return
            function invalidQuantity() {
                let quantity = document.querySelector("#quantity");
                if (quantity.value === "0") {
                    alert("Veuillez choisir une quantité.")
                    return true
                }
                return false
            }


            const addCart = document.querySelector("#addToCart");
            addCart.textContent = "Article(s) ajouté(s) !";
            addCart.style.color = "green";


            //Creation de l'objet "product" qui sera stocké dans le Local Storage 
            let product = {
                productName: data.name,
                idProduct: data._id,
                quantity: Number(quantity.value),
                color: colors.value,
                imageUrl: data.imageUrl,
                altTxt: data.altTxt,
                description: data.description,
            }
            console.log(product);

            //Ajout des produits dans le Local Storage avec la mise à jour automatique de la quantité
            updateItem()
            function updateItem() {

                let productStorage = JSON.parse(localStorage.getItem("product"));

                const addProductStorage = () => {

                    productStorage.push(product);
                    localStorage.setItem("product", JSON.stringify(productStorage));
                }

                //Gestion de la quantité

                if (productStorage) {
                    let result = productStorage.find((element) => element.idProduct === data._id && element.color === colors.value);

                    if (result) {/*Si l'élément correspondant est trouvé, la quantité du produit est incrémentée : 
                                   result.quantity = quantité à rajouter, product.quantity = quantité de base*/

                        let addQuantity = parseInt(result.quantity) + parseInt(product.quantity);

                        result.quantity = addQuantity; //L'ancienne valeur est écrasée au profit de la nouvelle

                        localStorage.setItem("product", JSON.stringify(productStorage)); //Mise à jour des données du local storage

                        //S'il s'agit du même produit mais avec une couleur différente, créer un nouvel objet au format JSON   
                    } else {
                        addProductStorage();
                    }

                    //S'il s'agit d'un produit entièrement différent (id et couleur), alors, créer un nouveau tableau contenant le nouvel objet
                } else {

                    productStorage = [];
                    addProductStorage();
                }
            }
        }
    });



//Récupération de la chaîne de requête correspondant à l'id dans l'url (ce qui se trouve après le point d'interrogation)

/*Ceci me permet d'afficher le bon produit sélectionné depuis la page index.html, en extractant l'id*/

let params = (new URL(document.location)).searchParams; // permet de récupérer l'url grace au terme "URLSearchParams"
console.log("params" + params);
let id = params.get('id');
console.log("id" + id);

let quantity = document.querySelector('#quantity');
let colors = document.querySelector('#colors');



fetch('http://localhost:3000/api/products/' + id)//récupérer les infos d'un produit à partir de son id
    .then((resp) => resp.json())
    .then(function (data) {

        

        const productName = document.querySelector('title');
        productName.innerHTML = data.name;

        const itemImg = document.querySelector('.item__img');

        let img = document.createElement('img');
        itemImg.appendChild(img);
        img.src = data.imageUrl;
        img.setAttribute('alt', data.altTxt);

        const titleItem = document.querySelector('#title');
        titleItem.innerHTML = data.name;

        const price = document.querySelector('#price');
        price.innerHTML = data.price;

        const description = document.querySelector('#description');
        description.innerHTML = data.description;

        

        //liste déroulante choix couleurs

        let colorsList = data.colors; //creation d'une variable contenant les données des couleurs

        for (let i = 0; i < colorsList.length; i++) {
            /*création d'une boucle qui affichera l'ensemble des couleurs. 
            Ici, ".length" signifie que la boucle se répètera en fonction de la longueur du tableau*/
            console.log(colorsList[i]);

            const select = document.querySelector('#colors');
            let option = document.createElement('option');
            option.setAttribute('value', colorsList[i]);
            select.appendChild(option);
            option.innerHTML = colorsList[i]; /* Ici, on dit que les éléments qui apparaîtront dans la liste correspondront 
                                            à la variable de la boucle "i" créée précedement*/
        };

        
        

        //Sélection du bouton Ajouter au panier//
        const addCart = document.querySelector('#addToCart');
        console.log(addCart);

        /*Ecouter le bouton et envoyer le panier*/

        addCart.addEventListener('click', (event) => {
            event.preventDefault(); //lorsque l'on cliquera sur le bouton, la page ne sera pas automatiquement réactualisée !
            
            addCart.textContent = 'Article(s) ajouté(s) !';
            addCart.style.color = 'green';

        
            /*----------Récupération des valeurs du formulaire (dans le call-back de l'addEventListener !*/
            
            let product= {    /*creation d'un objet produit type*/
	            productName : data.name,
	            idProduct : data._id,
	            quantity : Number(quantity.value),//l'id #quantity associé à l'attribut 'value' présent dans le html
	            //productPrice : data.price, (ne pas l'intégrer)
                color: colors.value, 
                imageUrl: data.imageUrl,
                altTxt: data.altTxt,
                description : data.description,
            } /*pas de point virgule pour les objets !*/

            console.log(product);


            //----------Local Storage----------(mettre l'objet de la variable product dans le local storage
            /*----------Stocker la récupération des valeurs du formulaire dans le local storage*/
            /*Donc d'abord, déclarer une variable qui sera enregistrée dans le local storage*/

            let productStorage = JSON.parse(localStorage.getItem("product"));//JSON.parse rend la lecture des données plus simple et plus rapide pour les navigateurs
            console.log(productStorage);

            const addProductStorage = () => {
                productStorage.push(product); /*récupération de l'objet de la variable product pour le stocker dans le tableau*/
                localStorage.setItem("product", JSON.stringify(productStorage));/*création de la clé product pour 
                                                                                y stocker le tableau productStorage dans le local Storage et
                                                                                en convertissant ce tableau en langage JSON*/
            }

            //on va incrémenter les produits ajoutés ayant le même id et la même couleur
            if(productStorage){
                let result = productStorage.find((element) => element.idProduct === data._id && element.color === colors.value);
                //la variable "result" est égale  au premier élément trouvé dans le local storage répondant à cette condition :
                //element.idProduct est strictement égale à data._id ET EGALEMENT SI element.color est strictement égale à colors.value
                //console.log(productStorage);
                

                if(result){ //renvoi un produit
                    let addQuantity = parseInt(result.quantity) + parseInt(product.quantity);//product.quantity = quantité de base, 
                    //result.quantity = quantité à rajouter
                    //parseInt sert à extraire les nombres présents dans les différentes variables pour les analyser.
                    result.quantity = addQuantity; //on écrase l'ancienne valeur et on ajoute le nouveau (le total crée)
                    localStorage.setItem("product", JSON.stringify(productStorage)); //met à jour les données du local storage
                    console.log("result" + result);
                    console.log("quantity" + result.quantity);


                }else{
                    addProductStorage(); //s'il s'agit du même produit mais avec une couleur différente, créer un nouvel objet au format JSON
                }  

            }else{
                productStorage = []; //s'il s'agit d'un produit entièrement différent (id et couleur), alors, créer un nouveau tableau contenant le nouvel objet
                addProductStorage();
                }

        });
    });


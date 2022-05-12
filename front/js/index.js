fetch('http://localhost:3000/api/products')
    .then((resp) => resp.json()) //récupération des données formatées en json lisible. L'intitulé "resp" est une abréviation de "response"
    .then(function (data) {
        //console.log("test", data);
        const items = document.querySelector('#items'); //selectionner élément "items" dans le DOM (dans le code html, la classe ou l'id)

        //creation d'une boucle "for...of"
        for (let product of data) {

            /*création de l'élément "a" (visible uniquement dans l'inspecteur et non dans le fichier html): 
            en se basant sur le commentaire HTML fournie qui nous montre ce que doit nous afficher les liens "a"*/
            let link = document.createElement("a");

            items.appendChild(link); //rajout de l'élément "link" comme élément enfant de "item", donc là on positionne l'élément "a" dans le code


            link.setAttribute("href", `./product.html?id=${product._id}`);/*inserer dynamiquement l'id dans la boucle. 
                                ${} permet ici d'intégrer une variable à part sans qu'elle soit concaténée dans l'url*/

            //creation de l'element article

            let article = document.createElement("article");

            link.appendChild(article);

            //creation de l'élément image
            let img = document.createElement('img');

            article.appendChild(img);

            img.src = product.imageUrl; //lien = dans la réponse json (c'est product. la catégorie)
            img.alt = product.altTxt; 

            //creation de l'element h3
            let h3 = document.createElement("h3");

            article.appendChild(h3)

            h3.classList.add("productName");
            h3.innerHTML = product.name;

            //creation de l'element p

            let p = document.createElement("p");

            article.appendChild(p)

            p.classList.add("productDescription");
            p.innerHTML = product.description;

            
           


        }
    })
    .catch(function (error) {
        console.log(error);
    });






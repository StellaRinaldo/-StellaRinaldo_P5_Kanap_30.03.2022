//Récupère l'url grace au terme "URLSearchParams", avec l'orderId !

let params = (new URL(document.location)).searchParams; 
let orderId = params.get('orderId');


const displayOrderId = document.querySelector("#orderId")
displayOrderId.textContent = orderId

// Nettoyer le localStorage
deleteStorage()
function deleteStorage() {
    const storage = window.localStorage
    storage.clear()
}


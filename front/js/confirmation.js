let params = (new URL(document.location)).searchParams; // permet de récupérer l'url grace au terme "URLSearchParams" et avec orderId !
//console.log("params" + params);
let orderId = params.get('orderId');
//console.log("orderId" + orderId);

const displayOrderId = document.querySelector("#orderId")
displayOrderId.textContent = orderId

deleteStorage()
function deleteStorage() {
    const storage = window.localStorage
    storage.clear()
}
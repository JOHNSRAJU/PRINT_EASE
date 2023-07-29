let popup=document.getElementById("popup");
function openpopup(){
    popup.classList.add("open-popup")
    //add 5sec delay
    setTimeout(()=>{
        window.location.href ="../../invoice/index.html?docid="+docid;
    },5000)

}
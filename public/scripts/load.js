window.addEventListener("load", () => {
    if(sessionStorage.getItem("username") === null){
        window.location.replace("login.html");
    }
    console.log("Working");
})
var username = document.getElementById("username");
var pass = document.getElementById("pass");
var btn = document.getElementById("btn");

btn.addEventListener("click", function(){


  if(username.value && pass.value ){


    var body = {
      "username" : username.value,
      "password" : pass.value 
    }
    var req  = new XMLHttpRequest();
    req.open("POST", "/signup");
    req.setRequestHeader("Content-type", "application/json");
    req.send(JSON.stringify(body));

    req.addEventListener("load", function(){

      if(req.status === 200){
        window.location.href = "/";
      }
      else{
        errMessage(true);
        setTimeout(function(){
          window.location.href = "/";
        },2000)
      }
    })

  }
  else{
    errMessage(false); 
  }

})



function errMessage(signin){
        var errContainer = document.getElementById("errContainer");
        errContainer.innerHTML = "";
        var errBtn = document.createElement("button");
        // errBtn.setAttribute("type", "button");
        errBtn.innerHTML = "X";
        if(signin){
          errContainer.innerHTML = "User already exist! Redirecting to Login page.. ";
        }
        else{
          errContainer.innerHTML = "Please enter username and password  ";
        }
        errContainer.appendChild(errBtn);
        errBtn.addEventListener("click", function(){
          errContainer.innerHTML = "";
          username.value = "";
          pass.value = "";
        })
}

var input = document.getElementById("input");
var parent = document.getElementById("parent");
var btn = document.getElementById("btn");
var logoutBtn = document.getElementById("logoutBtn");
var userName = document.getElementById("userName");
 


   
function onload(){   
      onclick();
      loggedUser(function(user){
            getTodo(function(todos){
                  todos.forEach(function(task){
                        if(task.user === user){
                              console.log(task)
                              updateUI(task); 
                        }
                  })
            })
      });
}
onload();  


function loggedUser(callback){

      var request = new XMLHttpRequest();
      request.open("get","/getUserName");
      request.send()
      request.addEventListener("load",function()
      {
            var response = JSON.parse(request.responseText);
            userName.innerHTML = "Logged in as "+response.name ;
            callback(response.name);
      
      })
}

var countid = 0;
function countID(){
     
             getTodo(function(todos){
               //   console.log(todos);
                   var todo = todos[todos.length-1];
                   countid = todo.id;
             })
}
countID();

function onclick(){
            
            input.addEventListener("keydown", function(e){
                  if(e.keyCode == 13){
                        saveTodo();
                  }
            })

            btn.addEventListener("click",function(){
                  if(input.value){
                  //console.log(input.value);
                        saveTodo();
                  }
            })

}

function saveTodo(){
      
                        var request = new XMLHttpRequest();
                        request.open("POST","/save");
                        request.setRequestHeader("content-type","application/json");
                        var body = {   
                              todo : input.value,
                              mark : false,
                              id : ++countid,
                              user: null,
                              time: Date.now()
                        }
                        request.send(JSON.stringify(body));
                        request.addEventListener("load", function(){
                              var todo = JSON.parse(request.responseText);
                              updateUI(todo); 
                        })
                        input.value = ""; 
}

function updateUI(data){
      console.log(data)
      var list = document.createElement("li");
      var leftContainer =  document.createElement("div");
      var rightContainer =  document.createElement("div");
      var todoNode = document.createElement("p");
      var todoUserNameNode = document.createElement("p");
      var todoTimeNode = document.createElement("p");
      todoNode.setAttribute("id", "todoNode");
      todoUserNameNode.setAttribute("class", "user-p");
      todoTimeNode.setAttribute("class", "user-p");


      var readButton = document.createElement("button");
      if(data.mark){
            readButton.style.color = "green"; 
      }
      else{
            readButton.style.color = "gray";
      }
      // readButton.setAttribute("type","checkbox");
      readButton.setAttribute("id","readButton");
      var icon0 = document.createElement("i");
      icon0.setAttribute("class","fa-solid fa-circle-check ");
      readButton.appendChild(icon0);    
      readButton.addEventListener("click",function(){
            data.mark = !data.mark;
            updateTodo(data);
            if(data.mark){
             
             todoNode.style.textDecoration = "line-through";
             readButton.style.color = "green"; 
            
            }else{
               todoNode.style.textDecoration = "none";
               readButton.style.color = "gray";
            }
      })

      var deleteButton = document.createElement("button");
      deleteButton.setAttribute("id","deleteButton");
      var icon1 = document.createElement("i");
      icon1.setAttribute("class","fa-solid fa-trash-can" );
      deleteButton.appendChild(icon1);
      deleteButton.addEventListener("click",function(event,data){
            // console.log(event.target.parentNode.parentNode[0].id);
                  
            //  var child = event.target.parentNode.parentNode;
            //  var id = child.id
            //  console.log(event.target.parentNode)
            //  console.log(event)
            //  console.log(list.id);
             parent.removeChild(list);
            //      parent.removeChild(event.target.parentNode.parentNode);
                var request3 = new XMLHttpRequest();
                request3.open("POST","/delete");
                request3.setRequestHeader("Content-type","application/json");
                request3.send(JSON.stringify({objectid : list.id}));
                request3.addEventListener("load",function(){

                }) 
                 
      })


      var editButton = document.createElement("button");
      editButton.setAttribute("id","editButton");
      var icon2 = document.createElement("i");
      icon2.setAttribute("class", "fa-solid fa-pen" );
      editButton.appendChild(icon2);
      editButton.addEventListener("click",function(){
            var input = document.createElement("input")
            input.setAttribute("type", "text");
            input.setAttribute("placeholder", "edit ToDo");
            input.value = todoNode.innerHTML;
            todoNode.innerHTML = "";
            todoNode.appendChild(input)
            input.addEventListener("keyup", function(e){
                  if(e.keyCode == 13){
                       if(input.value){
                              input.style.color = "black";
                              todoNode.innerHTML = input.value;
                              console.log(input.value)
                              data.todo =  input.value;
                              console.log(data)
                              updateTodo(data);
                       }
                       else{
                            input.setAttribute("placeholder", "connot be empty");
                            input.setAttribute("class", "your-class");
                       }

                  }
                  
            })
      })


      
      list.setAttribute("id",data.id);
      list.setAttribute("class","li");
      
      rightContainer.appendChild(editButton);
      rightContainer.appendChild(readButton);
      rightContainer.appendChild(deleteButton);

      todoNode.innerHTML = data.todo;
      todoUserNameNode.innerHTML = "Author: "+data.user;
      showTime(data, todoTimeNode);

       if(data.mark){
             todoNode.style.textDecoration = "line-through";
       }

       leftContainer.appendChild(todoNode)
       leftContainer.appendChild(todoUserNameNode)
       leftContainer.appendChild(todoTimeNode)

      
      list.appendChild(leftContainer);
      list.appendChild(rightContainer);
      
              
       parent.appendChild(list);
       //data="";
}



function updateTodo(object){
       var request = new XMLHttpRequest();
       request.open("POST","/update");
       request.setRequestHeader("Content-type","application/json");
      // console.log(object);
       request.send(JSON.stringify(object));
       request.addEventListener("load", function(){
            //   console.log(responseText);
       })
}

  



function  getTodo(tododata){
      
      var request2 = new XMLHttpRequest();
      request2.open("get","/todo");
      request2.setRequestHeader("content-type","application/json");
      request2.send();
      
      request2.addEventListener("load",function(){
           //todos = [];
           var todos = JSON.parse(request2.responseText);
           tododata(todos);
      })
      
}

logoutBtn.addEventListener("click", function(){
       var request = new XMLHttpRequest();
       request.open("GET","/logout");
       request.send();
       request.addEventListener("load", function(){
            //   console.log(responseText);
            window.location.href = "/";
       })
})


function showTime(todo, timeStampNode){
  
    var mili = Date.now()-(todo.time);
    var sec = Math.floor(mili/1000);
    var min = Math.floor(sec/60);
    var hr = Math.floor((sec/60)/60);
    var day = Math.floor(hr/24);
    console.log(mili);
    if(sec<60)
      timeStampNode.innerHTML = `Added: few seconds ago`;
    else if(min<60)
      timeStampNode.innerHTML = `Added: ${min} minutes ago`;       
    else if(hr<24)
      timeStampNode.innerHTML = `Added: ${hr} hours ago`;
    else
      timeStampNode.innerHTML = `Added: ${day} days ago`;
}
let tdList = [];//[{name: "Submit Tutorial #2", checked: false, highlighted: "white", order: 0, time: 1000}];

let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
        let response = JSON.parse(xhttp.responseText);
        tdList = response;
        render();
    }
}

function getData(){
    xhttp.open("GET", "http://localhost:3000/tasks");
    xhttp.send();
}

setInterval(getData, 5000);

function clearList(){
    let list = document.getElementById("list");
    
    if (list.hasChildNodes){
        list.innerHTML = '<div id = "task" for = "list">Task</div><div id = "est" for = "est">Estimated Time</div>';
    }
}

function writeList(){
    let list = document.getElementById("list");
    for (let i = 0; i < tdList.length; i++){
        let item = document.createElement("div");
        item.setAttribute("class", "task");
        item.setAttribute("id", `${tdList[i].order}`)

        let check = document.createElement("input");
        check.setAttribute("type", "checkbox");
        check.setAttribute("box", "id");
        check.checked = tdList[i].checked;
        check.style.float = "left";
        item.appendChild(check);

        let text = document.createElement("div");
        text.appendChild(document.createTextNode(tdList[i].name));
        text.style.float = "left";
        item.appendChild(text);
        text = document.createElement("div");
        text.appendChild(document.createTextNode(`${tdList[i].time} hours`))
        text.style.textAlign = "right";
        item.appendChild(text);
        item.style.background = tdList[i].highlighted;
        item.addEventListener("change",
        function () {
            let req = new XMLHttpRequest();
            req.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 200){
                    getData();
                }
            }
            req.open("PUT", `http://localhost:3000/check`);
            //req.setRequestHeader("Content-Type", "application/json");
            req.send(JSON.stringify({num: parseInt(this.id), check: this.querySelector("input").checked}));
        }
        );
        
        list.appendChild(item);
    }
}

function render(){
    clearList();
    writeList();
}

let add = document.getElementById("add");
add.addEventListener("click",
    function () {
        let task = document.getElementById("textBox");
        let est = document.getElementById("timeBox");
        if (task.value.localeCompare("") != 0 && est.value.localeCompare("") != 0){
            let newTask = {name: task.value, checked: false, highlighted: "white", order: tdList.length, time: parseInt(est.value)};
            task.value = "";
            est.value = "";

            let req = new XMLHttpRequest();
            req.onreadystatechange = function(){
                if(this.readyState == 4 && this.status == 201){
                    getData();
                }
            }
            req.open("POST", `http://localhost:3000/tasks`);
            //req.setRequestHeader("Content-Type", "application/json");
            req.send(JSON.stringify(newTask));
        }
    }
);

let remove = document.getElementById("remove");
remove.addEventListener("click",
    function (){
        let nums = [];
        let i = 0;
        while(i < tdList.length){
            let item = tdList[i];
            if (item.checked){
                nums.push(i);
            }
            i++;
        }
        let req = new XMLHttpRequest();
        req.onreadystatechange = function(){
            if(this.readyState == 4 && this.status == 200){
                getData();
            }
        }
        req.open("PUT", `http://localhost:3000/remove`);
        //req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify(nums));
    }
)

let hl = document.getElementById("highlight");
for (let i = 0; i < hl.childNodes.length; i++){
    hl.childNodes[i].addEventListener("click",
        function (){
            for (let j = 0; j < tdList.length; j++){
                if (document.getElementById(`${j}`).querySelector("input").checked){
                    //tdList[j].highlighted = this.id;
                    let req = new XMLHttpRequest();
                    req.onreadystatechange = function(){
                        if(this.readyState == 4 && this.status == 200){
                            getData();
                        }
                    }
                    req.open("PUT", `http://localhost:3000/highlight`);
                    //req.setRequestHeader("Content-Type", "application/json");
                    req.send(JSON.stringify({num : j, color : this.id}));
                }
            }
            render();
        }
    )
}

getData();
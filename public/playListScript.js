var pList = document.getElementById("songList");
var index;  // variable to set the selected row index
const listContainer = document.getElementById("listContainer");
const saveButton = document.getElementById("saveList");
const clearButton = document.getElementById("clearList");
const getListButton = document.getElementById("getList");
getListButton.addEventListener("click", getList)

if(localStorage.length != 0)
    updateTable();

function updateTable() {
    Object.keys(localStorage).forEach(function(key){
      showStorage(key);
  });
    pList.innerHTML += `
    <tr>
            <td class="dirButtonBar" colspan=100%>
            <button class="dirBtn" onclick="upNdown('up');">&#8679;</button>
            <button class="dirBtn" onclick="upNdown('down');">&#8681;</button>
            </td>
    </tr>
    `;

    saveButton.classList.remove("hidden");
    saveButton.classList.add("btn");
    saveButton.addEventListener("click", writeData);
    clearButton.classList.remove("hidden");
    clearButton.classList.add("btn");
    clearButton.addEventListener("click", clearList);

    getSelectedRow();
}

function showStorage(i) {
    //console.log(localStorage.getItem(i));
    pList = document.getElementById("songList");
    item = JSON.parse(localStorage.getItem(i));
    //console.log(item);

    pList.innerHTML += `
    <tr class=trackInfo>
    <td>${item.trackId}</td>
    <td>${item.trackName}</td>
    <td>${item.artistName}</td>
    <td>${item.collectionName}</td>
    <td><a href='${item.trackViewUrl}'">I-Tunes Link</a></td>
    <td><button class="smallBtn" onclick="deleteRow('${item.trackId}')">X</button></td>
    </tr>
    `;
}


function getSelectedRow() {
    index = undefined;
    pList = document.getElementById("songList");

    for(var i = 1; i < pList.rows.length-1; i++) {
        pList.rows[i].onclick = function() {
            // the first time index is undefined
            this.classList.add("selected");
            prev = index;
            index = this.rowIndex;
            if(typeof prev !== "undefined" && typeof index !== "undefined" && prev != index){
                pList.rows[prev].classList.remove("selected");
            }

        };
    }
}


function upNdown(direction) {
    var rows = pList.rows;
    parent;
    if (index){
        if(direction === "up"){
            parent = rows[index-1].parentNode;
            if(index > 1){
                parent.insertBefore(rows[index], rows[index-1]);
                // when the row go up the index will be equal to index - 1
                index--;
            }
        }
        
        if(direction === "down"){
            if(index < rows.length -2){
                parent = rows[index].parentNode;
                parent.insertBefore(rows[index + 1], rows[index]);
                // when the row go down the index will be equal to index + 1
                index++;
            }
        }
    }
}

function getList(){
    index = undefined;
    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: "",
    };
    fetch('/pull', options)
    .then(data => {
        if (!data.ok) {
            throw Error(data.status);
        }
        return data.json();
    }).then(fulldata => {
        //console.log(fulldata[0].trackId);
        loadListFromObject(fulldata)
        //console.log(fulldata);
    }).catch(e => {
        console.log(e);
    });
}

function loadListFromObject(fulldata){
    localStorage.clear();
    
    listContainer.innerHTML = `
    <table id="songList">
        <tr>
            <th>Track ID</th>
            <th>Song</th>
            <th>Artist</th>
            <th>Album</th>
            <th>URL</th>
        </tr>
    </table>
    `;

    pList = document.getElementById("songList");
    Object.keys(fulldata).forEach(function(key){
        item = fulldata[key];
        pList.innerHTML += `
        <tr class=trackInfo>
        <td>${item.trackId}</td>
        <td>${item.trackName}</td>
        <td>${item.artistName}</td>
        <td>${item.collectionName}</td>
        <td><a href='${item.trackViewUrl}'">I-Tunes Link</a></td>
        <td><button class="smallBtn" onclick="deleteRow('${item.trackId}')">X</button></td>
        </tr>
        `;
    localStorage.setItem(fulldata[key].trackId, JSON.stringify(fulldata[key]));
    });
    pList.innerHTML += `
    <tr>
            <td class="dirButtonBar" colspan=100%>
            <button class="dirBtn" onclick="upNdown('up');">&#8679;</button>
            <button class="dirBtn" onclick="upNdown('down');">&#8681;</button>
            </td>
    </tr>
    `;
    getSelectedRow();
}


function clearList(){
    localStorage.clear();
    location.reload(true);
}


function writeData(){
    const rows = document.getElementsByClassName("trackInfo");
    const myDataObject = [];
    for(let i = 0; i < rows.length; i++) {
        myDataObject[i] =  rows.item(i).childNodes.item(1).innerHTML;
    }

    const fullDataObject = {};

    for(let i = 0; i < myDataObject.length; i++){
        //console.log(myDataObject[i]);
        fullDataObject[i] = JSON.parse(localStorage.getItem(myDataObject[i]));
    }

    //console.log(fullDataObject);

    const options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(fullDataObject),
    };
    fetch('/write', options)
    .then(data => {
        if (!data.ok) {
            throw Error(data.status);
        }
        return data.json();
    }).then(fulldata => {
        //console.log(fulldata);
    }).catch(e => {
        console.log(e);
    });
}

function deleteRow(trackId){
    index = undefined;
    localStorage.removeItem(trackId);
    const rows = document.getElementsByClassName("trackInfo");
    const myDataObject = [];
    let j = 0;
    for(let i = 0; i < rows.length; i++) {
        if(rows.item(i).childNodes.item(1).innerHTML != trackId){
        myDataObject[j] =  rows.item(i).childNodes.item(1).innerHTML;
        j++;
        }
    }

    const fullDataObject = {};

    for(let i = 0; i < myDataObject.length; i++){
        //console.log(myDataObject[i]);
        fullDataObject[i] = JSON.parse(localStorage.getItem(myDataObject[i]));
    }

    //location.reload(true);
    //console.log(fullDataObject);
    loadListFromObject(fullDataObject);
}



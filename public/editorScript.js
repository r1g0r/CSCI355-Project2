const nav = document.querySelector('.nav');
const infoEl = document.getElementById('info');
const searchBtn = document.getElementById('searchBtn');
const searchElem = document.getElementById('search');
const contentArea = document.querySelector('.content')
const noteContainer = document.querySelector('.noteContainer');
var lastNum = localStorage.length;
var data = {};

if(localStorage.length != 0) {
  updateLS();
}

window.addEventListener('scroll', fixNav);
searchBtn.addEventListener('click', getAlbums);
searchElem.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    getAlbums(event.target.value);
  }
});

function fixNav() {
    if(window.scrollY > nav.offsetHeight + 150) {
        nav.classList.add('active')
    } else {
        nav.classList.remove('active')
    }
}


async function getAlbums() {
  const url = new URL('https://itunes.apple.com/search');
  const params = { term: searchElem.value, media: 'music', entity: 'album', limit: '90'};
  url.search = new URLSearchParams(params);

  const res = await fetch(url, { method: 'POST'} );
  data = await res.json()
  contentArea.innerHTML = ``;

  if(searchElem.value.trim() == "")
    infoEl.innerHTML = ``;

  else{
    infoEl.innerHTML = `Albums found for "${searchElem.value}":`;
    data.results.forEach(item => {
      //console.log(item);
      contentArea.innerHTML += `
      <div class="albumContainer" onclick="openAlbum('${item.collectionId}')">
        <div style="background-image: url(${item.artworkUrl100});" class="result"></div>
        <div class="content">${item.artistName} <br>${item.collectionName}</div>
      </div>
      `;
    });
  }
}

async function openAlbum(cID){
  //console.log(cID);
  const url = new URL('https://itunes.apple.com/lookup');
  const params = {id: cID, media: 'music', entity: 'song'};
  url.search = new URLSearchParams(params);

  const res = await fetch(url, { method: 'POST'} );
  data = await res.json()
  contentArea.innerHTML = ``;
  //console.log(data.results[0].artworkUrl100);
  infoEl.innerHTML = `<img height="150px" width="150px" src="${data.results[0].artworkUrl100}" alt="${data.results[0].collectionName} Album Cover"><br> <b>Artist: ${data.results[0].artistName}<br> Album: ${data.results[0].collectionName}</b>`;
  contentArea.innerHTML += `
  <div>
    <table id="songTable">
      <th>Track No.</th> <th>Song</th> <th>Add to Playlist</th>
    </table>
  </div>`;
  const songTable = document.getElementById("songTable");

  for(var i = 1; i < data.results.length; i++){
    item = data.results[i];
    //console.log(item);
    //console.log(track);
    songTable.innerHTML += `
    <tr>
      <td>${i}</td> 
      <td>${item.trackName}</td>
      <td> <button width="50%" class="btn" id="add" onclick="addNewSong('${i}')">Add</button></td>
    </tr>
    `;
  }
}

function addNewSong(i) {
  //console.log(songs);
  const note = document.createElement('div')
  note.classList.add('playList');
  item = data.results[i];

  if(!localStorage.getItem(item.trackId)){
    localStorage.setItem(item.trackId, JSON.stringify(item));

    note.innerHTML += `
      <div class="albumContainer">
        <div class="tools"> Track ID: ${item.trackId}
            <button class="delete" onclick="deleteSong('${item.trackId}')"><b>X</b></button>
        </div>
        <div style="background-image: url('${data.results[0].artworkUrl100}');" class="result" onclick="openAlbum('${data.results[0].collectionId}')"></div>
        <div class="track"><b>${item.artistName} <br> ${item.collectionName} <br> ${item.trackName}</b></div>
      </div>`;

    const deleteBtn = note.querySelector('.delete');

    deleteBtn.addEventListener('click', () => {
        note.remove()
    })
    noteContainer.append(note);
  }
}

function deleteSong(trackId){
  localStorage.removeItem(trackId);
}

function updateLS() {
    Object.keys(localStorage).forEach(function(key){
      showStorage(key);
  });
  
  // for(let i = 0; i < localStorage.length; i++){
  //   //console.log(localStorage.key(i));
  //   showStorage(localStorage.key(i));
  // }
}

function showStorage(i) {
    const note = document.createElement('div')
    note.classList.add('playList');
    item = JSON.parse(localStorage.getItem(i));
    //console.log(i);

    note.innerHTML += `
      <div class="albumContainer">
        <div class="tools"> Track ID: ${item.trackId}
            <button class="delete" onclick="deleteSong('${item.trackId}')"><b>X</b></button>
        </div>
        <div style="background-image: url('${item.artworkUrl100}');" class="result" onclick="openAlbum('${item.collectionId}')"></div>
        <div class="track"><b>${item.artistName} <br> ${item.collectionName} <br> ${item.trackName}</b></div>
      </div>`;

    const deleteBtn = note.querySelector('.delete');

    deleteBtn.addEventListener('click', () => {
      //console.log(item.trackId);
      note.remove()
    })
    noteContainer.append(note);
}
  
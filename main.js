const form = document.querySelector('#form');
const search = document.querySelector('#search');
const result = document.querySelector('#result');
const more = document.querySelector('#more');


const apiUrl = 'https://api.lyrics.ovh/';

//Function to search by song or artisit
async function searchSongs(term){
    const res = await fetch(`${apiUrl}/suggest/${term}`);
    const data = await res.json();

    showData(data);
}

//Function to update song and artist on the DOM
function showData(data){
    result.innerHTML = `
    <ul class="songs">
        ${data.data.map(song => `
        <li>
            <span><strong>${song.artist.name}</strong> - ${song.title}</span>
            <button data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
        </li>`).join('')
    }
    </ul>
    `;

    if (data.prev || data.next) {
        more.innerHTML = `
            ${data.prev ? `<button onclick="getMoreSongs('${data.prev}')">Prev</button>` : ``}
            ${data.next ? `<button onclick="getMoreSongs('${data.next}')">Next</button>` : ``}
        `;
    } else {
        more.innerHTML = ``;
    }

}

//Function to get more songs on the next page or previous
async function getMoreSongs(url){
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();

    showData(data);
}

//Function to fetch lyrics
const getLyrics = async function(artist, songTitle){
    const res = await fetch(`${apiUrl}/v1/${artist}/${songTitle}`);
    const data = await res.json();

    //return a new line
    //global flag g to check the entire thing
    const lyrics = data.lyrics.replace(/(\r\n|\n)/g, '<br>');

    result.innerHTML = `
    <h2><strong>${artist}</strong> - ${songTitle}</h2>
    <span>${lyrics}</span>
    `;

    more.innerHTML = '';
}

//Event listener for submitting search
form.addEventListener('submit', e => {
    e.preventDefault();

    const searchTerm = search.value.trim();

    if (!searchTerm) {
        alert('Please type in something in the search bar');
    } else {
        searchSongs(searchTerm);
    }
});

//Functionality for getting lyrics on button click
//Event delegation
result.addEventListener('click', e => {
    var clickedEl = e.target;

    if (clickedEl.tagName === 'BUTTON') {
        const artist = clickedEl.getAttribute('data-artist');
        const songTitle = clickedEl.getAttribute('data-songtitle');

        getLyrics(artist, songTitle);
    } else {
        
    }
});
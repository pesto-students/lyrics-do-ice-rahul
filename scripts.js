/*
* variable to store cache data to reduce network call
*/
let cachedData = {};

/*
* change background color of div where search bar is in focus
*/
document.getElementById('search').addEventListener('focusin', () => {
  document.getElementById('searchBar').style.backgroundColor = '#e8f0fd';
});

/*
* change background color of div where search bar is out of focus
*/
document.getElementById('search').addEventListener('focusout', () => {
  document.getElementById('searchBar').style.backgroundColor = '#ffffff';
});

/*
* initialize pagination buttons and loading when when page loads
*/
window.addEventListener('load', () => {
  document.getElementById('prev').style.display = 'none';
  document.getElementById('next').style.display = 'none';
  document.getElementById('loading').style.display = 'none';
  if (localStorage.getItem('cachedData') !== null) {
    cachedData = JSON.parse(localStorage.getItem('cachedData'));
  }
//  console.log(cachedData);
});

/*
* fetching list of lyrics with appropriate headers
*/
async function fetchSuggestList(myURL, myHeaders) {
  document.getElementById('loading').style.display = 'initial';
  const response = await fetch(myURL, { headers: myHeaders });
  if (!response.ok) {
    // console.log(response);
    return '';
  }
  const text = await response.text();
  return text;
}

/*
* showing list of lyrics on screen
*/
function renderList(response) {
  const result = JSON.parse(response);
  const { prev, next, data } = result;

  if (prev) {
    document.getElementById('prev').style.display = 'initial';
    document.getElementById('prev').setAttribute('data-url', prev);
  } else {
    document.getElementById('prev').style.display = 'none';
  }
  if (next) {
    document.getElementById('next').style.display = 'initial';
    document.getElementById('next').setAttribute('data-url', next);
  } else {
    document.getElementById('next').style.display = 'none';
  }

  let str = '';
  for (let i = 0; i < data.length; i += 1) {
    str += `<p><span class="artistTitle"><strong> ${data[i].artist.name} </strong> - ${data[i].title} </span><span artist="${data[i].artist.name}" title="${data[i].title}" id="${data[i].id}" class="showLyrics">Show Lyrics</span></p>`;
  }
  document.getElementById('searchResult').innerHTML = str;
  document.getElementById('loading').style.display = 'none';
}

/*
* cache list of lyrics already queried
*/
function cacheList(func) {
  return (...args) => {
    const key = JSON.stringify(args);
    if (!(key in cachedData)) {
      func(...args).then((response) => {
        cachedData[key] = response;
        localStorage.setItem('cachedData', JSON.stringify(cachedData));
        renderList(cachedData[key]);
      });
    } else {
      renderList(cachedData[key]);
    }
    return cachedData[key];
  };
}

/*
  * fetch lyrics from server
  */
async function getLyrics(queryString) {
  const artist = queryString.getAttribute('artist');
  const title = queryString.getAttribute('title');
  const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
  if (!response.ok) {
    // console.log(response);
    return '';
  }
  const text = await response.text();
  const result = JSON.parse(text);
  result.artist = artist;
  result.title = title;
  return JSON.stringify(result);
}

/*
* show lyrics on screen
*/
function renderLyrics(response) {
  const result = JSON.parse(response);
  const { artist, lyrics, title } = result;
  const lyricsFiltered = lyrics.replace(/(?:\r\n|\r|\n)/g, '<br>');
  document.getElementById('searchResult').innerHTML = `<p> <span class="heading"><strong>${artist}</strong> - ${title} </span><br/><br/>${lyricsFiltered}</p>`;
  document.getElementById('prev').style.display = 'none';
  document.getElementById('next').style.display = 'none';
  document.getElementById('loading').style.display = 'none';
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

/*
* cache lyrics already queried
*/
function cacheLyrics(func) {
  return (...args) => {
    const key = args[0].getAttribute('id');
    if (!(key in cachedData)) {
      func(...args).then((response) => {
        cachedData[key] = response;
        localStorage.setItem('cachedData', JSON.stringify(cachedData));
        renderLyrics(cachedData[key]);
      });
    } else {
      renderLyrics(cachedData[key]);
    }
    return cachedData[key];
  };
}

/*
* fetch lyrics using event delegation
*/
document.getElementById('searchResult').addEventListener('click', (e) => {
  cacheLyrics(getLyrics)(document.getElementById(e.target.id));
});

/*
* fetch list of lyrics on click of search button
*/
document.getElementById('searchbtn').addEventListener('click', () => {
  const searchQuery = document.getElementById('search').value;
  const myHeaders = { 'Accept-Charset': 'utf-8', 'Content-Type': 'application/json' };
  cacheList(fetchSuggestList)(`https://api.lyrics.ovh/suggest/${searchQuery}`, myHeaders);
});

/*
* fetch next page of search result
*/
document.getElementById('next').addEventListener('click', () => {
  document.getElementById('next').style.display = 'none';
  const getDataURL = document.getElementById('next').getAttribute('data-url');
  const myHeaders = { 'Accept-Charset': 'utf-8', 'Content-Type': 'application/json', 'X-Requested-With': 'xhr' };
  cacheList(fetchSuggestList)(`https://cors-anywhere.herokuapp.com/${getDataURL}`, myHeaders);
});

/*
* fetch previous page of fetch result
*/
document.getElementById('prev').addEventListener('click', () => {
  document.getElementById('prev').style.display = 'none';
  const getDataURL = document.getElementById('prev').getAttribute('data-url');
  const myHeaders = { 'Accept-Charset': 'utf-8', 'Content-Type': 'application/json', 'X-Requested-With': 'xhr' };
  cacheList(fetchSuggestList)(`https://cors-anywhere.herokuapp.com/${getDataURL}`, myHeaders);
});

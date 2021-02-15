import {
  inputSearch,
  searchBlock,
  prevButton,
  nextButton,
  loadingBlock,
  resultBlock,
  searchButton,
  corsURL,
  searchAPIUrl,
  getList,
  getLyrics,
  HEADERS,
  CORS_HEADER,
} from './constants.js';

/*
* change background color of div where search bar is in focus
*/
inputSearch.addEventListener('focusin', () => {
  searchBlock.style.backgroundColor = '#e8f0fd';
});

/*
* change background color of div where search bar is out of focus
*/
inputSearch.addEventListener('focusout', () => {
  searchBlock.style.backgroundColor = '#ffffff';
});

/*
* showing list of lyrics on screen
*/
function renderList(response) {
  const result = response;
  const { prev, next, data } = result;

  if (prev) {
    prevButton.style.display = 'initial';
    prevButton.setAttribute('data-url', prev);
  } else {
    prevButton.style.display = 'none';
  }
  if (next) {
    nextButton.style.display = 'initial';
    nextButton.setAttribute('data-url', next);
  } else {
    nextButton.style.display = 'none';
  }

  let str = '';
  for (let i = 0; i < data.length; i += 1) {
    str += `<p><span class="artistTitle"><strong> ${data[i].artist.name} </strong> - ${data[i].title} </span><span artist="${data[i].artist.name}" title="${data[i].title}" id="${data[i].id}" class="showLyrics">Show Lyrics</span></p>`;
  }
  resultBlock.innerHTML = str;
  loadingBlock.style.display = 'none';
}

/*
* show lyrics on screen
*/
function renderLyrics(response) {
  const { artist, lyrics, title } = response;
  const lyricsFiltered = lyrics.replace(/(?:\r\n|\r|\n)/g, '<br>');
  resultBlock.innerHTML = `<p> <span class="heading"><strong>${artist}</strong> - ${title} </span><br/><br/>${ lyricsFiltered != '' ? lyricsFiltered : 'No Lyrics Found' }</p>`;
  prevButton.style.display = 'none';
  nextButton.style.display = 'none';
  loadingBlock.style.display = 'none';
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
}

/*
* fetch lyrics using event delegation
*/
resultBlock.addEventListener('click', (event) => {
  if (event.target.getAttribute('artist')) {
    loadingBlock.style.display = 'initial';
    const myLyrics = getLyrics(event.target);
    myLyrics.then((response) => {
      renderLyrics(response);
    });
  }
});

/*
* fetch list of lyrics on click of search button
*/
searchButton.addEventListener('click', () => {
  const searchQuery = inputSearch.value;
  loadingBlock.style.display = 'initial';
  const myList = getList(`${searchAPIUrl}/${searchQuery}`, HEADERS);
  myList.then((response) => {
    renderList(response);
  });
});

/*
* fetch next page of search result
*/
nextButton.addEventListener('click', () => {
  nextButton.style.display = 'none';
  const getDataURL = nextButton.getAttribute('data-url');
  loadingBlock.style.display = 'initial';
  const myList = getList(`${corsURL}${encodeURIComponent(getDataURL)}`, CORS_HEADER);
  myList.then((response) => {
    renderList(response);
  });
});

/*
* fetch previous page of fetch result
*/
prevButton.addEventListener('click', () => {
  prevButton.style.display = 'none';
  const getDataURL = prevButton.getAttribute('data-url');
  loadingBlock.style.display = 'initial';
  const myList = getList(`${corsURL}${encodeURIComponent(getDataURL)}`, CORS_HEADER);
  myList.then((response) => {
    renderList(response);
  });
});

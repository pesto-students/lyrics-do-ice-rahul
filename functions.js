/*
* cache list of lyrics already queried
*/
function cacheList(func) {
  const cachedData = {};
  return (...args) => {
    return new Promise((resolve, reject) => {
      const key = JSON.stringify(args);
      if (!(key in cachedData)) {
        func(...args).then((response) => {
          cachedData[key] = response;
          resolve(cachedData[key]);
        });
      } else {
        resolve(cachedData[key]);
      }
    });
  };
}

/*
* cache lyrics already queried
*/
function cacheLyrics(func) {
  const cachedData = {};
  return (...args) => {
    return new Promise((resolve, reject) => {
      const key = args[0].getAttribute('id');
      if (!(key in cachedData)) {
        func(...args).then((response) => {
          cachedData[key] = response;
          resolve(cachedData[key]);
        });
      } else {
        resolve(cachedData[key]);
      }
    });
  };
}

/*
* fetching list of lyrics with appropriate headers
*/
function fetchSuggestList(myURL, myHeaders) {
  return new Promise((resolve, reject) => {
    Promise.resolve(fetch(myURL, { headers: myHeaders }))
      .then((response) => resolve(response.json()));
  });
}

/*
* fetch lyrics from server
*/
function fetchLyrics(queryString) {
  const lyricsAPIUrl = 'https://api.lyrics.ovh/v1';
  const artist = queryString.getAttribute('artist');
  const title = queryString.getAttribute('title');
  return new Promise((resolve, reject) => {
    Promise.resolve(fetch(`${lyricsAPIUrl}/${artist}/${title}`))
      .then((response) => response.json())
      .then((result) => {
        result.artist = artist;
        result.title = title;
        resolve(result);
      });
  });
}

export { cacheList, cacheLyrics, fetchSuggestList, fetchLyrics }

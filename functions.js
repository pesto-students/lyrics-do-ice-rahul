/*
* fetching list of lyrics with appropriate headers
*/
async function fetchSuggestList(myURL, myHeaders) {
  document.getElementById('loading').style.display = 'initial';
  const response = await fetch(myURL, { headers: myHeaders });
  if (!response.ok) {
    return '';
  }
  const text = await response.text();
  return text;
}

/*
* fetch lyrics from server
*/
async function getLyrics(artist, title) {
  const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
  if (!response.ok) {
    return '';
  }
  const text = await response.text();
  const result = JSON.parse(text);
  result.artist = artist;
  result.title = title;
  return JSON.stringify(result);
}
exports.fetchSuggestList = fetchSuggestList;
exports.getLyrics = getLyrics;

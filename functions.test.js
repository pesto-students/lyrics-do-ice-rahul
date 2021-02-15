import { fetchSuggestList, getLyrics } from './functions';

test('Count of lyrics suggestion in one page', () => {
  const myHeaders = { 'Accept-Charset': 'utf-8', 'Content-Type': 'application/json' };
  fetchSuggestList('https://api.lyrics.ovh/suggest/stairway', myHeaders)
    .then((response) => {
      const result = JSON.parse(response);
      const { data } = result;
      expect(data.length).toBe(15);
    });
});

test('Check url for next page to be not null', () => {
  const myHeaders = { 'Accept-Charset': 'utf-8', 'Content-Type': 'application/json' };
  fetchSuggestList('https://api.lyrics.ovh/suggest/stairway', myHeaders)
    .then((response) => {
      const result = JSON.parse(response);
      const { next } = result;
      expect(next).toBe(!null);
    });
});

test('Check url for prev page to be null for first page', () => {
  const myHeaders = { 'Accept-Charset': 'utf-8', 'Content-Type': 'application/json' };
  fetchSuggestList('https://api.lyrics.ovh/suggest/stairway', myHeaders)
    .then((response) => {
      const result = JSON.parse(response);
      const { prev } = result;
      expect(prev).toBe(null);
    });
});

test('Check url for prev page to be not null for second page', () => {
  const myHeaders = { 'Accept-Charset': 'utf-8', 'Content-Type': 'application/json', 'X-Requested-With': 'xhr' };
  fetchSuggestList('https://cors-anywhere.herokuapp.com/http://api.deezer.com/search?limit=15&q=stairway&index=15', myHeaders)
    .then((response) => {
      const result = JSON.parse(response);
      const { prev } = result;
      expect(prev).toBe(!null);
    });
});

test('Check lyrics for artist - Led Zeppelin and title - Stairway to Heaven (Remaster) to be not null', () => {
  getLyrics('Led Zeppelin', 'Stairway to Heaven (Remaster')
    .then((response) => {
      expect(response).toBe(!null);
    });
});

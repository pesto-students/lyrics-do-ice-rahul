import { cacheList, cacheLyrics, fetchSuggestList, fetchLyrics  } from './functions.js';
const inputSearch = document.getElementById('search');
const searchBlock = document.getElementById('searchBar');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const loadingBlock = document.getElementById('loading');
const resultBlock = document.getElementById('searchResult');
const searchButton = document.getElementById('searchbtn');
const getList = cacheList(fetchSuggestList);
const getLyrics = cacheLyrics(fetchLyrics);
const corsURL = 'https://api.allorigins.win/raw?url=';
const searchAPIUrl = 'https://api.lyrics.ovh/suggest';
const HEADERS = { 'Accept-Charset': 'utf-8', 'Content-Type': 'application/json' };
const CORS_HEADER = { ...HEADERS, 'X-Requested-With': 'xhr' };

export {
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
    CORS_HEADER
}
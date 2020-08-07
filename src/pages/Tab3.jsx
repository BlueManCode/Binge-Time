import React, { useState, useCallback, useEffect } from 'react';
import { IonContent, IonPage, IonInfiniteScroll } from '@ionic/react';
import './Tab3.css';
import SearchBar from '../components/SearchBar';
import SuggestionPanel from '../components/SuggestionPanel';
import ShowCard from '../components/ShowCard';

const Tab3 = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [trendingShowData, setTrendingShowData] = useState([]);
  const [popularShowData, setPopularShowData] = useState([]);
  const [returningShowData, setReturningShowData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const tvSearchUrl =
    'https://api.themoviedb.org/3/search/tv?api_key=cff0969daf050d52538de763b27b148b&language=en-US&page=1&query=';

  useEffect(() => {
    const airingTodayUrl =
      'https://api.themoviedb.org/3/tv/airing_today?api_key=cff0969daf050d52538de763b27b148b&language=en-US&page=1';
    const onTheAirUrl =
      'https://api.themoviedb.org/3/tv/on_the_air?api_key=cff0969daf050d52538de763b27b148b&language=en-US&page=1';
    const popularUrl =
      'https://api.themoviedb.org/3/tv/popular?api_key=cff0969daf050d52538de763b27b148b&language=en-US&page=1';

    // get popular show data
    async function getPopularShowData() {
      await fetch(popularUrl)
        .then((res) => {
          return res.json();
        })
        .then((jsonData) => {
          let data = [];
          for (let i = 0; i < 8; i++) {
            data[i] = jsonData.results[i];
          }
          setPopularShowData(data);
        });
    }

    // get popular show data
    async function getTrendingShowData() {
      await fetch(onTheAirUrl)
        .then((res) => {
          return res.json();
        })
        .then((jsonData) => {
          let data = [];
          for (let i = 0; i < 8; i++) {
            data[i] = jsonData.results[i];
          }
          setTrendingShowData(data);
        });
    }

    // get popular show data
    async function getReturningShowData() {
      await fetch(airingTodayUrl)
        .then((res) => {
          return res.json();
        })
        .then((jsonData) => {
          let data = [];
          for (let i = 0; i < 8; i++) {
            data[i] = jsonData.results[i];
          }
          setReturningShowData(data);
        });
    }

    getPopularShowData();
    getTrendingShowData();
    getReturningShowData();
  }, []);

  const fetchShows = useCallback(async () => {
    if (searchTerm) {
      // fetch from the api
      await fetch(tvSearchUrl + searchTerm)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          setSearchResults(data.results);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, setSearchResults]);
  return (
    <IonPage>
      <IonContent className="body">
        <IonInfiniteScroll className="container">
          <span> Binge Time </span>{' '}
          <SearchBar
            fetchShows={fetchShows}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />{' '}
          {/* check if the array is empty or not */}{' '}
          {trendingShowData.length < 4 || searchTerm !== '' ? (
            <div> </div>
          ) : (
            <SuggestionPanel
              title={'🔥 Trending now'}
              data={trendingShowData}
            />
          )}{' '}
          {/* check if the array is empty or not */}{' '}
          {popularShowData.length < 4 || searchTerm !== '' ? (
            <div> </div>
          ) : (
            <SuggestionPanel title={'🎉 Popular'} data={popularShowData} />
          )}{' '}
          {/* check if the array is empty or not */}{' '}
          {returningShowData.length < 4 || searchTerm !== '' ? (
            <div> </div>
          ) : (
            <SuggestionPanel
              title={'📺 Currently Airing shows'}
              data={returningShowData}
            />
          )}{' '}
          {/* search result over here */}{' '}
          {searchTerm ? (
            <div
              style={{
                columnCount: '3',
                marginTop: '10px',
              }}>
              {' '}
              {searchResults.map((data, key) => (
                <ShowCard key={key} data={data} />
              ))}{' '}
            </div>
          ) : (
            <div> </div>
          )}{' '}
        </IonInfiniteScroll>{' '}
      </IonContent>{' '}
    </IonPage>
  );
};

export default Tab3;

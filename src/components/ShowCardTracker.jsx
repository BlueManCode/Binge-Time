import React, { useState, useEffect, useCallback } from 'react';
import {
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonItem,
} from '@ionic/react';
import './css/ShowCardTracker.css';

import ShowCard from './ShowCard';

const ShowTrackerCard = ({ showData }) => {
  let [key, setKey] = useState(0);
  let [totalProgress, setTotalProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // show details
  const [currentPoster, setCurrentPoster] = useState('');
  const [currentSeason, setCurrentSeason] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(null);
  const [episodeData, setEpisodeData] = useState([]);
  const [totalWatchedEpisodes, setTotalWatchedEpisodes] = useState(0);

  let url = `https://api.themoviedb.org/3/tv/${showData.id}/season/${currentSeason}/episode/${currentEpisode}?api_key=cff0969daf050d52538de763b27b148b&language=en-US`;

  const getCurrentShowData = useCallback(async () => {
    const temp = JSON.parse(localStorage.getItem('master'));
    const index = temp.findIndex((item) => item.id === showData.id);
    const total_season_number = temp[index].seasons.length;

    if (currentSeason === null && currentEpisode === null) {
      for (let i = 0; i < total_season_number; i++) {
        let episodeCount = temp[index].seasons[i].episode_count;
        for (let j = 0; j < episodeCount; j++) {
          if (
            !temp[index].seasons[i].episode_list[j].watched &&
            temp[index].seasons[i].season_number !== 0
          ) {
            setCurrentEpisode(j + 1);
            setCurrentSeason(i);
            i = 10000;
            j = 10000;
          }
        }
      }
    }
  }, [showData.id, currentEpisode, currentSeason]);

  useEffect(() => {
    getCurrentShowData();
  }, [key]);

  useEffect(() => {
    const temp = JSON.parse(localStorage.getItem('master'));
    const index = temp.findIndex((item) => item.id === showData.id);
    const total_season_number = temp[index].seasons.length;
    let watchedEpisodeCount = 0;

    for (let i = 0; i < total_season_number; i++) {
      let episodeCount = temp[index].seasons[i].episode_count;
      for (let j = 0; j < episodeCount; j++) {
        if (temp[index].seasons[i].episode_list[j].watched) {
          watchedEpisodeCount = watchedEpisodeCount + 1;
        }
      }
    }

    setTotalWatchedEpisodes(watchedEpisodeCount);

    // calculate the total progress based on total watched episodes
    setTotalProgress((totalWatchedEpisodes / showData.totalEpisodes) * 100);

    if (isLoading) {
      // fetch the latest episode data
      async function fetcher() {
        await fetch(url)
          .then((res) => {
            return res.json();
          })
          .then(async (json) => {
            await setEpisodeData(json);
            await setCurrentPoster(
              `https://image.tmdb.org/t/p/w500${json.still_path}`,
            );
            // set the fetched data
            setIsLoading(false);
          });
      }
      fetcher();

      // update episode and season if watched
      if (showData.currentSeason <= showData.totalSeasons) {
        setTotalWatchedEpisodes(showData.totalWatchedEpisodes);
      }
    }
    // console.log(episodeData);
  }, [
    episodeData,
    totalWatchedEpisodes,
    currentEpisode,
    currentSeason,
    isLoading,
    showData.totalEpisodes,
    showData.id,
    showData.currentSeason,
    showData.totalSeasons,
    showData.totalWatchedEpisodes,
    showData.currentEpisode,
    url,
    key,
  ]);

  const nextEpisode = useCallback(() => {
    setIsLoading(true);

    const temp = JSON.parse(localStorage.getItem('master'));
    const index = temp.findIndex((item) => item.id === showData.id);
    const seasonIndex = temp[index].seasons.findIndex(
      (item) => item.season_number === currentSeason,
    );
    const episodeIndex = temp[index].seasons[
      seasonIndex
    ].episode_list.findIndex((item) => item.episode_number === currentEpisode);

    temp[index].seasons[seasonIndex].episode_list[episodeIndex].watched = true;

    localStorage.setItem('master', JSON.stringify(temp));

    getCurrentShowData();

    setIsLoading(false);
    setKey(key++);
    window.location.reload();
  }, [key, getCurrentShowData, currentSeason, currentEpisode, showData.id]);

  return (
    <div>
      {isLoading ? (
        <div> Loading... </div>
      ) : (
        <IonItemSliding key={key}>
          <IonItem
            style={{
              '--padding-bottom': '0',
              '--padding-start': '0',
              '--padding-end': '0',
              '--border-style': 'none',
              color: 'white',
            }}
            onIonSwipe={() => {
              nextEpisode();
            }}>
            <div
              style={{
                width: '100%',
              }}
              className="show-tracker-card-container">
              <div
                style={{
                  marginLeft: '4vw',
                }}>
                <ShowCard
                  data={{
                    name: showData.name,
                    poster_path: showData.poster,
                    backdrop_path: showData.backdrop_path,
                    id: showData.id,
                  }}
                />{' '}
              </div>{' '}
              <div className="card-header">
                <span
                  style={{
                    fontWeight: 'bold',
                    marginBottom: '1vw',
                  }}>
                  {' '}
                  {showData.name ? showData.name : 'N/A'}{' '}
                </span>{' '}
                <div
                  style={{
                    display: 'flex',
                  }}>
                  <span
                    style={{
                      fontWeight: 'normal',
                      fontSize: '4vw',
                    }}>
                    S
                    {currentSeason.toString().length === 1
                      ? '0' + currentSeason
                      : currentSeason}
                    E
                    {currentEpisode.toString().length === 1
                      ? '0' + currentEpisode
                      : currentEpisode}
                    :
                  </span>
                  <span
                    style={{
                      fontWeight: 'normal',
                      fontSize: '4vw',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      width: '65%',
                      marginLeft: '1vw',
                    }}>
                    {episodeData.name ? episodeData.name : 'N/A'}
                  </span>
                </div>
                <div className="card-middle">
                  <div className="show-tracker-card-progressbar-container">
                    <div
                      style={{
                        width: `${totalProgress}%`,
                      }}
                      className="show-tracker-card-progressbar"></div>
                  </div>
                  <span
                    style={{
                      fontSize: '4vw',
                      fontWeight: 'bold',
                    }}>
                    {totalWatchedEpisodes}/{showData.totalEpisodes}{' '}
                  </span>
                </div>
                <button
                  style={{
                    background: 'rgb(38, 37, 42)',
                    color: 'white',
                    fontWeight: 'bold',
                    padding: '2vw',
                    width: '50%',
                    borderRadius: '1vw',
                    marginTop: '2vw',
                    fontSize: '4vw',
                  }}>
                  Episode info
                </button>
              </div>
            </div>
            <IonItemOptions slot="end">
              <IonItemOption color="success"> Watched </IonItemOption>{' '}
            </IonItemOptions>
          </IonItem>
        </IonItemSliding>
      )}
    </div>
  );
};

export default ShowTrackerCard;

import React, { useEffect, useState, useCallback } from 'react';
import { IonModal, IonButton, IonInfiniteScroll } from '@ionic/react';
import ShowSeasonPanel from './ShowSeasonPanel';
import './css/ShowModal.css';

const ShowModal = ({ data, showModal, setShowModal }) => {
  const imgUrl = 'https://image.tmdb.org/t/p/w500';
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [master, setMaster] = useState([]);
  const [moreData, setMoreData] = useState([]);
  const [subData, setSubData] = useState([]);
  const [seasonDetail, setSeasonDetail] = useState([]);

  useEffect(() => {
    if (moreData.length === 0) {
      const url =
        'https://api.themoviedb.org/3/tv/' +
        data.id +
        '?api_key=cff0969daf050d52538de763b27b148b&language=en-US';
      async function getMoreData() {
        await fetch(url)
          .then((res) => {
            return res.json();
          })
          .then(async (jsonData) => {
            setMoreData(jsonData);
            const object = {
              id: jsonData.id,
              genre: jsonData.genres[0].name,
              runTime: jsonData.episode_run_time[0],
              network: jsonData.networks[0].name,
            };
            // get some sub data
            setSeasonDetail(jsonData.seasons);
            setSubData(object);
            setIsLoading(false);
          });
      }
      getMoreData();
    }
    // check if the local storage exist
    const isMaster = JSON.parse(localStorage.getItem('master'));
    if (isMaster) {
      // since master exist
      setMaster(isMaster);
      // check if the current show is already added
      isMaster.forEach((item) => {
        if (item.id === data.id) {
          // show already added
          setIsAdded(true);
        }
      });
    } else {
      // master doesnt exist create master
      localStorage.setItem('master', JSON.stringify([]));
    }
  }, [data.id, moreData]);

  const changeAdded = useCallback(() => {
    const temp = master;

    if (isAdded) {
      // remove from the master
      temp.forEach((item, index) => {
        if (item.id === data.id) {
          temp.splice(index, 1);
        }

        // update the local master
        setMaster(temp);
        localStorage.setItem('master', JSON.stringify(temp));
        setIsAdded(false);
      });
    }
    // add to the master
    else {
      console.log(data);
      // add to the master
      const object = {
        id: data.id,
        name: data.name,
        poster: moreData.poster_path,
        backdrop_path: moreData.backdrop_path,
        episodeLength: moreData.episode_run_time[0],
        totalEpisodes: moreData.number_of_episodes,
        totalSeasons: moreData.number_of_seasons,
        totalWatchedEpisodes: 0,
        currentEpisode: 1,
        currentSeason: 1,
        totalWatchTime: 0,
        isOver: moreData.status === 'Ended' ? true : false,
        seasons: [],
      };
      // update the local master
      temp.push(object);
      setMaster(temp);
      localStorage.setItem('master', JSON.stringify(temp));
      setIsAdded(true);
    }
  }, [isAdded, data.id, data.name, master]);
  return (
    <IonModal
      onDidDismiss={() => {
        setShowModal(false);
      }}
      className="body"
      isOpen={showModal}>
      <IonInfiniteScroll className="test">
        <img
          alt="backdrop poster"
          src={
            data.backdrop_path
              ? `${imgUrl}${data.backdrop_path}`
              : require('../res/notFoundBackdrop.png')
          }
        />
        {isLoading ? (
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}>
            <img
              style={{
                width: '12vw',
              }}
              alt="loading"
              src={require('../res/loadingIcon.gif')}></img>{' '}
          </div>
        ) : (
          <div>
            <div className="header">
              <img
                className="poster"
                alt="poster"
                src={`${imgUrl}${data.poster_path}`}
              />{' '}
              <div className="title">
                <span> {data.name} </span>{' '}
                <span className="status"> {moreData.status} </span>{' '}
              </div>{' '}
              <div className="btn" onClick={() => changeAdded()}>
                {' '}
                {!isAdded ? (
                  <svg
                    viewBox="0 0 24 24"
                    className="icon-add"
                    strokeWidth="1"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10">
                      {' '}
                    </circle>{' '}
                    <line x1="12" y1="8" x2="12" y2="16">
                      {' '}
                    </line>{' '}
                    <line x1="8" y1="12" x2="16" y2="12">
                      {' '}
                    </line>{' '}
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    className="icon-added"
                    strokeWidth="1"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"> </path>{' '}
                    <polyline points="22 4 12 14.01 9 11.01"> </polyline>{' '}
                  </svg>
                )}{' '}
              </div>{' '}
            </div>{' '}
            <div className="middle">
              <span className="overview"> {moreData.overview} </span>{' '}
            </div>{' '}
            <div className="middle-2">
              <hr className="divider"></hr>{' '}
              <div className="middle-data">
                <span>
                  ⭐{moreData.vote_average}. {subData.genre}. {subData.runTime}
                  min. {subData.network}{' '}
                </span>{' '}
              </div>{' '}
              <hr className="divider"></hr>
            </div>
            <div className="end">
              <span className="end-title"> Seasons </span>{' '}
              {seasonDetail.length !== 0 ? (
                <div className="end-container">
                  {seasonDetail.map((season, key) => (
                    <div key={key}>
                      {season.episode_count === 0 ? null : (
                        <div>
                          <ShowSeasonPanel
                            isAdded={isAdded}
                            showId={data.id}
                            currentEpisode={0}
                            data={season}
                            key={key}
                          />
                          <hr className="divider"></hr>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div> </div>
              )}
            </div>
            <div className="exit">
              <IonButton
                className="exit-btn"
                onClick={() => setShowModal(false)}>
                Close
              </IonButton>
            </div>
          </div>
        )}
      </IonInfiniteScroll>
    </IonModal>
  );
};

export default ShowModal;

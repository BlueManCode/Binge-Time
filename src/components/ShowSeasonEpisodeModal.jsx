import React, { useState, useEffect } from 'react';
import {
  IonModal,
  IonButton,
  IonCheckbox,
  IonInfiniteScroll,
} from '@ionic/react';

import './css/ShowSeasonEpisodeModal.css';
const ShowSeasonEpisodeModal = ({
  isAdded,
  showId,
  episodeCount,
  setEpisodeCount,
  showSeasonModal,
  setShowSeasonModal,
  data,
}) => {
  const temp = JSON.parse(localStorage.getItem('master'))
  const index = temp.findIndex(item => item.id === showId);
  const seasonIndex = temp[index].seasons.findIndex(item => item.season_number === data.season_number)

  const [episodeWatched, setEpisodeWatched] = useState(0);
  const [progress, setProgress] = useState(0)
  const [episodes, setEpisodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    let count = 0
    temp[index].seasons[seasonIndex].episode_list.forEach(item => {
      if(item.watched){
        count = count + 1
      }
    })

    setEpisodeWatched(count)
    setProgress((episodeWatched / data.episode_count) * 100);

    // get the season data and append into the content
    if (episodes.length === 0) {
      const object = {
        season: data.season_number,
        episode: [],
      };
      async function fetcher() {
        for (let i = 1; i <= data.episode_count; i++) {
          let fetchUrl = `https://api.themoviedb.org/3/tv/${showId}/season/${data.season_number}/episode/${i}?api_key=cff0969daf050d52538de763b27b148b&language=en-US`;
          await fetch(fetchUrl)
            .then((res) => {
              return res.json();
            })
            .then((json) => {
              object.episode.push({
                episodeNo: json.episode_number,
                episodeName: json.name,
                episodeOverview: json.overview,
                episodeDate: json.air_date,
              });
            });
        }
        setEpisodes((episodes) => [object, ...episodes]);
      }
      fetcher();
    } else {
      setIsLoading(false);
    }
  }, [episodes, showId, data.episode_count, data.season_number, seasonIndex, temp, index]);

  return (
    <IonModal
      className="season-modal-container"
      onDidDismiss={() => setShowSeasonModal(false)}
      isOpen={showSeasonModal}>
      <IonInfiniteScroll
        style={{
          overflowY: 'scroll',
          height: '100vh',
        }}>
        <div>
          <div className="season-modal-header">
            <div className="season-title-container">
              <span> {data.name} </span>{' '}
            </div>{' '}
            <span className="select-all"> Select All </span>{' '}
          </div>{' '}
          <div className="season-modal-progressbar-header">
            <div className="season-modal-progressbar-container">
              <div style={{width: `${progress}%`}} className="season-modal-progressbar"> </div>{' '}
            </div>{' '}
            <span>
              {episodeWatched}/{data.episode_count}{' '}
            </span>{' '}
          </div>{' '}
          {isLoading ? (
            <div className="loader">
              <img alt="loading" src={require('../res/loadingIcon.gif')}></img>{' '}
            </div>
          ) : (
            <div>
              {episodes[0].episode.map((item, key) => (
                <div key={key}>
                  <div className="episode-container">
                    <div className="episode-detail-container">
                      <span className="episode-title">{item.episodeName} </span>
                      <span className="episode-detail">
                        S
                        {episodes[0].season < 10
                          ? '0' + episodes[0].season
                          : episodes[0].season}
                        E
                        {item.episodeNo.toString().length === 1
                          ? '0' + item.episodeNo
                          : item.episodeNo}
                        . {item.episodeDate ? item.episodeDate : 'Coming Soon'}{' '}
                      </span>
                    </div>
                    <IonCheckbox
                      checked={temp[index].seasons[seasonIndex].episode_list[item.episodeNo - 1].watched}
                      disabled={item.episodeDate && isAdded ? false : true}
                      className="episode-check"
                      onIonChange={(e) => {
                        if(e.detail.checked){
                          temp[index].seasons[seasonIndex].episode_list[item.episodeNo - 1].watched = true
                          localStorage.setItem('master', JSON.stringify(temp))
                          setEpisodeCount(episodeCount + 1)
                        }
                        else{
                          temp[index].seasons[seasonIndex].episode_list[item.episodeNo - 1].watched = false
                          localStorage.setItem('master', JSON.stringify(temp))
                          setEpisodeCount(episodeCount - 1)
                        }
                      }}
                    />
                  </div>
                  <hr className="divider"></hr>{' '}
                </div>
              ))}
              <IonButton onClick={() => setShowSeasonModal(false)}>
                Close
              </IonButton>
            </div>
          )}
        </div>
      </IonInfiniteScroll>
    </IonModal>
  );
};

export default ShowSeasonEpisodeModal;

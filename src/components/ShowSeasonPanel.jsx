import React, { useState, useEffect } from 'react';
import { IonCheckbox } from '@ionic/react';
import ProgressBar from './ProgressBar';
import ShowSeasonEpisodeModal from './ShowSeasonEpisodeModal';
import './css/ShowSeasonPanel.css';

const ShowSeasonPanel = ({ isAdded, showId, data, currentEpisode }) => {
  const [showSeasonModal, setShowSeasonModal] = useState();
  const [episodeCount, setEpisodeCount] = useState(currentEpisode);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const temp = JSON.parse(localStorage.getItem('master'));
    if (isAdded) {
      const index = temp.findIndex((item) => item.id === showId);
      // if season is already added
      if (
        temp[index].seasons.findIndex(
          (item) => item.season_number === data.season_number,
        ) !== -1
      ) {
        // check if the season is completed
        const seasonIndex = temp[index].seasons.findIndex(
          (item) => item.season_number === data.season_number,
        );
        setEpisodeCount(temp[index].seasons[seasonIndex].current_count);
        if (
          temp[index].seasons[seasonIndex].episode_count ===
          temp[index].seasons[seasonIndex].current_count
        ) {
          setCompleted(true);
        }
        // check how many episode is watched
        let seasonEpisodeCount = 0;
        for (
          let i = 0;
          i < temp[index].seasons[seasonIndex].episode_count;
          i++
        ) {
          if (
            temp[index].seasons[seasonIndex].episode_list[i].watched === true
          ) {
            seasonEpisodeCount = seasonEpisodeCount + 1;
          }
        }
        setEpisodeCount(seasonEpisodeCount);
      }

      // if season is not added, create and add it
      else {
        const object = {
          season_number: data.season_number,
          episode_count: data.episode_count,
          current_count: 0,
          episode_list: [],
          completed: false,
        };
        for (let i = 1; i <= data.episode_count; i++) {
          object.episode_list.push({
            episode_number: i,
            watched: false,
          });
        }
        temp[index].seasons.push(object);
        localStorage.setItem('master', JSON.stringify(temp));
      }
    }
  }, [isAdded, showId, data.episode_count, data.season_number]);

  function handleSeasonWatched() {
    const temp = JSON.parse(localStorage.getItem('master'));
    const index = temp.findIndex((item) => item.id === showId);
    const seasonIndex = temp[index].seasons.findIndex(
      (item) => item.season_number === data.season_number,
    );
    // remove all watched data
    if (completed) {
      temp[index].seasons[seasonIndex].current_count = 0;
      temp[index].seasons[seasonIndex].completed = false;
      for (let i = 0; i < temp[index].seasons[seasonIndex].episode_count; i++) {
        temp[index].seasons[seasonIndex].episode_list[i].watched = false;
      }
      setEpisodeCount(0);
      setCompleted(false);
    }
    // all episodes seen
    else {
      temp[index].seasons[seasonIndex].current_count =
        temp[index].seasons[seasonIndex].episode_count;
      temp[index].seasons[seasonIndex].completed = true;
      for (let i = 0; i < temp[index].seasons[seasonIndex].episode_count; i++) {
        temp[index].seasons[seasonIndex].episode_list[i].watched = true;
      }
      setEpisodeCount(data.episode_count);
      setCompleted(true);
    }
    localStorage.setItem('master', JSON.stringify(temp));
  }

  return (
    <div>
      {showSeasonModal ? (
        <ShowSeasonEpisodeModal
          isAdded={isAdded}
          showId={showId}
          episodeCount={episodeCount}
          setEpisodeCount={setEpisodeCount}
          showSeasonModal={showSeasonModal}
          setShowSeasonModal={setShowSeasonModal}
          data={data}></ShowSeasonEpisodeModal>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <IonCheckbox
            disabled={!isAdded}
            className="season-check"
            checked={completed}
            onIonChange={handleSeasonWatched}
          />
          <div
            className="season-container"
            style={{ width: '90%' }}
            onClick={() => {
              setShowSeasonModal(true);
            }}>
            <span className="season-title">Season {data.season_number} </span>{' '}
            <ProgressBar done={(episodeCount / data.episode_count) * 100} />
            <span>
              {episodeCount}/{data.episode_count}
            </span>{' '}
            <svg
              className="chev-right"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"> </polyline>{' '}
            </svg>{' '}
          </div>
        </div>
      )}{' '}
    </div>
  );
};

export default ShowSeasonPanel;

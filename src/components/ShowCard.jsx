import React, { useState } from 'react';
import ShowModal from './ShowModal.jsx';
import './css/ShowCard.css';

const ShowCard = ({ data }) => {
  const [showModal, setShowModal] = useState(false);

  const imgUrl = 'https://image.tmdb.org/t/p/w500';

  return (
    <div>
      {/* modal to see more details */}{' '}
      {showModal ? (
        <ShowModal
          present={showModal}
          showModal={showModal}
          setShowModal={setShowModal}
          data={data}
        />
      ) : (
        <div> </div>
      )}{' '}
      {data.poster_path ? (
        <div className="displayCard">
          <img
            style={{
              width: '30vw',
            }}
            onClick={() => setShowModal(true)}
            className="image"
            alt="show poster"
            src={`${imgUrl}${data.poster_path}`}
          />{' '}
        </div>
      ) : null}{' '}
    </div>
  );
};

export default ShowCard;

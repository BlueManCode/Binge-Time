import React from 'react';
import {} from '@ionic/react';
import './css/ProgressBar.css';

const ProgressBar = ({ done }) => {
  return (
    <div className="progress-bar-container">
      <div
        className="progress-bar"
        style={{
          width: `${done}%`,
          animationName: 'progress-bar',
        }}>
        {' '}
      </div>{' '}
    </div>
  );
};

export default ProgressBar;

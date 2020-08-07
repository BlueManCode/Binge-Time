import React from 'react';
import { IonContent, IonPage, IonInfiniteScroll } from '@ionic/react';
import './Tab1.css';

import ShowCardTracker from '../components/ShowCardTracker';

const Tab1 = () => {
  let temp = [];
  temp = JSON.parse(localStorage.getItem('master'));

  return (
    <IonPage>
      <IonContent className="body">
        <IonInfiniteScroll style={{ color: 'white' }} className="big-box">
          <div
            style={{
              marginLeft: '4vw',
              fontWeight: 'bold',
              fontSize: '8vw',
              marginTop: '7vw',
              marginBottom: '4vw',
            }}>
            Binge Time
          </div>
          <div>
            {temp.length === 0 ? (
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  height: '100vmin',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                No Show in queue
              </div>
            ) : (
              <div>
                {temp
                  .filter((item) => item.completed === false)
                  .map((item, key) => (
                    <ShowCardTracker
                      key={key}
                      showData={item}
                      addedShows={temp}
                    />
                  ))}
              </div>
            )}
          </div>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;

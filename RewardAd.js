import React, {useEffect, useState} from 'react';
import {Button} from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
} from '@react-native-firebase/admob';

const adUnitId = __DEV__
  ? TestIds.REWARDED
  : 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy';

const rewarded = RewardedAd.createForAdRequest(adUnitId, {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
});

function RewardAd() {
  const [loaded, setLoaded] = useState(false);
  const [reload, setReload] = useState(true);

  useEffect(() => {
    const eventListener = rewarded.onAdEvent((type, error, reward) => {
      //   console.log(type, RewardedAdEventType.LOADED);
      if (type === RewardedAdEventType.LOADED) {
        setLoaded(true);
      }
      if (type === RewardedAdEventType.EARNED_REWARD) {
        console.log('User earned reward of ', reward);
        setReload(prev => !prev);
        // rewarded.load();
      }
      if (type === 'closed') {
        setTimeout(() => {
          rewarded.load();
        }, 2000);
      }
    });
    // console.log('Again mount');
    // Start loading the rewarded ad straight away
    rewarded.load();
    // console.log('Again mount1');

    // Unsubscribe from events on unmount
    return () => {
      eventListener();
      setLoaded(false);
      //   console.log('Clearing');
    };
  }, [reload]);

  // No advert ready to show yet
  //   if (!loaded) {
  //     return null;
  //   }

  return (
    <Button
      disabled={!loaded}
      title="Show Rewarded Ad"
      onPress={() => {
        rewarded.show();
      }}
    />
  );
}

export default RewardAd;

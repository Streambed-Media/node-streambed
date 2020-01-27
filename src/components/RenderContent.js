import React, { useState, useEffect } from 'react';
import RenderSingleVidAnalytics from './TopSection/OriginalsSection/RenderSingleVidAnalytics';
import '../styles/AnalyticsandContent/renderContent.css';
import Filters from './TopSection/FilterComponents/Filters';
import ButterflyScore from './TopSection/ButterflyScore/ButterflyScore';
import TopInfluencers from './BottomSection/TopInfluencers';
import Derivative from './BottomSection/Derivative';
import { web } from '../../oauthTwo.keys.json';
import CarouselComp from './TopSection/Carousel/CarouselComp';
import runTheContent from '../helpers/GetToken';

/****************************************Renders All content on page through multiple props*/
/** On mount, this will run rt which gets new accesstoken from the provided refresh in the DB **/
const RenderContent = (props) => {
  const [videoData, setVideoData] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [selectedVideoTitle, setSelectedVideoTitle] = useState(null);

  useEffect(() => {
    const localVidData = JSON.parse(sessionStorage.getItem('VideoData'));
    if (localVidData) {
      console.log('Line 25 RnderContent Hitt dis');
      setVideoData(localVidData);
      return;
    }
    runTheContent((accessToken) => {
      fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&forMine=true&maxResults=50&type=video&key={${web.apiKey}}`,
        {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: 'Bearer ' + accessToken
          }
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setVideoData(data.items);
          sessionStorage.setItem('VideoData', JSON.stringify(data.items));
        });
    });

    //Runs the get request function to grab token from headers and calls your current funciton as a callback
  }, []);

  /******************************************************************************************************
  On click function to pull video id from video 
   This is used in CarouselComp, it updates state here which is also passed to RenderSingleAnalytics
  *****************************************************************************************************/
  const getSingleVideoId = (index) => {
    setSelectedVideoId(videoData[index].id.videoId);
    setSelectedVideoTitle(videoData[index].snippet.title);
  };

  /**************************************************************************************************************/
  //Currently loops through videos and displays thumbnail and produces link to the video on youtube
  //Also passing down selectedVideoId to RenderSingleAnalytics
  /**************************************************************************************************************/

  return (
    <div className='renderContent-wrapper'>
      <ButterflyScore />
      <CarouselComp getSingleVideoId={getSingleVideoId} videoData={videoData} />
      <Filters />
      <RenderSingleVidAnalytics
        selectedVideoId={selectedVideoId}
        videoData={videoData}
        selectedVideoTitle={selectedVideoTitle}
      />
      <div className='der--influ-container'>
        <Derivative videoData={videoData} />
        <TopInfluencers videoData={videoData} />
      </div>
    </div>
  );
};

export default RenderContent;

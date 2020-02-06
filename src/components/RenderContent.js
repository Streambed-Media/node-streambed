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
      setVideoData(localVidData);
      return;
    }
    getVideoList();

    //Runs the get request function to grab token from headers and calls your current funciton as a callback
  }, []);

  /***********Function to fetch Video List */
  const getVideoList = () => {
    runTheContent((accessToken) => {
      fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&mine=true&maxResults=50&type=video&key=${
          web.apiKey
        }&_=${Math.random()}`,
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
          const info = data.items[0].contentDetails.relatedPlaylists.uploads;
          fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${info}&key=${web.apiKey}`,
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
    });
  };
  /***********Function to fetch Video List */

  /******************************************************************************************************
  On click function to pull video id from video 
   This is used in CarouselComp, it updates state here which is also passed to RenderSingleAnalytics
  *****************************************************************************************************/
  const getSingleVideoId = (index) => {
    setSelectedVideoId(videoData[index].snippet.resourceId.videoId);
    setSelectedVideoTitle(videoData[index].snippet.title);
  };

  /**************************************************************************************************************/
  //Currently loops through videos and displays thumbnail and produces link to the video on youtube
  //Also passing down selectedVideoId to RenderSingleAnalytics
  /**************************************************************************************************************/

  return (
    <div className='renderContent-wrapper'>
      <ButterflyScore />
      <CarouselComp
        getSingleVideoId={getSingleVideoId}
        videoData={videoData}
        getVideoList={getVideoList}
      />
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

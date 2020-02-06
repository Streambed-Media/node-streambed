import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ReactJson from 'react-json-view';
import oipPic from '../../../../public/images/oippic.png';
import { API_OIP_URL, LIVENET_URL } from '../../../../config.json';

//This is required by carousel npm package, set items to show on certain screen sizes
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 5 // When you click arrow, it will scroll as many as this is set too
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1
  }
};

const CarouselComp = (props) => {
  /***State */
  const [pubData, setPubData] = useState('');

  const MySwal = withReactContent(Swal);
  /*****Funtion for getting publishID from db, then fetch record and saves to session and state */
  //* Only returns records if the include tmpl_834772F4 */
  useEffect(() => {
    const pD = JSON.parse(sessionStorage.getItem('pubJSON'));
    if (pD) {
      setPubData(pD);
      return;
    }
    fetch('/users/pub')
      .then((response) => response.json())
      .then((data) => {
        const { pub } = data;
        fetch(
          `${API_OIP_URL}/oip/o5/record/search?q=meta.signed_by:${pub}+AND+_exists_:record.details.tmpl_834772F4`
        )
          .then((response) => response.json())
          .then((data) => {
            let templateData = data.results.map((c) => {
              if (c.record.details.tmpl_834772F4) {
                return c;
              }
            });
            setPubData(templateData);
            sessionStorage.setItem('pubJSON', JSON.stringify(templateData));
          });
      });
  }, []);
  /***Function on click of OIP button to show modal with JSON record data */
  const getJSONRecord = (ytId) => {
    let videoRec = pubData.filter((c) => {
      if (c.record.details.tmpl_834772F4.youTubeId === ytId) {
        return c;
      }
    });
    let floTran = `${LIVENET_URL}/tx/${videoRec[0].meta.txid}`;
    MySwal.mixin({
      html: (
        <div>
          <h2 style={{ textAlign: 'center' }}>
            <a href={floTran} target='_blank' rel='noopener noreferrer'>
              <i className='fas fa-link'></i>
              Flo Blockchain Explorer Link
            </a>
          </h2>
          <ReactJson
            displayDataTypes={false}
            indentWidth={1}
            enableClipboard={false}
            src={videoRec}
          />
        </div>
      )
    }).fire();
  };

  /********This will refresh the videos, used for getting new video in list after upload */
  const refreshVideoList = () => {
    sessionStorage.clear();
    setPubData('Loading');
    //Fetch videos
    props.getVideoList();

    //Fetch OIP record
    fetch('/users/pub')
      .then((response) => response.json())
      .then((data) => {
        const { pub } = data;
        fetch(
          `${API_OIP_URL}/oip/o5/record/search?q=meta.signed_by:${pub}+AND+_exists_:record.details.tmpl_834772F4`
        )
          .then((response) => response.json())
          .then((data) => {
            let templateData = data.results.map((c) => {
              if (c.record.details.tmpl_834772F4) {
                return c;
              }
            });
            setPubData(templateData);
            sessionStorage.setItem('pubJSON', JSON.stringify(templateData));
          });
      });
  };

  //***********************************************Maps through videos, prints them to carousel */
  //*********************************Also attaches singleVidAnalytics function to each video */
  const carousel = () => {
    return (
      <div style={{ width: '100%', maxWidth: '46vw' }}>
        <Carousel
          arrows
          className='carousel-component'
          focusOnSelect={false}
          infinite={false}
          showDots={false}
          sliderClass=''
          swipeable
          responsive={responsive}
        >
          {props.videoData.map((content, i) => {
            return (
              <div key={content.id}>
                <img
                  className='ui middle aligned image thumbnail'
                  src={content.snippet.thumbnails.default.url}
                  alt={content.id}
                  key={content.snippet.resourceId.videoId}
                  onClick={() => props.getSingleVideoId(i)}
                  style={{ cursor: 'pointer' }}
                ></img>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <a
                    href={`https://www.youtube.com/watch?v=${content.snippet.resourceId.videoId}`}
                    rel='noopener noreferrer'
                    target='_blank'
                    key={`https://www.youtube.com/watch?v=${content.snippet.resourceId.videoId}`}
                  >
                    <i className='youtube icon y--color' />
                  </a>
                  <i
                    className='far fa-chart-bar chart--color'
                    onClick={() => props.getSingleVideoId(i)}
                  ></i>
                  {/**This will only show OIP button if the videoId is in the returned array mapped from pubData **/}
                  {/**It gets all videoIds in the record and compares to decide if button should display **/}
                  {/**
                   * //! Code is very specific to template record format and ids, if template is different it will probably not work
                   */}
                  {pubData &&
                    pubData
                      .map((c) => {
                        return c.record.details.tmpl_834772F4.youTubeId;
                      })
                      .includes(content.snippet.resourceId.videoId) && (
                      <img
                        src={oipPic}
                        onClick={() =>
                          getJSONRecord(content.snippet.resourceId.videoId)
                        }
                        style={{ width: '33px' }}
                        className='chart--color' //This is just to add hover effect
                      />
                    )}
                </div>
              </div>
            );
          })}
        </Carousel>
      </div>
    );
  };

  /**************************************If videos arent loaded it will show loader from Semantic UI */
  return (
    <div className='carousel-box'>
      <div className='ref--box'>
        <h2>Content</h2>
        <i
          className='fas fa-sync-alt fa-lg'
          onClick={() => {
            refreshVideoList();
          }}
        ></i>
      </div>
      <div className='video-carousel'>
        {pubData === 'Loading' ? (
          <div>
            <img
              style={{ width: '150px' }}
              src='https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif'
            ></img>
          </div>
        ) : props.videoData ? (
          carousel()
        ) : (
          <div>Sign into Youtube to see videos</div>
        )}
      </div>
    </div>
  );
};

export default CarouselComp;

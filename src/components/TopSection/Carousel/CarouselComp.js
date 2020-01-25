import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ReactJson from 'react-json-view';
import oipPic from '../../../../public/images/oippic.png';

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
        console.log(pub);
        fetch(
          `https://api.oip.io/oip/o5/record/search?q=meta.signed_by:${pub}+AND+_exists_:record.details.tmpl_834772F4`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            setPubData(data);
            sessionStorage.setItem('pubJSON', JSON.stringify(data));
          });
      });
  }, []);
  /***Function on click of OIP button to show modal with JSON record data */
  const getJSONRecord = () => {
    MySwal.mixin({
      html: (
        <ReactJson
          displayDataTypes={false}
          indentWidth={1}
          enableClipboard={false}
          src={pubData}
        />
      )
    }).fire();
  };
  //***********************************************Maps through videos, prints them to carousel */
  //*********************************Also attaches singleVidAnalytics function to each video */
  const carousel = () => {
    return (
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
                key={content.id.videoId}
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
                  href={`https://www.youtube.com/watch?v=${content.id.videoId}`}
                  rel='noopener noreferrer'
                  target='_blank'
                  key={`https://www.youtube.com/watch?v=${content.id.videoId}`}
                >
                  <i className='youtube icon y--color' />
                </a>
                <i
                  className='far fa-chart-bar chart--color'
                  onClick={() => props.getSingleVideoId(i)}
                ></i>
                <img
                  src={oipPic}
                  onClick={() => getJSONRecord()}
                  style={{ width: '30px' }}
                  className='chart--color'
                />
              </div>
            </div>
          );
        })}
      </Carousel>
    );
  };

  /**************************************If videos arent loaded it will show loader from Semantic UI */
  return (
    <div className='carousel-box'>
      <h2>Content</h2>

      <div className='video-carousel'>
        {props.videoData ? (
          carousel()
        ) : (
          <div>Sign into Youtube to see videos</div>
        )}
      </div>
    </div>
  );
};

export default CarouselComp;

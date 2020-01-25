import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import ReactJson from 'react-json-view';

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
  const MySwal = withReactContent(Swal);
  /*****Funtion for getting publishID from db, then showing record in JSON viewer */
  const getJSONRecord = () => {
    fetch('/users/pub')
      .then((response) => response.json())
      .then((data) => {
        const { pub } = data;
        console.log(pub);
        fetch(`https://api.oip.io/oip/o5/record/search?q=meta.signed_by:${pub}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            MySwal.mixin({
              width: 1000,
              html: (
                <ReactJson
                  displayDataTypes={false}
                  indentWidth={1}
                  src={data.results[0]}
                />
              )
            }).fire();
          });
      });
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
              <br />
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
              <i
                className='fab fa-bitcoin chart--color'
                onClick={() => getJSONRecord()}
              ></i>
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

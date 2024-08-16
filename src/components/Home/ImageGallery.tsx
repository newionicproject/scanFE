/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import './ImageGallary.scss'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { images } from '../../Appconstant';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const ImageGallery: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleClickImage = (index: number) => {
    setCurrentIndex(index);
  };

  const handleClickArrow = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };
  // const visibleThumbnails = images.slice(currentIndex, currentIndex + 4);

  const visibleThumbnails = images.slice(
    currentIndex,
    currentIndex + 4 < images.length ? currentIndex + 4 : images.length
  );

  return (
    <div className='ImageGallary'>
      <div id='banner'>
      {images[currentIndex].type === 'img' ? (
          <img src={images[currentIndex].url} alt={`images-${currentIndex}`} />
        ) : (
          <video autoPlay muted>
          <source src="./assets/video/media.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        )}
      </div>
      <div  id='preview'>
        <button onClick={() => handleClickArrow('left') } disabled={currentIndex === 0}><KeyboardArrowLeftIcon/></button>
           {visibleThumbnails.map((item, index) => (
          <div
            key={index}
            className={`thumbnail-item ${index === 0 ? 'highlighted' : ''}`}
          >
            {item.type === 'img' ? (
              <div className='gallaryWrapper'>
              <img
                src={item.url}
                alt={`thumbnail-${index}`}
                onClick={() => handleClickImage(index+currentIndex)}
              />
              </div>
            ) : (
              <div className='gallaryWrapper' onClick={() => handleClickImage(index+currentIndex)}><PlayCircleIcon style={{width:"100%", height:"100%"}}/></div>
            )}
          </div>
        ))}
        <button onClick={() => handleClickArrow('right')}  disabled={currentIndex === images.length - 4}><KeyboardArrowRightIcon/></button>
      </div>
    </div>
  );
};

export default ImageGallery;

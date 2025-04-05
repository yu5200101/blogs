import React from 'react';
import exampleImage from '../images/example.png';
console.log('Image Object:', exampleImage); // 查看输出内容

const ResponsiveImage = () => {
  return (
    <div className="image-container">
      <img
        src={exampleImage.src}
        srcSet={exampleImage.srcSet}
        sizes="(max-width: 600px) 100vw, 80vw"
        alt="Responsive Example"
        style={{
          backgroundImage: `url(${exampleImage.placeholder})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
    </div>
  );
};

export default ResponsiveImage;
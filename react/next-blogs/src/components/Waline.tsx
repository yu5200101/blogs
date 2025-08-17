'use client'

import React, { useEffect, useRef } from 'react';
import { init, WalineInitOptions, WalineInstance } from '@waline/client';
import './Waline.css'
import '@waline/client/style';

interface WalineProps extends WalineInitOptions {
  // You can add any additional custom props here if needed
}

const Waline: React.FC<WalineProps> = (props) => {
  const walineInstanceRef = useRef<WalineInstance | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      walineInstanceRef.current = init({
        ...props,
        el: containerRef.current,
      });
    }

    return () => {
      walineInstanceRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    walineInstanceRef.current?.update(props);
  }, [props]);

  return <div ref={containerRef} />;
};

export default Waline;

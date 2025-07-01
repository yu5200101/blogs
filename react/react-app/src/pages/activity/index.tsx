import React, { useState, useRef } from 'react';
import styles from './index.module.scss';
import Fireworks from './components/Fireworks';

// 定义奖品类型
interface Prize {
  id: number;
  name: string;
  color: string;
}

const WheelOfFortune: React.FC = () => {
  // 奖品配置
  const prizes: Prize[] = [
    // 20
    { id: 1, name: 'iPhone 15', color: '#FF6384' },
    // 20 + 7*360/8
    { id: 2, name: 'AirPods Pro', color: '#36A2EB' },
    // 20 + 6*360/8
    { id: 3, name: 'Amazon礼券', color: '#FFCE56' },
    // 20 + 5*360/8
    { id: 4, name: 'PS5', color: '#4BC0C0' },
    // 20 + 4*360/8
    { id: 5, name: '任天堂Switch', color: '#9966FF' },
    // 20 + 3*360/8
    { id: 6, name: '谢谢参与', color: '#FF9F40' },
    // 20 + 2*360/8
    { id: 7, name: 'iPad Pro', color: '#C9CBCF' },
    // 20 + 1*360/8
    { id: 8, name: 'MacBook Pro', color: '#FF7F50' }
  ];

  const [spinning, setSpinning] = useState<boolean>(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [rotation, setRotation] = useState<number>(20);
  const wheelRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // 开始抽奖
  const startSpin = () => {
    if (spinning) return
    setSpinning(true)
    // 随机选择奖品
    const winningIndex = Math.floor(Math.random() * prizes.length);
    const winningPrize = prizes[winningIndex];
    // 计算旋转角度（加上多圈旋转效果）
    const extraRotation = 360 * 5; // 额外旋转5圈
    const prizeAngle = 360 / prizes.length;
    // 先转到index=0
    const lastIndex = result ? result.id - 1 : 0
    const targetRotation = extraRotation + ((lastIndex + prizes.length - winningIndex) * prizeAngle);
    // 设置旋转动画
    setRotation(prev => prev + targetRotation);
    // 显示结果
    setTimeout(() => {
      setResult(winningPrize);
      setSpinning(false);
      // 结果动画
      if (resultRef.current) {
        resultRef.current.classList.add(styles.show);
      }
    }, 5000); // 5秒后显示结果
  };

  // 关闭结果弹窗
  const closeResult = () => {
    if (resultRef.current) {
      resultRef.current.classList.remove(styles.show);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>幸运大转盘</h1>
      <p className={styles.subtitle}>试试你的手气，赢取超值大奖！</p>
      <div className={styles.wheelWrapper}>
        <div
          ref={wheelRef}
          className={styles.wheel}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.13, 0.99)' : 'none'
          }}
        >
          {prizes.map((prize, index) => {
            const sliceAngle = 360 / prizes.length;
            const rotate = sliceAngle * index;
            const skew = 90 - sliceAngle;
            return (
              <div
                key={prize.id}
                className={styles.slice}
                style={{
                  transform: `rotate(${rotate}deg) skewY(${skew}deg)`,
                  backgroundColor: prize.color
                }}
              >
                <div
                  className={styles.sliceContent}
                  style={{ transform: `skewY(-${skew}deg)` }}
                >
                  <span>{prize.name}</span>
                </div>
              </div>
            );
          })}
          <div className={styles.wheelCenter}></div>
        </div>
        <div className={styles.pointer}></div>
        <div className={styles.pointerBase}></div>
      </div>
      <button
        className={`${styles.spinButton} ${spinning ? styles.spinning : ''}`}
        onClick={startSpin}
        disabled={spinning}
      >
        {spinning ? '抽奖中...' : '开始抽奖'}
      </button>
      <div ref={resultRef} className={styles.resultPopup}>
        <div className={styles.resultContent}>
          <h2>恭喜您！</h2>
          <p>获得了 <span className={styles.prizeName}>{result?.name}</span></p>
          <button className={styles.closeButton} onClick={closeResult}>确定</button>
          <Fireworks />
        </div>
      </div>
      <div className={styles.instructions}>
        <p>🎁 每次抽奖必中实物奖品（"谢谢参与"除外）</p>
        <p>✨ 每人每天可参与3次抽奖</p>
      </div>
    </div>
  );
};

export default WheelOfFortune;
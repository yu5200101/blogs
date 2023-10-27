'use client';

import Profile from './components/Profile'
import { useState } from 'react'
import { useImmer } from 'use-immer'

function Item({
  name,
  isPacked
}: {
  name: string,
  isPacked: boolean
}) {
  return (<div className="item">{isPacked ? (
    <del>{name}＋</del>
  ) : (name) }</div>)
}

function AlertButton({
  message,
  children
}: {
  message: string,
  children: string
}) {
  return (
    <button onClick={() => alert(message)}>
      {children}
    </button>
  );
}

function About() {
  const people = [
    '凯瑟琳·约翰逊: 数学家',
    '马里奥·莫利纳: 化学家',
    '穆罕默德·阿卜杜勒·萨拉姆: 物理学家',
    '珀西·莱温·朱利亚: 化学家',
    '苏布拉马尼扬·钱德拉塞卡: 天体物理学家',
  ];
  const listItems = people.map((
    person: string,
    index: number) => <li key={index}>{person}</li>);


  const [index, setIndex] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleClick = () => {
    setIndex(index + 1)
  }

  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://i.imgur.com/Sd1AgUOm.jpg',
    }
  })

  function handleTitleChange(e: any) {
    updatePerson((draft: any) => {
      draft.artwork.title = e.target.value;
    });
  }


  return <div>
    <div>
      name:{person.name}
    </div>
    <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
    <div>
      artwork.city:{person.artwork.city}
    </div>
    <div>
      artwork.image:{person.artwork.image}
    </div>
    <p>
      <i>{person.artwork.title}</i>
      {' by '}
      {person.name}
      <br />
      (located in {person.artwork.city})
    </p>
    <ul>{listItems}</ul>
    <Profile />
    <Item name="测试name" isPacked={true} />
    <Item name="测试name2" isPacked={false} />
    <button onClick={handleClick}>按钮</button>
    <h3>
      index:
      {index + 1}
    </h3>
    <AlertButton message="正在播放！">
      播放电影
    </AlertButton>
    <AlertButton message="正在上传！">
      上传图片
    </AlertButton>
    <div
      onClick={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        })
      }}>
      <div style={{
        backgroundColor: 'red',
      }}>
        x::{position.x}
        y::{position.y}
      </div>
    </div>
  </div>
}

export default About
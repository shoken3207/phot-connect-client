import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const test = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const element = useRef(null);
  const array = [
    { title: 'aaaaaaaaaaaaaaa', desc: 'dddddddddddddddddddddd' },
    { title: 'aaaaaaaaaaaaaaa', desc: 'dddddddddddddddddddddd' },
    { title: 'aaaaaaaaaaaaaaa', desc: 'dddddddddddddddddddddd' },
    { title: 'aaaaaaaaaaaaaaa', desc: 'dddddddddddddddddddddd' },
    { title: 'aaaaaaaaaaaaaaa', desc: 'dddddddddddddddddddddd' },
    { title: 'aaaaaaaaaaaaaaa', desc: 'dddddddddddddddddddddd' },
    { title: 'aaaaaaaaaaaaaaa', desc: 'dddddddddddddddddddddd' },
    { title: 'aaaaaaaaaaaaaaa', desc: 'dddddddddddddddddddddd' },
    { title: 'aaaaaaaaaaaaaaa', desc: 'dddddddddddddddddddddd' },
    { title: 'aaaaaaaaaaaaaaa', desc: 'dddddddddddddddddddddd' },
    { title: 'aaaaaaaaaaaaaaa', desc: 'dddddddddddddddddddddd' },
    { title: 'aaaaaaaaaaaaaaa', desc: 'dddddddddddddddddddddd' },
    { title: 'aaaaaaaaaaaaaaa', desc: 'dddddddddddddddddddddd' },
    { title: 'aaaaaaaaaaaaaaa', desc: 'dddddddddddddddddddddd' },
    { title: 'aaaaaaaaaaaaaaa', desc: 'dddddddddddddddddddddd' },
    { title: 'aaaaaaaaaaaaaaa', desc: 'dddddddddddddddddddddd' },
  ];

  const menuData = [
    {
      title: 'Anker',
      content:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi optio sit, unde praesentium dolorem consectetur.',
    },
    {
      title: 'Apple',
      content:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi optio sit, unde praesentium dolorem consectetur.',
    },
    {
      title: 'Car',
      content: [
        { title: 'toyota', content: '愛知県' },
        { title: 'matsuda', content: 'よくわからん' },
        { title: 'nissan', content: 'カルロスゴーン' },
      ],
    },
    {
      title: 'イヤホン',
      content:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Animi optio sit, unde praesentium dolorem consectetur.',
    },
    {
      title: 'smartPhone',
      content: [
        { title: 'sony', content: 'カメラがいい' },
        { title: 'google', content: 'デザインが良くない' },
        { title: 'apple', content: 'タピオカメラ' },
      ],
    },
  ];

  useEffect(() => {
    setHeight(element.current.scrollHeight);
    console.log('useEffect: ', element.current.scrollHeight);
  }, []);
  const handleChange = (e, setFunc, value) => {
    e.preventDefault();
    if (value) {
      setFunc(value);
    } else {
      setFunc(e.target.value);
    }
  };

  const handleOpen = (e) => {
    e.preventDefault();
    console.log('onCLick');
    console.log('isOpen: ', isOpen);
    console.log('el', element.current.scrollHeight);

    setIsOpen(!isOpen);
  };
  return (
    <div>
      <input
        type='text'
        onChange={(e) => handleChange(e, setName)}
        placeholder='名前を入力'
      />
      <input
        type='text'
        onChange={(e) => handleChange(e, setAddress)}
        placeholder='住所を入力'
      />
      <input
        type='text'
        onChange={(e) => handleChange(e, setPhoneNumber)}
        placeholder='電話番号を入力'
      />
      <select
        name='gender'
        id=''
        onChange={(e, value) => handleChange(e, setGender, value)}
      >
        <option value=''>選択してください</option>
        <option value='男'>男</option>
        <option value='女'>女</option>
      </select>
      {/* {array.map((x, index) => (
        <>{index % 2 === 0 ? <h1>{x.title}</h1> : <p>{x.desc}</p>}</>
      ))} */}
      <SAccordion
        isOpen={isOpen}
        height={height}
        onClick={(e) => handleOpen(e)}
      >
        <h2>日本のアニメ</h2>
        <div ref={element}>ドラゴンボール、ワンピース、なると</div>
      </SAccordion>
    </div>
  );
};

export default test;

const SAccordion = styled.div`
  margin: 5rem;
  max-width: 300px;
  > h2 {
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: ${(props) => (props.isOpen ? 'greenyellow' : 'skyblue')};
    transition: all 0.2s;
    text-align: center;
    &:hover {
      background-color: greenyellow;
    }
  }

  > div {
    height: ${(props) => (props.isOpen ? props.height + 'px' : '0px')};
    overflow: hidden;
    transition: 0.3s ease height;
  }
`;

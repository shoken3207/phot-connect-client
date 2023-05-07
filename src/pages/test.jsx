import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { AVATAR_COLOR, REACTION_AVATAR_ICONS, prefectureArray } from '../const';
import PersonList from '../components/CommonList';
import CommonDialog from '../components/CommonDialog';
import { Button } from '@mui/material';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Pagination, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
const test = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const [onClickFunc, setOnClickFunc] = useState(null);
  const element = useRef(null);
  const options = ['Option 1', 'Option 2'];
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
  ];
  const sayHello = () => {
    console.log('hello');
  };
  useEffect(() => {
    setOnClickFunc(() => sayHello());
    console.log('call');
    console.log(onClickFunc);
    onClickFunc();
  }, []);
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

  const personList = [
    {
      id: '1',
      primaryText: 'tanaka',
      secondaryText: 'aaa',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '2',
      primaryText: 'satou',
      secondaryText: 'bbb',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
    {
      id: '3',
      primaryText: 'suzuki',
      secondaryText: 'ccc',
      iconImage: '/images/noAvatar.png',
    },
  ];
  const notifications = [
    {
      actor_id: '644e1fab9b84238befc5bd6c',
      actor_name: 'tanaka',
      actor_image:
        'https://firebasestorage.googleapis.com/v0/b/photo-connect-aae70.appspot.com/o/images%2Fuser%2F16833479656432021_0322_19525800.jpg?alt=media&token=2d29bbde-add5-4af5-bf15-4ec74e2ffbf8',
      content_id: '644e23501aef45c87f328da6',
      content_image:
        'https://firebasestorage.googleapis.com/v0/b/photo-connect-aae70.appspot.com/o/images%2Fplan%2F16828424467772021_0329_22385800.jpg?alt=media&token=78af19e9-7b30-4e22-abfd-d4b62dec669c',
      action_type: 1,
    },
    {
      actor_id: '644e1fab9b84238befc5bd6c',
      actor_name: 'tanaka',
      actor_image:
        'https://firebasestorage.googleapis.com/v0/b/photo-connect-aae70.appspot.com/o/images%2Fuser%2F16833479656432021_0322_19525800.jpg?alt=media&token=2d29bbde-add5-4af5-bf15-4ec74e2ffbf8',
      content_id: '644e23501aef45c87f328da6',
      content_image:
        'https://firebasestorage.googleapis.com/v0/b/photo-connect-aae70.appspot.com/o/images%2Fplan%2F16828424467772021_0329_22385800.jpg?alt=media&token=78af19e9-7b30-4e22-abfd-d4b62dec669c',
      action_type: 3,
    },
    {
      actor_id: '644e1fab9b84238befc5bd6c',
      actor_name: 'tanaka',
      actor_image:
        'https://firebasestorage.googleapis.com/v0/b/photo-connect-aae70.appspot.com/o/images%2Fuser%2F16833479656432021_0322_19525800.jpg?alt=media&token=2d29bbde-add5-4af5-bf15-4ec74e2ffbf8',
      content_id: '644e23501aef45c87f328da6',
      content_image:
        'https://firebasestorage.googleapis.com/v0/b/photo-connect-aae70.appspot.com/o/images%2Fplan%2F16828424467772021_0329_22385800.jpg?alt=media&token=78af19e9-7b30-4e22-abfd-d4b62dec669c',
      action_type: 4,
    },
    {
      actor_id: '644e1fab9b84238befc5bd6c',
      actor_name: 'tanaka',
      actor_image:
        'https://firebasestorage.googleapis.com/v0/b/photo-connect-aae70.appspot.com/o/images%2Fuser%2F16833479656432021_0322_19525800.jpg?alt=media&token=2d29bbde-add5-4af5-bf15-4ec74e2ffbf8',
      content_id: '644e21e89b84238befc5be0d',
      content_image: '',
      action_type: 8,
    },
    {
      actor_id: '644e1fab9b84238befc5bd6c',
      actor_name: 'tanaka',
      actor_image:
        'https://firebasestorage.googleapis.com/v0/b/photo-connect-aae70.appspot.com/o/images%2Fuser%2F16833479656432021_0322_19525800.jpg?alt=media&token=2d29bbde-add5-4af5-bf15-4ec74e2ffbf8',
      content_id: '644e21e89b84238befc5be0d',
      content_image: '',
      action_type: 1,
    },
  ];
  const [value, setValue] = React.useState(prefectureArray[0]);
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

  const dateFunc = (e) => {
    e.preventDefault();
    const nowDate = new Date();
    console.log('nowDate: ', nowDate);
    console.log(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate());
    const deadLine = new Date(
      `${nowDate.getFullYear()}/${nowDate.getMonth() + 1}/${
        nowDate.getDate() - 1
      } 23:59:59`
    );
    console.log(deadLine);
  };

  const handleOpen = (e) => {
    e.preventDefault();
    console.log('onCLick');
    console.log('isOpen: ', isOpen);
    console.log('el', element.current.scrollHeight);

    setIsOpen(!isOpen);
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  const reactions = [
    'favorite',
    'good',
    'bad',
    'smile',
    'angry',
    'nature',
    'sick',
    'sick',
    'sick',
    'sick',
    'sick',
  ];

  //表示するデータ
  const [list, setList] = useState([]);

  //項目を読み込むときのコールバック
  const loadMore = (page) => {
    setList([...list, page]);
  };

  //各スクロール要素
  const items = (
    <ul>
      {list.map((value) => (
        <li>{value}</li>
      ))}
    </ul>
  );

  //全体のスタイル
  const root_style = {
    marginLeft: '50px',
    marginTop: '50px',
  };

  //ロード中に表示する項目
  const loader = (
    <div className='loader' key={0}>
      Loading ...
    </div>
  );
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
      <SwiperBox
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1}
        spaceBetween={0}
        navigation={true}
        pagination={{ clickable: true }}
        modules={[Navigation, Pagination]}
        className='mySwiper'
      >
        <SwiperItem>
          <img src='https://swiperjs.com/demos/images/nature-1.jpg' alt='' />
        </SwiperItem>
        <SwiperItem>
          <img src='https://swiperjs.com/demos/images/nature-2.jpg' alt='' />
        </SwiperItem>
        <SwiperItem>
          <img src='https://swiperjs.com/demos/images/nature-3.jpg' alt='' />
        </SwiperItem>
        <SwiperItem>
          <img src='https://swiperjs.com/demos/images/nature-4.jpg' alt='' />
        </SwiperItem>
        <SwiperItem>
          <img src='https://swiperjs.com/demos/images/nature-5.jpg' alt='' />
        </SwiperItem>
      </SwiperBox>
      <SAccordion
        isOpen={isOpen}
        height={height}
        onClick={(e) => handleOpen(e)}
      >
        <h2>日本のアニメ</h2>
        <div ref={element}>ドラゴンボール、ワンピース、なると</div>
      </SAccordion>
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        options={prefectureArray}
        renderInput={(params) => <TextField {...params} label='Controllable' />}
      />

      <img src='https://picsum.photos/350/250/?random' alt='' />
      <Button onClick={() => setMenuIsOpen(true)}>button</Button>
      <CommonDialog
        dialogTitle='リアクションユーザー'
        isOpen={menuIsOpen}
        setIsOpen={setMenuIsOpen}
      >
        <PersonList listData={personList} />
      </CommonDialog>
      <Button variant='outlined' onClick={(e) => dateFunc(e)}>
        date func
      </Button>
      <AvatarGroup max={4}>
        {reactions.map((reaction) => (
          <Avatar
            sx={{
              width: 38,
              height: 38,
              bgcolor: AVATAR_COLOR[reaction],
            }}
          >
            {REACTION_AVATAR_ICONS[reaction]}
          </Avatar>
        ))}
      </AvatarGroup>
      {/* <CommonFullScreenDialog>
        <NotificationList notifications={notifications} />
      </CommonFullScreenDialog> */}
    </div>
  );
};

export default test;

const SAvatarGroup = styled.div`
  display: flex;
  align-items: center;
  margin: 0 -10px;
`;

const SAvatar = styled.div`
  font-size: 1.2rem;
`;

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
const SwiperBox = styled(Swiper)`
  width: 400px;
  height: 270px;
`;

const SwiperItem = styled(SwiperSlide)`
  img {
    width: 100%;
    height: 100%;
  }
`;

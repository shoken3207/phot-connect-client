import FavoriteIcon from '@mui/icons-material/Favorite';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import MoodIcon from '@mui/icons-material/Mood';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import SickIcon from '@mui/icons-material/Sick';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import {
  green,
  pink,
  lightBlue,
  purple,
  amber,
  red,
} from '@mui/material/colors';

export const prefectureArray = [
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県',
  '静岡県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '大阪府',
  '兵庫県',
  '奈良県',
  '和歌山県',
  '鳥取県',
  '島根県',
  '岡山県',
  '広島県',
  '山口県',
  '徳島県',
  '香川県',
  '愛媛県',
  '高知県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県',
];

export const uploadLimitFileSize = 1024 * 1024 * 1.4;

export const definedLimit = 40;

export const REACTIONS = [
  { label: 'favorite', node: <FavoriteIcon fontSize='large' color='error' /> },
  { label: 'good', node: <ThumbUpIcon fontSize='large' color='primary' /> },
  { label: 'bad', node: <ThumbDownIcon fontSize='large' color='primary' /> },
  { label: 'smile', node: <MoodIcon fontSize='large' color='secondary' /> },
  { label: 'angry', node: <MoodBadIcon fontSize='large' color='secondary' /> },
  {
    label: 'nature',
    node: <SentimentNeutralIcon fontSize='large' color='secondary' />,
  },
  { label: 'sick', node: <SickIcon fontSize='large' color='secondary' /> },
];

export const REACTION_ICONS = {
  like: '👍',
  laugh: '😂',
  wow: '😮',
  sad: '😔',
  angry: '😠',
};

export const REACTION_AVATAR_ICONS = {
  favorite: <FavoriteIcon />,
  good: <ThumbUpIcon />,
  bad: <ThumbDownIcon />,
  smile: <MoodIcon />,
  angry: <MoodBadIcon />,
  nature: <SentimentNeutralIcon />,
  sick: <SickIcon />,
};
export const SMALL_REACTION_AVATAR_ICONS = {
  favorite: <FavoriteIcon fontSize='small' />,
  good: <ThumbUpIcon fontSize='small' />,
  bad: <ThumbDownIcon fontSize='small' />,
  smile: <MoodIcon fontSize='small' />,
  angry: <MoodBadIcon fontSize='small' />,
  nature: <SentimentNeutralIcon fontSize='small' />,
  sick: <SickIcon fontSize='small' />,
};
export const AVATAR_COLOR = {
  favorite: pink[500],
  good: lightBlue[500],
  bad: lightBlue[500],
  smile: amber[500],
  angry: red[500],
  nature: green[500],
  sick: purple[500],
};

export const NOTIFICATION_TYPE = {
  ADD_FRIEND: 1,
  LEAVE_FRIEND: 2,
  PARTICIPATION_PLAN: 3,
  LEAVE_PLAN: 4,
  EXCEPT_PLAN: 5,
  REMOVE_PLAN: 6,
  LIKE_PLAN: 7,
  RECEIVE_TALK: 8,
  REACTION_TALK: 9,
  ACCEPT_PLAN: 10,
  INVITATION_PLAN: 11,
};

export const NO_IMAGE_PATH = '/images/noImage.jpg';
export const CLOSED_PLAN_IMAGE_PATH = '/images/planClose.png';
export const NO_AVATAR_IMAGE_PATH = '/images/noAvatar.png';

export const MAX_LOAD_PLAN_COUNT = 8;
export const MAX_LOAD_TALK_COUNT = 15;
export const MAX_DISP_REACTION_AVATAR_COUNT = 3;
export const MAX_LOAD_NOTIFICATION_COUNT = 20;
export const LOADING_TIME = 100;

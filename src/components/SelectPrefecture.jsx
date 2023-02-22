import React from 'react';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';
import { prefectureArray } from '../const';
const SelectPrefecture = ({ prefecture, setPrefecture }) => {
  return (
    <Autocomplete
      id='prefectures'
      disablePortal
      options={prefectureArray}
      value={prefecture}
      onChange={(e, value) => setPrefecture(value)}
      fullWidth
      renderInput={(params) => <TextField {...params} label='都道府県を入力' />}
    />
  );
};

export default SelectPrefecture;

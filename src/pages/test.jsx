import React, { useState } from 'react';

const test = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');

  const handleChange = (e, setFunc, value) => {
    e.preventDefault();
    console.log('value: ', value);
    if (value) {
      setFunc(value);
    } else {
      setFunc(e.target.value);
    }
    console.log('name: ', name);
    console.log('address: ', address);
    console.log('phoneNumber: ', phoneNumber);
    console.log('gender: ', gender);
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
    </div>
  );
};

export default test;

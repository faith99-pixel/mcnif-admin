
import React, { useState } from 'react';

type Props = {
  selectedOption: string;
  onOptionChange: (value: string) => void;
};

const FoodRadioButton = ({ selectedOption, onOptionChange }: Props) => {
  const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    onOptionChange(e.target.value as string);
  };

  return (
    <div className='flex items-center justify-start mt-4'>
      <label className={`radio-label mr-4 flex items-center ${selectedOption === 'yes' ? 'active' : ''}`}>
        <input
          type='radio'
          name='choice'
          value='yes'
          checked={selectedOption === 'yes'}
          onChange={handleChange}
        />
        <span className='text-base text-mcNiff-gray-2'>Yes</span>
      </label>
      <label className='radio-label flex items-center'>
        <input
          type='radio'
          name='choice'
          value='no'
          checked={selectedOption === 'no'}
          onChange={handleChange}
        />
        <span className='text-base text-mcNiff-gray-2'>No</span>
      </label>
    </div>
  );
};

export default FoodRadioButton;

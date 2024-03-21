import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';

import { useStateContext } from '../context';
import { money } from '../assets';
import { CustomButton, FormField, Loader } from '../components';
import { checkIfImage } from '../utils';

const CreateBounty = () => {
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const { createBounty } = useStateContext();
  const [form, setform] = useState({
    name: '',
    title: '',
    description: '',
    target: '',
    deadline: '',
    image: ''
  });

  const handleFormFieldChange = (fieldName, e) => {
    setform({ ...form, [fieldName]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if(exists) {
        setisLoading(true);
        await createBounty({ ...form, target: ethers.utils.parseUnits(form.target, 18)})
        setisLoading(false);
        navigate('/');
      } else {
        alert('Provide valid image URL')
        setform({ ...form, image: ''})
      }
    })
  }

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && <Loader /> }
      <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Start a Bounty</h1>
      </div>

      <form onSubmit={handleSubmit} className="w-full mt-[40px] flex flex-col gap[30px]">
        <div className="flex flex-wrap gap-[20px]">
          <FormField
            labelName="Your Name *"
            placeholder="John Doe"
            inputType="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange('name', e)}
          />
           <FormField
            labelName="Bounty Title *"
            placeholder="Write a title"
            inputType="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange('title', e)}
          />
        </div>
        
        <div className="mt-[20px]">
          <FormField
            labelName="Description *"
            placeholder="Write a description of the bounty you want to be completed"
            isTextArea
            value={form.description}
            handleChange={(e) => handleFormFieldChange('description', e)}
          />
        </div>

        <div className="w-full flex justify-start items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px] mt-[20px]">
          <img src={money} alt="money" className="w-[40px] h-[40px] object-contain"/>
          <h4 className="font-epilogue font-bold text-[25px] text-white ml-[20px]">Bounty Creators get 5% of the raised amount</h4>
        </div>

        <div className="flex flex-wrap gap-[20px] mt-[20px]">
          <FormField
            labelName="Goal *"
            placeholder="ETH 0.50"
            inputType="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange('target', e)}
          />
           <FormField
            labelName="End Date *"
            placeholder="End Date"
            inputType="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange('deadline', e)}
          />
        </div>

        <div className="mt-[20px]">
          <FormField
              labelName="Bounty image *"
              placeholder="Place image URL of your bounty"
              inputType="url"
              value={form.image}
              handleChange={(e) => handleFormFieldChange('image', e)}
              />
        </div>

        <div className="flex justify-center items-center mt-[20px]">
          <CustomButton 
            btnType="submit"
            title="Submit new bounty"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  )
}

export default CreateBounty
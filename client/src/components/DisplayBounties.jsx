import React from 'react';
import { useNavigate } from 'react-router-dom';

import { FundCard } from './';
import { loader } from '../assets';

const DisplayBounties = ({ title, isLoading, bounties }) => {
  const navigate = useNavigate();

  const handleNavigate = (bounty) => {
    navigate(`/bounty-details/${bounty.title}`, { state: bounty });
  };

  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] text-white text-left">
        {title} ({bounties.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
        )}

        {!isLoading && bounties.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any bounties yet.
          </p>
        )}

        {!isLoading &&
          bounties.length > 0 &&
          bounties.map((bounty) => (
            <FundCard
              key={bounty.pId}
              {...bounty}
              handleClick={() => handleNavigate(bounty)}
            />
          ))}
      </div>
    </div>
  );
};

export default DisplayBounties;
import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useConnect, useContractWrite } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { data: contract } = useContract("{{0xb9cf5634b5215cCd83fc9F57b888052786B06017}}");
  const { mutateAsync: createBounty } = useContractWrite(contract, 'createBounty');

  const address = useAddress();
  const connect = useConnect();

  const publishBounty = async (form) => {
    try {
      const data = await createBounty({
				args: [
					address, // owner
					form.title, // title
					form.description, // description
					form.target,
					new Date(form.deadline).getTime(), // deadline,
					form.image,
				],
			});

      console.log("contract call success", data)
    } catch (error) {
      console.log("contract call failure", error)
    }
  }

  const getBounties = async () => {
    const bounties = await contract.call('getBounties');

    const parsedBounties = bounties.map((bounty, i) => ({
      owner: bounty.owner,
      title: bounty.title,
      description: bounty.description,
      target: ethers.utils.formatEther(bounty.target.toString()),
      deadline: bounty.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(bounty.amountCollected.toString()),
      image: bounty.image,
      pId: i
    }));

    return parsedBounties;
  }

  const getUserBounties = async () => {
    const allBounties = await getBounties();

    const filteredBounties = allBounties.filter((bounty) => bounty.owner === address);

    return filtereBounties;
  }

  const donate = async (pId, amount) => {
    const data = await contract.call('donateToBounty', [pId], { value: ethers.utils.parseEther(amount)});

    return data;
  }

  const getDonations = async (pId) => {
    const donations = await contract.call('getDonators', [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }


  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        createBounty: publishBounty,
        getBounties,
        getUserBounties,
        donate,
        getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);
import React, {useState, useEffect } from 'react'

import { DisplayBounties } from '../components'
import { useStateContext } from '../context'

const Profile = () => {
  const [isLoading, setisLoading] = useState(false);
  const [bounties, setBounties] = useState([]);

  const { address, contract, getUserBounties} = useStateContext();

  const fetchBounties = async () => {
    setisLoading(true);
    const data = await getUserBounties();
    setBounties(data);
    setisLoading(false);
  };
    

  useEffect(() => {
    if(contract) fetchBounties();
  }, [address, contract]);

  return (
    <DisplayBounties 
    title="All Bounties"
    isLoading={isLoading}
    bounties={bounties}
    />
  )
}

export default Profile
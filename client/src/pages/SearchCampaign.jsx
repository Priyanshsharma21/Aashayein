import React, { useState, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import { DisplayCampaigns } from '../components';
import { useStateContext } from '../context'


const SearchCampaign = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const {searchTerm} = useParams()
  const {address, contract, getCapmaigns } = useStateContext();
  const [filterData, setFilterData] = useState([])

  // we cant call async function in useEffect
  const fetchCampaigns = async()=>{
      setIsLoading(true)
      const data = await getCapmaigns()
      setCampaigns(data)
      setIsLoading(false)
  }

  useEffect(()=>{
    if(contract) fetchCampaigns()
  },[address, contract])


  
    const filteredData = campaigns.filter((item) => {
         return Object.values(item).join('').toLowerCase().includes(searchTerm.toLowerCase())
    })


  return (
    <DisplayCampaigns 
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={filteredData}
    />
  )
}

export default SearchCampaign

import React, { useContext, createContext, useState } from 'react';

import { useAddress, useContract, useMetamask, useContractWrite, useChainId } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { EditionMetadataWithOwnerOutputSchema } from '@thirdweb-dev/sdk';

const StateContext = createContext()


export const StateContextProvider = ({children})=>{
    const {contract} = useContract('')
    const {mutateAsync : createCampaign } = useContractWrite(contract, 'createCampaign')
    const [isDark, setIsDark] = useState(false)

    const address = useAddress()
    const connect = useMetamask()

    const publishCampaign = async(form)=>{
        try {
                const data = await createCampaign([
                address, // owner
                form.title, // title
                form.description, // description
                form.category, // category
                form.target,
                new Date(form.deadline).getTime(), // deadline,
                form.image
            ])

            console.log("contract Call Success", data)
        } catch (error) {
            console.log("contract Call Error",error)
        }
    }

    const getCapmaigns = async()=>{
        const campaigns = await contract.call('getCampaigns')

        const parsedCampaings = campaigns.map((campaign, i) => ({
            owner: campaign.owner,
            title: campaign.title,
            description: campaign.description,
            category: campaign.category,
            target: ethers.utils.formatEther(campaign.target.toString()),
            deadline: campaign.deadline.toNumber(),
            amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
            image: campaign.image,
            pId: i
          }));
      
          return parsedCampaings;
    }

    const getUserCampaigns = async()=>{
        const allCampaigns = await getCapmaigns();

        const filteredCampaigns = allCampaigns.filter((campaign)=>campaign.owner === address)

        return filteredCampaigns
    }

    const donate = async (pId, amount) => {
        const data = await contract.call('donateToCampaign', pId, { value: ethers.utils.parseEther(amount)});
    
        return data;
      }
    
      const getDonations = async (pId) => {
        const donations = await contract.call('getDonators', pId);
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
        createCampaign : publishCampaign,
        getCapmaigns,
        getUserCampaigns,
        donate,
        getDonations,
        setIsDark,
        isDark,
        }}
        >
            {children}
        </StateContext.Provider>
    )
}


export const useStateContext = ()=> useContext(StateContext);

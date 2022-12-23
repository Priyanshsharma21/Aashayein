import react from 'react'
import { Route, Routes } from 'react-router-dom'
import {CampaignDetails, CreateCampaign, Home, Profile,SearchCampaign} from './pages/index.js'
import { Navbar, Sidebar } from './components/index'
import { useStateContext } from './context/index.js';


const App = () => {

  const { isDark } = useStateContext();


  return (
    <>
      <div className={`relative sm:-8 p-4 ${isDark ? 'bg-[#efefef]' : 'bg-[#13131a]'} min-h-screen flex flex-row`}>
        <div className="sm:flex hidden mr-10 relative">
          <Sidebar />
        </div>

        <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
          <Navbar />

          <Routes>
            <Route path={'/'} element={<Home />}/>
            <Route path={'/profile'} element={<Profile />}/>
            <Route path={'/campaign-details/:id'} element={<CampaignDetails />}/>
            <Route path={'/create-campaign'} element={<CreateCampaign />}/>
            <Route path={'/search/:searchTerm'} element={<SearchCampaign />}/>
          </Routes>
          
        </div>
      </div>
    </>
  );
};

export default App;

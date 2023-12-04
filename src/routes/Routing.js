import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Private from "./Private";
import Public from "./Public";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicRoute from "../components/PublicRoute";
import Login from "../Pages/Login";
import Registration from "../Pages/Registration";
import Stacking from "../Pages/Stacking";
import { useState,useEffect } from "react";
// import { useLocation } from 'react-router-dom';

import Home from "../Pages/Home";
import Reward from "../Pages/Reward";
import Verification from "../Pages/Verification";
import History from "../Pages/History";
import Profile from "../Pages/Profile";
import Web3 from "web3";
import {useNetwork,  useSwitchNetwork } from 'wagmi'
import { useAccount, useDisconnect } from 'wagmi'
import { cont_address,token_Address,cont_abi,token_abi } from "../components/config";
import { useContractReads,useContractRead ,useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
const cont_Contract = {
  address: cont_address,
  abi: cont_abi,
}
const stakeTokem_Contract = {
  address: token_Address,
  abi: token_abi,
}
const Routing = ({shift_screen}) => {


  const APRList = [
    { value: "0", lbl: "200 Days" ,APR: "0.5%" },
    { value: "1", lbl: "400 Days"  ,APR: "0.6%" },




  ];


  // totalReward=totalReward Total_withdraw=Total_withdraw


  const [ selectedAPR,set_selectedAPR] = useState(APRList[0])

  const [open, setOpen] = useState(false);

  const [expend, setExpend] = useState(false);
  const [totalReward, set_totalReward] = useState(0);
  const [Total_withdraw, set_Total_withdraw] = useState(0);


  const [totalInvestment, set_totalInvestment] = useState(0);
  const [totalEarning, set_totalEarning] = useState(0);
  const [referralLevel_count, set_referralLevel_count] = useState([]);
  const [referralLevel_Earning, set_referralLevel_Earning] = useState([]);
  const [regAddress, set_regAddress] = useState("");
  const [DuBalance, set_DuBalance] = useState(0);

  const [stakeAmount, setStakedAmount] = useState(0);
  const [curr_time, set_currTime] = useState(0);
  const [selectedAmount_forReward, setSelectedAmount_forReward] = useState(null);

  const [All_investments_ForReward, set_All_investments_ForReward] = useState([]);
  const [choosed_Unstake_inv, set_choosed_Unstake_inv] = useState();
  const [allInvestments, set_investmentList] = useState([]);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [history, setHistory] = useState([]);
  const [directs, set_directs] = useState(0);
  const [team, set_team] = useState(0);
  const [email, set_email] = useState("");
  const [count, set_count] = useState(0);

  const { chain } = useNetwork()
  // const location = useLocation();
  // const params = new URLSearchParams(location.search);
  // const regAddres = params.get("address");

  const { address, isConnecting ,isDisconnected} = useAccount()



 
useEffect(()=>{
  if((count==0&& address!=undefined) || (count==0 && regAddress!=""))
  {
    set_count(1);

    console.log("hello sec box"+count);
      test()
  }

},address,regAddress)
  const { data, isError1, isLoading1 } = useContractReads({
    contracts: [
      {
        ...cont_Contract,
        functionName: 'Apy',
      },
      {
        ...cont_Contract,
        functionName: 'getTotalInvestment',

      },
      {
        ...cont_Contract,
        functionName: 'get_currTime',
        
      },

      {
        ...cont_Contract,
        functionName: 'owner',
        
      },
      {
        ...cont_Contract,
        functionName: 'totalusers',
        
      },
      {
        ...cont_Contract,
        functionName: 'totalbusiness',
        
      },
      {
        ...cont_Contract,
        functionName: 'user',
        args:[address]
        
      },
      {
        ...cont_Contract,
        functionName: 'get_withdrawnTime',
        args: [1]
        
      },





      {
        ...stakeTokem_Contract,
        functionName: 'balanceOf',
        args: [address]
        
      },
      
      
      

    ],
  })




  async function test(){
    const web3= new Web3(new Web3.providers.HttpProvider("https://endpoints.omniatech.io/v1/bsc/testnet/public	"));
  
              
   const balance =await  web3.eth.getBalance(regAddress)
    const contract=new web3.eth.Contract(cont_abi,cont_address);
    const contract1=new web3.eth.Contract(token_abi,token_Address);
    let DuBalance = await contract1.methods.balanceOf(regAddress).call();    
    set_DuBalance(DuBalance);
    
    let curr_time = await contract.methods.get_currTime().call();    
    set_currTime(curr_time);

    let totalReward = await contract.methods.get_TotalReward().call({ from: regAddress });       
    let TotalInvestment = await contract.methods.getTotalInvestment().call({ from: regAddress });       
    let totalEarning = await contract.methods.get_totalEarning().call({ from: regAddress });       
    let history = await contract.methods.get_history(regAddress).call({ from: regAddress });
    // console.log("helo "+history)
       
    let referralLevel_count = await contract.methods.referralLevel_count(regAddress).call();       
    let referralLevel_earning = await contract.methods.referralLevel_earning(regAddress).call();       

    let Total_withdraw = await contract.methods.total_withdraw_reaward().call({ from: regAddress });       
    let user = await contract.methods.user(regAddress).call();       

    let allInvestments = await contract.methods.getAll_investments().call({from: regAddress});
             console.log("bal "+allInvestments);
    let All_investments_ForReward = await contract.methods
    .getAll_investments_ForReward()
    .call({ from: regAddress });
    setHistory(history);
    set_totalInvestment(TotalInvestment)
    set_totalEarning(totalEarning)
    set_referralLevel_count(referralLevel_count)
    set_referralLevel_Earning(referralLevel_earning)

    set_directs(user[6])
    set_team(user[7])
    set_regAddress(regAddress)
    set_investmentList(allInvestments);
    setSelectedAmount(allInvestments[0]);
    set_All_investments_ForReward(All_investments_ForReward)
    setSelectedAmount_forReward(All_investments_ForReward[0])
    if(allInvestments[0])
    {
      set_choosed_Unstake_inv(allInvestments[0][3])

    }    
    set_totalReward(totalReward);
    set_Total_withdraw(Total_withdraw);


console.log("object done");
  }  

  // function shift_screen(_value)
  // {
  //   alert("hello screen ")
  //   set_email(_value)
    
  // }






  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Public>
              <Login shift_screen={shift_screen}/>
            </Public>
          }
        />
        <Route path="auth">
          <Route
            path="login"
            element={
              <Public>
                <Login shift_screen={shift_screen}/>
              </Public>
            }
          />
          <Route
            path="register"
            element={
              <Public>
                <Registration />
              </Public>
            }
          />
        </Route>
        <Route path="dashboard">
          <Route
          exact
            path="home"
            element={
              <ProtectedRoute>
                <Home      totalReward={totalReward} totalInvestment={totalInvestment} Total_withdraw={Total_withdraw} totalEarning={totalEarning} directs={directs} team={team}  regAddress={regAddress}     set_regAddress={set_regAddress}    />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <Public>
                <Profile email={email}/>
              </Public>
            }
          />
          <Route
            path="stacking"
            element={
              <Public>
                <Stacking allInvestments={allInvestments} regAddress={regAddress} DuBalance={DuBalance}/>
              </Public>
            }
          />

          <Route
            path="history"
            element={
              <Public>
                <History  history={history} />
              </Public>
            }
          />
          <Route
            path="reward"
            element={
              <Public>
                <Reward referralLevel_count={referralLevel_count} referralLevel_Earning={referralLevel_Earning}/>
              </Public>
            }
          />
          <Route
            path="verification"
            element={
              <Public>
                <Verification />
              </Public>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Routing;

import React, { useState,useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {PiCopySimpleFill} from 'react-icons/pi';
import { useLocation } from 'react-router-dom';

import Modal from "../../components/Modal";
import Wrapper from "../../routes/Wrapper";
import UserProfile from "../../components/userProfile";
import { CopyIcon } from "../../assets/Icons";
import WithdrawModal from "../../components/WithdrawModal";
import { cont_address,token_Address,cont_abi,token_abi } from "../../components/config";
import { ToastContainer, toast } from 'react-toastify';

import Web3 from "web3";
import {useNetwork,  useSwitchNetwork } from 'wagmi'

import { useAccount, useDisconnect } from 'wagmi'
import { useContractReads,useContractRead ,useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
const Main = ({totalReward,totalInvestment,Total_withdraw,totalEarning,directs,team,set_regAddress,regAddress }) => {
  const [open, setOpen] = useState(false);
  const [regAddress1, set_regAddress1] = useState("");
  const [count, set_count] = useState(0);

  const notify = () => toast("Referral is Copied Successfully!");
  const { address, isConnecting ,isConnected,isDisconnected} = useAccount()

  const { chain } = useNetwork()

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const temp_address = params.get("address");
// alert("hello "+regAddres)

const { config:claimRewardConfig } = usePrepareContractWrite({
  address: cont_address,
  abi: cont_abi,
  functionName: 'withdrawReward',

})
const { data:stakeResult_withdrawReward, isLoading2_withdrawReward, isSuccess2_withdrawReward, write:withdrawReward } = useContractWrite(claimRewardConfig)

const networkId=97;


 const waitForTransaction4 = useWaitForTransaction({
    hash: stakeResult_withdrawReward?.hash,
    onSuccess(data) {
    test?.()
      console.log('Success2',data )
    },
  })

  const { chains, error, isLoading, pendingChainId, switchNetwork:reward_switch } =
  useSwitchNetwork({
    chainId: networkId,
    // throwForSwitchChainNotSupported: true,
    onSuccess(){

      withdrawReward?.()
    }

  })

  function withdraw(_amount)
  {
    if(isDisconnected)
    {
      alert("kindly connect your wallet ");
      return;
    }
    // if(regAddress1!=address)

    // {
    //   alert (regAddress1)
    //   alert("kindly change your crypto wallet to the Registered wallet")
    //   return;
    // }
    if(_amount==0 )
    {
      alert("kindly write amount to stake ");
      return;
    }


    if(((Number(totalEarning)-Number(Total_withdraw))/10**18) < Number(_amount))
    {
      alert("You dont have enough balance");
      return;
    }
    if(chain.id!=networkId)
    {
      reward_switch?.();
    }else{
      withdrawReward?.()

    }
    // console.log(data__unstake);
    

  }



  const dashboardList = [
    {
      img: "../images/financial.png",
      title: "My Staking",
      price: totalInvestment/10**18,
    },
    {
      img: "../images/gift.png",
      title: "Staking Reward",
      price: totalReward/10**18,
    },
    {
      img: "../images/cash-withdrawal.png",
      title: "Total Withdrawal",
      price: Total_withdraw/10**18,
    },
    {
      img: "../images/award.png",
      title: "Available Balance",
      price: (totalEarning-Total_withdraw)/10**18,
    },
    {
      img: "../images/medal.png",
      title: "Referrak Income",
      price: "$30,920.10",
    },
    {
      img: "../images/reward.png",
      title: "Team",
      price: team,
    },




    {
      img: "../images/cashback.png",
      title: "Total Directs",
      price: directs,
    },
    {
      img: "../images/wallet.png",
      title: "Total Earning",
      price: totalEarning/10**18,
    },
  ];


  useEffect(()=>{
    if(count==0)
    {
      console.log("hello home ");
      test()
      // set_regAddress1(params.get("address"))
      set_regAddress(params.get("address"))
    set_count(1);

    }

  },[])
  function test()
  {
    set_regAddress1(params.get("address"))

  }
  return (
    <Wrapper>
      <div className="lading-page relative">
        <div className="wrap wrapWidth flex">
          <div className="dashboard-box">
            <div className="dashboard-header flex items-center justify-between gap-3">
              <h1 className="heading">Dashboard</h1>
              <UserProfile />
            </div>
            <hr class="w-full border-black" />
            <div className="d-list flex flex-col">
              <div className="grid-wrap grid lg:grid-cols-4 max-md:grid-cols-2 gap-5 max-md:gap-4">
                {dashboardList.map((item, index) => (
                  <div
                    key={index}
                    className="d-box flex flex-col justify-center items-center "
                  >
                    <div className="action flex items-center justify-end w-full">
                      <button
                        className={`btn-withdraw button ${
                          item.title === "Available Balance" ? "show" : ""
                        }`}
                        onClick={(e) => setOpen(true)}
                      >
                        Withdraw
                      </button>
                    </div>
                    <img className="d-img" src={item.img} alt={item.title} />
                    <h2 className="d-heading">{item.title}</h2>
                    <p className="d-par">{item.price}</p>
                  </div>
                ))}
              </div>
              <div className="d-link mt-10">
                <p className="d-par">Referral Link : {window.location.origin}/?ref={regAddress1?regAddress1.slice(0,4)+"...."+regAddress1.slice(38,42):"kindly connect"}</p>
                <CopyToClipboard text={`${window.location.origin}/?ref=${regAddress1}`} >
                        <button className="copy-icon flex items-center justify-center" onClick={notify}>
                          <PiCopySimpleFill color='white' className=' text-2xl'  />
                        </button>

                </CopyToClipboard>  
              </div>
            </div>
          </div>
        </div>

      </div>

      <Modal open={open} onClose={() => setOpen(false)}>
        <WithdrawModal withdraw={withdraw} />
      </Modal>
      <ToastContainer />

    </Wrapper>
  );
};

export default Main;

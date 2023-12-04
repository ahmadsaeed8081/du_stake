import React from "react";
import Wrapper from "../../routes/Wrapper";
import UserProfile from "../../components/userProfile";

const History = ({history}) => {
  const data = [
    {
      requirement: "Global Payment",
      dateRequest: "29 June 2021",
      dateSubmitted: "09 July 2021",
      status: "Received",
     
    },
    {
      requirement: "Smart Cart",
      dateRequest: "21 June 2021",
      dateSubmitted: "09 Sept 2021",
      status: "Received",
    },
    {
      requirement: "Us Payment Histry",
      dateRequest: "10 June 2021",
      dateSubmitted: "19 Sept 2021",
      status: "Received",
      investment: "$656.67",
    },
    {
      requirement: "Global Payment ",
      dateRequest: "15 August 2023",
      dateSubmitted: "10 Dec 2023",
      status: "Received",
      investment: "$156.67",
    },
    {
      requirement: "Smart Cart Amount",
      dateRequest: "30 August 2022",
      dateSubmitted: "05 August 2022",
      status: "Received",
      investment: "$956.67",
    },
    {
      requirement: "Us Payment Histry",
      dateRequest: "10 June 2021",
      dateSubmitted: "19 Sept 2021",
      status: "Received",
    },
    {
      requirement: "Long Amount",
      dateRequest: "30 August 2022",
      dateSubmitted: "05 August 2022",
      status: "Received",
    },
    {
      requirement: "Us Payment Histry",
      dateRequest: "10 June 2021",
      dateSubmitted: "19 Sept 2021",
      status: "Received",
    },
    {
      requirement: "Long Amount",
      dateRequest: "30 August 2022",
      dateSubmitted: "05 August 2022",
      status: "Received",
    },
    // Add more data as needed
  ];
  return (
    <Wrapper>
      <div className="History-page ">
        <div className="wrap wrapWidth flex">
          <div className="History-box">
            <div className="History-header flex items-center justify-between gap-3">
              <h1 className="heading">Transaction History</h1>
              <UserProfile />
            </div>
            <hr class="w-full border-black" />
            <div className="flex justify-center items-center w-full mt-12 max-md:overflow-x-auto overflow-y-auto max-h-[500px] px-8 pt-24">
              <table className="table w-full">
                <thead className="t-head">
                  <tr className="py-4">
                    <th className="fs">No.</th>
                    <th className="fs">Event</th>
                    <th className="fs">Amount</th>
                    <th className="fs">Date</th>
                  </tr>
                </thead>

                {history.length>0?
                (
                  <>
                    <tbody>
                      <p>hello</p>
                    {history.map((item, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-[#F0F0F0]" : "bg-white"}
                      >
                        <td className="fd border">{index}</td>
                        <td className="fd border">{item[0]==1?("Stake"):(item[0]==2?("UnStake"):(item[0]==3?("Withdraw"):(null) ) ) }</td>
                        
                        <td className="fd border">{item[1]/10**18} $DU</td>
                        <td className="fd border">{item[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                  </>
                ):(             null
                )}

              </table>
              
            </div>
                {history.length==0?
                (            <h1 className="heading" style={{ textAlign:"center" , paddingTop:70}} >Your Have no Transaction History Yet.</h1>
                ):(null)}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default History;

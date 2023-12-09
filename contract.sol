//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface Token {
    function transfer(address to, uint tokens) external returns (bool success);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool) ;
      function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);

    }
contract DuStake
    {
       
        address  public owner;


        address Staking_token = 0xd962cE68512C52F71Ca3033D43E8598049C2568F; //credit
        address Reward_Token  = 0xd962cE68512C52F71Ca3033D43E8598049C2568F; // bel3
        address company_add  = 0x4e28A7871B33C8358A5A116f62696d073BEc4670; 


        uint public totalusers;
        uint key;

        // uint public per_day_divider= 1 days;
        
        uint public bonus= 8*10**18;
        uint public minimum_investment=10*10**18;
        uint public minimum_withdraw_reward_limit=1*10**18;
        uint public maximum_withdraw_reward_limit=2500*10**18;

        uint public per_day_divider= 1 minutes;
        uint public penalty= 5;

        mapping(address=>bool) public isUser;
        // mapping(address=>uint) public Total_earningOf;
        mapping(address=>uint) public trasactionCount;

        mapping(address=>uint) public Total_TeamStakeOf;

        uint64[12] public levelpercentage = [0.4 ether,0.33 ether,0.1667 ether,0.1 ether,0.0667 ether,0.033 ether,0.033 ether,0.033 ether,0.033 ether,0.033 ether,0.033 ether,0.033 ether];
        uint[12] public level_tokens= [5000 *10**18,10000 *10**18,15000 *10**18,20000 *10**18,25000 *10**18,30000 *10**18,35000 *10**18,40000 *10**18,45000 *10**18,50000 *10**18,55000 *10**18,60000 *10**18];

        uint public totalbusiness; 
        mapping(uint=>address) public All_investors;

        struct allInvestments{

            uint investedAmount;
            uint withdrawnTime;
            uint DepositTime;
            uint investmentNum;
            uint unstakeTime;
            bool unstake;
            uint reward;
            uint apr;
            uint timeframe;


        }



        struct Data{

            mapping(uint=>allInvestments) investment;
            uint noOfInvestment;
            uint totalInvestment;
            uint totalWithdraw_reward;
            bool investBefore;
            address[] myReferrals;
            address referralFrom;  
            mapping(uint=>level_data) level;
            uint totalDirects;
            uint totalTeam;
        }


        struct time_Apy
        {
            uint timeframe;
            uint APR;
        }

        struct level_data
        {
            bool eligible;
            uint eligible_time;

            uint count; 


        }

        struct history
        {
            uint events;
            uint amount;
            uint time;
            uint total;

        }
  
        mapping(address=>Data) public user;
        mapping(uint=>time_Apy) public details;
        mapping(address=>mapping(uint=>history)) public historyOf;
        mapping(address=>uint) public BonusOf;


            mapping(address=>mapping(uint=>allInvestments)) public user_investments;

        constructor(uint _key){
            

            for(uint i=0;i<12;i++)
            {
                
            }

            key=_key;
            owner=msg.sender;              

            // details[0].timeframe=200 days;
            // details[1].timeframe=400 days;


            details[0].timeframe=200 minutes;
            details[1].timeframe=400 minutes;


            details[0].APR=100;
            details[1].APR=240;




        }
        
        function sendRewardToReferrals(address investor,uint _investedAmount)  internal  //this is the freferral function to transfer the reawards to referrals
        { 
 
            address temp = investor;
            uint i=0;

                do
                {
                    Total_TeamStakeOf[temp]+=_investedAmount;

                    user[temp].totalTeam++;
                    user[temp].level[i].count++;
                    for(uint j=0;j<12;j++)
                    {
                        if((Total_TeamStakeOf[temp]>=level_tokens[j]) && !user[temp].level[j].eligible)
                        {
                            user[temp].level[j].eligible=true;
                            user[temp].level[j].eligible_time=block.timestamp;

                            uint count=trasactionCount[temp];
                            historyOf[temp][count].events=4;
                            historyOf[temp][count].amount=level_tokens[j];
                            historyOf[temp][count].time=block.timestamp;
                            trasactionCount[temp]++;

                        }
                    }
                    temp=user[temp].referralFrom;

                    i++;
                    
                } 
                while(user[temp].referralFrom!=address(0));

        }
       


        function Stake(uint _investedamount,uint choose_val,uint _key,address _ref) external returns(bool success)
        {

            require(key==_key,"key issue");
            require(_investedamount >= minimum_investment  ,"value is not greater than 0");     //ensuring that investment amount is not less than zero

            require(details[choose_val].APR > 0," apr iss");
            require(_investedamount > 0,"value is not greater than 0");     
            // require(Token(Staking_token).allowance(msg.sender,address(this))>=_investedamount,"allowance");

            if(user[msg.sender].investBefore == false )
            { 
                All_investors[totalusers]=msg.sender;
                isUser[msg.sender]=true;
                

                if(_ref==address(0) || _ref==msg.sender || _ref==company_add)
                {
                    
                    user[msg.sender].referralFrom=company_add;
                    _ref=company_add;
                    user[_ref].myReferrals.push(msg.sender);
                }
                else 
                {
                    require(user[_ref].investBefore,"Ref id is not registered");
                    user[msg.sender].referralFrom=_ref;
                    user[_ref].myReferrals.push(msg.sender);
                    uint bon = (bonus * _investedamount)/(100*10**18);
                    BonusOf[_ref]+=bon;

                }
                
                user[_ref].totalDirects++;

                totalusers++;                                     
            }

            
            uint num = user[msg.sender].noOfInvestment;
            user[msg.sender].investment[num].investedAmount =_investedamount;
            user[msg.sender].investment[num].DepositTime=block.timestamp;
            user[msg.sender].investment[num].withdrawnTime=block.timestamp + details[choose_val].timeframe ;  
            
            user[msg.sender].investment[num].investmentNum=num;
            user[msg.sender].investment[num].apr=details[choose_val].APR;
            user[msg.sender].investment[num].timeframe=(details[choose_val].timeframe/per_day_divider);  


            user[msg.sender].totalInvestment+=_investedamount;
            user[msg.sender].noOfInvestment++;
            totalbusiness+=_investedamount;

            

            // Token(Staking_token).transferFrom(msg.sender,address(this),_investedamount);
            user_investments[msg.sender][num] = user[msg.sender].investment[num];
            user[msg.sender].investBefore=true;

            uint temp=trasactionCount[msg.sender];
            historyOf[msg.sender][temp].events=1;
            historyOf[msg.sender][temp].amount=_investedamount;
            historyOf[msg.sender][temp].time=block.timestamp;
            trasactionCount[msg.sender]++;
            sendRewardToReferrals( msg.sender, _investedamount);

            return true;
            
        }

       function get_TotalReward() view public returns(uint)
       { 
            uint totalReward;
            uint depTime;
            uint rew;
            uint temp = user[msg.sender].noOfInvestment;
            for( uint i = 0;i < temp;i++)
            {   
                if(!user[msg.sender].investment[i].unstake)
                {
                    if(block.timestamp < user[msg.sender].investment[i].withdrawnTime)
                    {
                        depTime =block.timestamp - user[msg.sender].investment[i].DepositTime;
                    }
                    else
                    {    
                        depTime =user[msg.sender].investment[i].withdrawnTime - user[msg.sender].investment[i].DepositTime;
                    }                
                }
                else{
                    depTime =user[msg.sender].investment[i].unstakeTime - user[msg.sender].investment[i].DepositTime;
                }
                depTime=depTime/per_day_divider; //1 day
                if(depTime>0)
                {
                     rew  =  (((user[msg.sender].investment[i].investedAmount * ((user[msg.sender].investment[i].apr) *10**18) )/ (100*10**18) )/(user[msg.sender].investment[i].timeframe));


                    totalReward += depTime * rew;
                }
            }
            totalReward -= user[msg.sender].totalWithdraw_reward;

            return totalReward;
        }


    //    function get_total_LevelReward() view public returns(uint)
    //    { 

    //         uint totalReward;
    //         uint depTime=0;
    //         uint rew;

    //         for( uint i = 0;i < 12;i++)
    //         {   
    //             if(user[msg.sender].level[i].eligible)
    //             {

    //                 depTime =block.timestamp - user[msg.sender].level[i].eligible_time;
                                  
    //             }
                
    //             depTime=depTime/per_day_divider; //1 day
    //             if(depTime>0)
    //             {
    //                  rew  =  (user[msg.sender].level[i].userTokens * (levelpercentage[i]) )/ (100*10**18) ;


    //                 totalReward += depTime * rew;
    //             }
    //         }

    //         return totalReward;
    //     }



        function getReward_perInv(uint i,address inv,uint _level,address main) view public returns(uint){ //this function is get the total reward balance of the investor
            uint totalReward;
            uint depTime;
            uint rew;

                if(!user[inv].investment[i].unstake)
                {
                    
                    if(block.timestamp < user[inv].investment[i].withdrawnTime)
                    {
                        depTime =block.timestamp - user[main].level[_level].eligible_time;
                    }
                    else
                    {    
                        depTime =user[inv].investment[i].withdrawnTime - user[main].level[_level].eligible_time;
                    }                        
                
                }
                else
                {
                    depTime =user[inv].investment[i].unstakeTime - user[main].level[_level].eligible_time;
                }
                depTime=depTime/per_day_divider; //1 day
                if(depTime>0)
                {
                     rew  =  (((user[inv].investment[i].investedAmount * ((user[inv].investment[i].apr) *10**18) )/ (100*10**18) )/(user[inv].investment[i].timeframe));


                    totalReward += depTime * rew;
                }
            

            return totalReward;
        }


        function unStake(uint num) external  returns (bool success)
        {


            require(user[msg.sender].investment[num].investedAmount>0,"you dont have investment to withdrawn");             //checking that he invested any amount or not
            require(!user[msg.sender].investment[num].unstake ,"you have withdrawn");
            uint amount=user[msg.sender].investment[num].investedAmount;


            if(user[msg.sender].investment[num].withdrawnTime > block.timestamp)
            {
                uint penalty_fee=(amount*(5*10**18))/(100*10**18);
                Token(Staking_token).transfer(owner,penalty_fee);            
                amount=amount-penalty_fee;
            }
            Token(Staking_token).transfer(msg.sender,amount);             //transferring this specific investment to the investor
          
            user[msg.sender].investment[num].unstake =true;    
            user[msg.sender].investment[num].unstakeTime =block.timestamp;    

            user[msg.sender].totalInvestment-=user[msg.sender].investment[num].investedAmount;
            user_investments[msg.sender][num] = user[msg.sender].investment[num];
            
            uint temp=trasactionCount[msg.sender];
            historyOf[msg.sender][temp].events=2;
            historyOf[msg.sender][temp].amount=amount;
            historyOf[msg.sender][temp].time=block.timestamp;
            trasactionCount[msg.sender]++;

            return true;

        }



        function getTotalInvestment() public view returns(uint) {   //this function is to get the total investment of the ivestor
            
            return user[msg.sender].totalInvestment;

        }
        
        function get_totalEarning() public view returns(uint) {   //this function is to get the total investment of the ivestor
            
            return (( get_TotalReward() + BonusOf[msg.sender]) - user[msg.sender].totalWithdraw_reward );

        }

        function withdrawReward(uint _vlaue) external returns (bool success){
            uint Total_reward = get_totalEarning();
            
            require(_vlaue >= minimum_withdraw_reward_limit && _vlaue <= maximum_withdraw_reward_limit ,"limit issue");     //ensuring that investment amount is not less than zero

            require(Total_reward>=_vlaue,"you dont have rewards to withdrawn");         //ensuring that if the investor have rewards to withdraw
        
            Token(Reward_Token).transfer(msg.sender,_vlaue);             // transfering the reward to investor             
            user[msg.sender].totalWithdraw_reward+=_vlaue;
            uint temp=trasactionCount[msg.sender];

            historyOf[msg.sender][temp].events=3;
            historyOf[msg.sender][temp].amount=_vlaue;
            historyOf[msg.sender][temp].time=block.timestamp;
            trasactionCount[msg.sender]++;

            return true;

        }

         function getAll_investments() public view returns (allInvestments[] memory Invested) { //this function will return the all investments of the investor and withware date
            uint num = user[msg.sender].noOfInvestment;
            uint temp;
            uint currentIndex;
            
            for(uint i=0;i<num;i++)
            {
               if(!user[msg.sender].investment[i].unstake )
               {
                   temp++;
               }

            }
         
            Invested =  new allInvestments[](temp) ;

            for(uint i=0;i<num;i++)
            {
               if( !user[msg.sender].investment[i].unstake ){

                   Invested[currentIndex]=user[msg.sender].investment[(num-1)-i];
                    // Invested[currentIndex].reward=getReward_perInv((num-1)-i,msg.sender);

                   currentIndex++;
               }

            }
            return Invested;

        }

        function getAll_investments_ForReward() public view returns (allInvestments[] memory Invested) { //this function will return the all investments of the investor and withware date
            uint num = user[msg.sender].noOfInvestment;
        
         
            Invested =  new allInvestments[](num) ;

            for(uint i=0;i<num;i++)
            {

                Invested[i]=user[msg.sender].investment[(num-1)-i];
                // Invested[i].reward = getReward_perInv((num-1)-i,msg.sender);

            }
            return Invested;

        }
        
        function get_upliner(address inv) public view returns(address)
        {
            return user[inv].referralFrom;
        }
                
        function get_eligibleTime(address inv,uint _level) public view returns(uint )
        {
            return user[inv].level[_level].eligible_time;
        }


        function Level_earning(address inv) public view returns( uint[] memory arr1 )
        { 

            uint[] memory levelRewards = new uint[](12);
            // uint depTime=0;
            // uint rew;
            uint calc_rew; 
            address[] memory direct_members = user[inv].myReferrals;
            uint next_member_count;

            for(uint j=0; j < 12;j++) //levels
            {

                if(user[inv].level[j].eligible)
                {
                    for( uint k = 0;k < direct_members.length;k++) //members
                    {   
                        
                        next_member_count+=user[direct_members[k]].myReferrals.length;

                        uint temp = user[msg.sender].noOfInvestment; 

                        for( uint i = 0;i < temp;i++) //investments
                        {   
                            if(user[direct_members[k]].investment[i].DepositTime<=user[inv].level[j].eligible_time)
                            {
                                uint temp_amount = getReward_perInv(i,direct_members[k],j,inv);
                                 calc_rew +=  ((temp_amount * (levelpercentage[j]) )/ (100*10**18) );

                            }
                            
                        }


                                    
                    }
                    levelRewards[j]=calc_rew;
                    calc_rew=0;

                    address[] memory next_members=new address[](next_member_count) ;

                        for( uint m = 0;m < direct_members.length;m++) //members
                        {   
                            for( uint n = 0; n < user[direct_members[m]].myReferrals.length; n++) //members
                            {   
                                next_members[calc_rew]= user[direct_members[m]].myReferrals[n];
                                calc_rew++;
                            }
                        }
                    direct_members=next_members; 
                    next_member_count=0;


                }
            }
                

            
            

            return levelRewards;
        }



        function Level_count(address inv) public view returns( uint[] memory _arr )
        {
            uint[] memory referralLevels_count=new uint[](12);

            for(uint i=0;i<12;i++)
            {
                referralLevels_count[i] = user[inv].level[i].count;
            }
            return referralLevels_count ;


        }
        
        function get_history(address inv) public view returns( history[] memory _arr )
        {
            uint temp=trasactionCount[msg.sender];

            _arr=new history[](temp);
            for(uint i=0;i<temp;i++)
            {

                    _arr[i] = historyOf[inv][i];



            }
            return _arr ;


        }

  
        function transferOwnership(address _owner)  public
        {
            require(msg.sender==owner,"only Owner can call this function");
            owner = _owner;
        }

        function total_withdraw_reaward() view public returns(uint){


            uint Temp = user[msg.sender].totalWithdraw_reward;

            return Temp;
            

        }
        function get_currTime() public view returns(uint)
        {
            return block.timestamp;
        }
        
        function get_withdrawnTime(uint num) public view returns(uint)
        {
            return user[msg.sender].investment[num].withdrawnTime;
        }



       function withdrawFunds(uint token,uint _amount)  public
        {
            require(msg.sender==owner);
            address curr_add;

            if(token==1){
                curr_add= Staking_token;
            }else if(token==2)
            {
                curr_add= Reward_Token;
            }
            uint bal = Token(curr_add).balanceOf(address(this));
            // _amount*=10**18;
            require(bal>=_amount);

            Token(curr_add).transfer(curr_add,_amount); 
        }



    } 
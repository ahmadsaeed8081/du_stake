import React, { useEffect, useState } from "react";
import UserProfile from "../../components/userProfile";
import Wrapper from "../../routes/Wrapper";
import Axios  from "axios";

import { GalleryIcon } from "../../assets/Icons";

const Profile = ({email}) => {
  const [img, setImg] = useState();
  const [data, setdata] = useState([]);



  async function HandleProfile(event) 
  {
    event.preventDefault(); // prevent the form from submitting
    try{

      const userData=await Axios.get("https://duapi-production.up.railway.app/getdatabymail?"+ new URLSearchParams({
        Email: email,})
      ).then((response)=>{
        console.log(response);
        setdata(response)
        

      })
    }catch(e){
      console.log(e.response.data);
    }
   

  }

  useEffect(()=>{

  })


  return (
    <Wrapper>
      <div className="profile-page flex">
        <div className="wrap wrapWidth flex">
          <div className="profile-box">
            <div className="profile-header flex items-center justify-between gap-3">
              <h1 className="heading">Edit Profile</h1>
              <UserProfile />
            </div>
            <hr class="w-full border-black" />
            <div className="form-block flex flex-col">
              <h1 className="form-title">Account Setting</h1>
              <div className="input-filed flex flex-col my-12">
                <div className="i-lbl mb-2">Your Profile Picture</div>
                <div
                  className="img-box flex flex-col items-center justify-center"
                  onClick={() => document.getElementById("upload_img").click()}
                >
                  {img ? (
                    <img src={URL.createObjectURL(img)} className="img" />
                  ) : (
                    <>
                      <GalleryIcon />
                      <div className="u-lbl">Upload your photo</div>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    title=""
                    name="image"
                    id="upload_img"
                    className="select-file cleanbtn"
                    onChange={(e) => {
                      setImg(e.target.files[0]);
                    }}
                  />
                </div>
              </div>
              <div className="row2">
                <div className="input-filed flex flex-col">
                  <div className="i-lbl mb-2">Your Name</div>
                  <input
                    type="text"
                    placeholder="Please enter your full name"
                    className="txt w-full"
                    value={data}
                    readOnly
                  />
                </div>
                <div className="input-filed flex flex-col">
                  <div className="i-lbl mb-2">Email</div>
                  <input
                    type="email"
                    placeholder="Please enter your email"
                    className="txt w-full"
                    value={email}
                  />
                </div>
                <div className="input-filed flex flex-col">
                  <div className="i-lbl mb-2">Username</div>
                  <input
                    type="text"
                    placeholder="Please enter your username"
                    className="txt w-full"
                  />
                </div>
                <div className="input-filed flex flex-col">
                  <div className="i-lbl mb-2">Phone number</div>
                  <input
                    type="text"
                    placeholder="Please enter your phone number"
                    className="txt w-full"
                  />
                </div>
              </div>
              <div className="row1 mt-5">
                <div className="input-filed flex flex-col">
                  <div className="i-lbl mb-2">Phone number</div>
                  <textarea
                    type="text"
                    placeholder="Write your Bio here e.g your hobbies, interests ETC"
                    className="txt w-full min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Profile;

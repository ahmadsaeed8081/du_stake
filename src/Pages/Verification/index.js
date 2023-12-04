import React, { useState } from "react";
import Wrapper from "../../routes/Wrapper";
import UserProfile from "../../components/userProfile";

const Verification = () => {
  const [img, setImg] = useState();
  return (
    <Wrapper>
      <div className="Verification-page ">
        <div className="wrap wrapWidth flex">
          <div className="Verification-box">
            <div className="Verification-header items-center justify-between gap-3">
              <h1 className="heading">KYC Verification</h1>
              <UserProfile />
            </div>
            <hr class="w-full border-black mt-4 p-0 max-md:hidden" />
            <div className="flex flex-col justify-center mt-12 verify max">
              <h2 className="veri-heading">KYC Verification</h2>
              <p className="veri-desc ">
                Please take a selfie with your document so that it’s clearly
                visible and does cover your face.
              </p>
              <div className="veri-img flex justify-center gap-10 max-md:gap-5 max-md:mt-5 mt-10">
                <div
                  className="img-box flex flex-col items-center justify-center"
                  onClick={() => document.getElementById("upload_img").click()}
                >
                  {img ? (
                    <img src={URL.createObjectURL(img)} className="img" />
                  ) : (
                    <>
                      {/* <GalleryIcon /> */}
                      <img src="/images/cloud.png" className="i-img" />
                      <div className="u-lbl">Choose file to upload</div>
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
                <div className="img-box flex justify-center items-center">
                  <img src="../images/idcardimg.png" alt="" className="img" />
                </div>
              </div>
              <div className="flex btns justify-center items-center gap-6 mt-7 max-md:gap-4">
                <button className="can">Cancel</button>
                <button className="sub">Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default Verification;

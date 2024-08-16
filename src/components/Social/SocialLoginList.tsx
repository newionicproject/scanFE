/* eslint-disable @typescript-eslint/no-explicit-any */
import "./SocialLoginList.scss";

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

export const SocialLoginList = () => {

  const handleFacebookLogin = () => {
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.onload = () => {
      window.fbAsyncInit = function() {
        // Initialize the SDK with your app and the Graph API version for your app
        window.FB.init({
          appId: '271120589243712', // Replace with your own App ID
          xfbml: true,
          version: 'v18.0'
        });
        // Trigger the login process
        window.FB.login(function(response:any) {
          if (response.authResponse) {
            console.log('Welcome! Fetching your information....');
            window.FB.api('/me', {fields: 'name, email'}, function(response:any) {
              console.log(response);
            });
          } else {
            console.log('User cancelled login or did not fully authorize.');
          }
        });
      };
    };
    document.body.appendChild(script);
  }

  return (
    <div className="socialLoginList">
      <div className="WrapperLogin">
        <button id="facebook" onClick={handleFacebookLogin}>
          <i className="fa-brands fa-facebook-f"></i>
        </button>
        <button id="instagram">
          <i className="fa-brands fa-instagram"></i>
        </button>
        <button id="googleplus">
          <i className="fa-brands fa-google "></i>
        </button>
      </div>
    </div>
  );
};

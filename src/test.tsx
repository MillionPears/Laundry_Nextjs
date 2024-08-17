// "use client";

// import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
// import { app } from "./firebaseConfig";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function handleSubmit () {
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false)
//   const auth = getAuth(app);
//   const router = useRouter();
//   useEffect(() => {
//     window.recaptchaVerifier = new RecaptchaVerifier(
//       auth,
//       "recaptcha-container",
//       {
//         size: "invisible",
//         callback: (response: any) => {},
//         "expired-callback": () => {},
//       }
//     );
//   });
//  const handleSendOtp = async() =>{
//     try {
//       const confirmationResult = await signInWithPhoneNumber(
//         auth,
//         phoneNumber,
//         window.recaptchaVerifier?
//       );
//       setVerificationId(confirmationResult.verificationId);
//       setOtpSent(true);
//     } catch (error) {
//       console.error("Failed to send OTP:", error);
//     }
//  }
// }

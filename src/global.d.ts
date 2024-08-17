import { RecaptchaVerifier } from 'firebase/auth';

declare global {
  interface Window {
    confirmationResult?: firebase.auth.ConfirmationResult;
    recaptchaVerifier?: RecaptchaVerifier; // Cập nhật thành RecaptchaVerifier
  }
}

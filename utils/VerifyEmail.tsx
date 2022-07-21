import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { authProvider } from "./provider";
import { useCountdown, useIntervalWhen, useDocumentEventListener, useSessionstorageState } from "rooks";
import MUIButton from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardAction from '@material-ui/core/CardActions';
import CardContent from '@mui/material/CardContent';

export const VerifyEmail = ({ user = {} }) => {
  const [resendAvailable, setResendAvailable] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [emailVerified, setEmailVerified] = useState(false);
  const [resend, setResend] = useState(false);
  const timeout = useMemo(() => new Date(Date.now() + 10 * 1000), []);
  const count = useCountdown(timeout, {
    interval: 1000,
    onEnd: () => setResendAvailable(true),
  });
  useDocumentEventListener("visibilitychange", function () {
    setPageVisible(document.visibilityState === 'visible');
  });

  useIntervalWhen(
    async () => {
      const idtokenresult = await user.getIdTokenResult(true);
      if (idtokenresult?.claims?.email_verified) {
        setEmailVerified(true);
        await authProvider.checkAuth();
      }
    },
    3000,
    !user.emailVerified && pageVisible,
    false
  );
  const sendMail = useCallback(async () => {
    setResend(true);
    const { sendEmailVerification, updateEmail } = await import("firebase/auth");
    sendEmailVerification(user.auth.currentUser);
  }, [user, setResend]);
  const [hasSendEmail, setHasSendEmail] = useSessionstorageState('websites-mingram-net-2-0_userVerificationEmailSend');
  useEffect(() => {
    if (!hasSendEmail) {
      sendMail();
    }
    setHasSendEmail(true);
  }, []);

  if (emailVerified) {
    location.reload();
    return (<div style={{ maxWidth: 500 }}><Card>
      <CardContent><p>Thanks for verifing your email '{user.email}'!</p></CardContent>
      <CardAction><p><MUIButton
        variant="contained"
        type="submit"
        color="primary"
        onClick={() => { location.reload(); }}
      >
        Refresh the page!
      </MUIButton></p></CardAction>
    </Card></div>);
  }

  return (<div style={{ maxWidth: 500 }}><Card>
    <CardContent><p>Please verify your email '{user.email}'</p></CardContent>
    <CardAction><p>{resend ? <>Verification email resend!</> : <MUIButton
      variant="contained"
      type="submit"
      color="primary"
      onClick={sendMail}
      disabled={!resendAvailable}
    >
      {resendAvailable ? 'Resend verification email' : `Resend verification email available in ${count} seconds`}
    </MUIButton>}</p></CardAction>
  </Card></div>);
};

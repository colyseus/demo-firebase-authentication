import { initializeApp } from "firebase/app";
import { EmailAuthProvider, getAuth, linkWithCredential, signInAnonymously, signOut } from "firebase/auth";

import * as Colyseus from "colyseus.js";


const firebaseConfig = {
  // add the firebase credentials here from app creation
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const colyseusClient = new Colyseus.Client('ws://localhost:2567');

const loginAnonymously = () => {
    signInAnonymously(auth)
      .then(authResponse => {
        colyseusClient.joinOrCreate('my_room', {accessToken: authResponse.user.accessToken})
            .then(gameRoom => {
              window.gameRoom = gameRoom;
            })
            .catch(err => console.error(err));
      }).catch(e => console.error(e));
}

const logout = () => {
  signOut(auth).then(authResponse => {
    gameRoom.leave(true);
  }).catch(err => console.error(err));
}

const upgardeAccountToPermenant = (email, password) => {
  const credential = EmailAuthProvider.credential(email, password);

  linkWithCredential(auth.currentUser, credential)
  .then((usercred) => {
    const user = usercred.user;
    console.log("Anonymous account successfully upgraded", user);
  }).catch((error) => {
    console.log("Error upgrading anonymous account", error);
  });
}

window.loginAnonymously = loginAnonymously;
window.logout = logout;
window.upgardeAccountToPermenant = upgardeAccountToPermenant;

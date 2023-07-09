import * as Colyseus from "colyseus.js";
import { EmailAuthProvider, linkWithCredential, signInAnonymously, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

const IS_LOCAL = (window.location.hostname === "localhost");

const client = (IS_LOCAL)
  ? new Colyseus.Client('ws://localhost:2567')
  : new Colyseus.Client('https://colyseus-demos.onrender.com/');

async function loginAnonymously() {
  const userCredential = await signInAnonymously(auth);

  return await client.joinOrCreate('my_room_firebase', {
    accessToken: userCredential.user.accessToken
  });
}

async function loginWithEmailAndPassword(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);

  return await client.joinOrCreate('my_room_firebase', {
    accessToken: userCredential.user.accessToken
  });
}

async function logout () {
  await signOut(auth);
  hideElement('#room');
}

async function upgradeAccountToPermanent(email, password) {
  try {
    const credential = EmailAuthProvider.credential(email, password);
    const userCredential = await linkWithCredential(auth.currentUser, credential)

    console.log("Anonymous account successfully upgraded", userCredential.user);
    return userCredential.user;
  } catch (e) {
    displayError(e);
    throw e;
  }
}

let room = undefined;
window.onLoginBtnClick = async function () {
  toggleDisabled('#loginBtn');

  try {
    room = await loginAnonymously();
    hideErrors();
    hideElement('#login');

    room.onStateChange(() => {
      showElement('#room');
      document.querySelector("#room").innerHTML = "<pre>" + JSON.stringify(room.state, null, 2) + "</pre>";
    });

    showElement('#convertAcc');
    showElement('#logout');

  } catch (e) {
    displayError(e);

  } finally {
    toggleDisabled('#loginBtn');
  }
}

window.onLogoutBtnClick = function () {
  logout();

  room.leave();
  room = undefined;

  showElement('#login');
  hideElement('#convertAcc');
  hideElement('#logout');
}

window.onUpgradeAccountBtnClick = async function() {
  toggleDisabled('#convertAccBtn');

  const email = document.querySelector('#convertAcc input[name=email]').value;
  const password = document.querySelector('#convertAcc input[name=password]').value;

  try {
    await upgradeAccountToPermanent(email, password);
    document.getElementById('convertAcc').innerText = "Account successfully upgraded! (" + email + ")";

  } catch (e) {
    displayError(e);

  } finally {
    toggleDisabled('#convertAccBtn');
  }
}

window.onLoginWithEmailAndPassword = async function() {
  toggleDisabled('#loginEmailPasswordBtn');

  const email = document.querySelector('#loginEmailPassword input[name=email]').value;
  const password = document.querySelector('#loginEmailPassword input[name=password]').value;

  try {
    const room = await loginWithEmailAndPassword(email, password);
    hideErrors();
    hideElement('#login');

    room.onStateChange(() => {
      showElement('#room');
      document.querySelector("#room").innerHTML = "<pre>" + JSON.stringify(room.state, null, 2) + "</pre>";
    });

    showElement('#logout');

  } catch (e) {
    displayError(e);

  } finally {
    toggleDisabled('#loginEmailPasswordBtn');
  }

}

function displayError(e) {
  console.error(e);
  const errorSelector = "#errors";

  const innerHTML = "<p>" + e.message + "</p><pre class=\"text-start\">" + e.stack + "</pre>";
  document.querySelector(errorSelector).innerHTML = innerHTML;

  showElement(errorSelector);
}

function hideErrors() {
  hideElement("#errors");
}

function toggleDisabled(buttonSelector) {
  const button = document.querySelector(buttonSelector);
  button.disabled = !button.disabled;
}

function hideElement(selector) { document.querySelector(selector).classList.add('d-none'); }
function showElement(selector) { document.querySelector(selector).classList.remove('d-none'); }
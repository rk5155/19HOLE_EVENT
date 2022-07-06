import { getFirestore, doc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  data () {
    return {
      loginUserName: null,
      loginUserEmail: null,
      loginUserId: null,
      loginUserEventsToAttend: null,
      getFirestoreDb: null,
      loginUserProfile: null,
      isLoggedIn: false,
      isDisplayHeader: false
    }
  },
  created () {
    this.getFirestoreDb = getFirestore()

    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        this.loginUserName = user.displayName;
        this.loginUserEmail = user.email;
        this.loginUserId = user.uid
        this.loginUserProfile = doc(this.getFirestoreDb, "users", this.loginUserId);
        this.isLoggedIn = auth.currentUser;
        this.isDisplayHeader = true
      } else {
        this.isDisplayHeader = true
      }
    })
  },
}


import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  updateProfile, 
  onAuthStateChanged,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  collection,
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5sK4m-TiFAWpzC3BBZdTU19aP2EhZIeE", // This is a placeholder - replace with your actual API key
  authDomain: "anime-app-example.firebaseapp.com",
  projectId: "anime-app-example",
  storageBucket: "anime-app-example.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefghijklmnopqrstu",
  measurementId: "G-ABCDEFGHI"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const db = getFirestore(app);

// Auth functions
export const registerUser = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile with display name
    await updateProfile(user, { displayName });
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email,
      displayName,
      photoURL: null,
      createdAt: serverTimestamp(),
      watchlist: []
    });
    
    return { user };
  } catch (error) {
    return { error };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user };
  } catch (error) {
    return { error };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// User data functions
export const getUserData = async (userId: string) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { userData: docSnap.data() };
    } else {
      return { error: "No user data found" };
    }
  } catch (error) {
    return { error };
  }
};

// Comment functions
export const addComment = async (userId: string, animeId: string, episodeId: string, content: string) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return { error: "User not found" };
    }
    
    const userData = userSnap.data();
    
    const commentRef = await addDoc(collection(db, "comments"), {
      userId,
      animeId,
      episodeId,
      content,
      userName: userData.displayName,
      userPhoto: userData.photoURL,
      createdAt: serverTimestamp(),
      likes: 0
    });
    
    return { commentId: commentRef.id };
  } catch (error) {
    return { error };
  }
};

export const getEpisodeComments = async (animeId: string, episodeId: string) => {
  try {
    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef, 
      where("animeId", "==", animeId), 
      where("episodeId", "==", episodeId),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const comments: any[] = [];
    
    querySnapshot.forEach((doc) => {
      comments.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      });
    });
    
    return { comments };
  } catch (error) {
    return { error };
  }
};

// Watchlist functions
export const addToWatchlist = async (userId: string, animeId: string, animeName: string, animeCover: string) => {
  try {
    const userRef = doc(db, "users", userId);
    
    // Check if anime is already in watchlist
    const watchlistRef = collection(db, "watchlist");
    const q = query(
      watchlistRef,
      where("userId", "==", userId),
      where("animeId", "==", animeId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return { error: "Anime already in watchlist" };
    }
    
    // Add to watchlist collection
    const watchlistItemRef = await addDoc(collection(db, "watchlist"), {
      userId,
      animeId,
      animeName,
      animeCover,
      addedAt: serverTimestamp(),
      rating: 0
    });
    
    return { watchlistItemId: watchlistItemRef.id };
  } catch (error) {
    return { error };
  }
};

export const removeFromWatchlist = async (userId: string, animeId: string) => {
  try {
    const watchlistRef = collection(db, "watchlist");
    const q = query(
      watchlistRef,
      where("userId", "==", userId),
      where("animeId", "==", animeId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { error: "Anime not in watchlist" };
    }
    
    // Delete the watchlist item
    const watchlistItem = querySnapshot.docs[0];
    await deleteDoc(doc(db, "watchlist", watchlistItem.id));
    
    return { success: true };
  } catch (error) {
    return { error };
  }
};

export const getUserWatchlist = async (userId: string) => {
  try {
    const watchlistRef = collection(db, "watchlist");
    const q = query(
      watchlistRef,
      where("userId", "==", userId),
      orderBy("addedAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const watchlist: any[] = [];
    
    querySnapshot.forEach((doc) => {
      watchlist.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { watchlist };
  } catch (error) {
    return { error };
  }
};

// Rating functions
export const rateAnime = async (userId: string, animeId: string, rating: number) => {
  try {
    const watchlistRef = collection(db, "watchlist");
    const q = query(
      watchlistRef,
      where("userId", "==", userId),
      where("animeId", "==", animeId)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { error: "Add anime to watchlist before rating" };
    }
    
    // Update rating in the watchlist item
    const watchlistItem = querySnapshot.docs[0];
    await updateDoc(doc(db, "watchlist", watchlistItem.id), {
      rating
    });
    
    return { success: true };
  } catch (error) {
    return { error };
  }
};

export const getAnimeRatings = async (animeId: string) => {
  try {
    const watchlistRef = collection(db, "watchlist");
    const q = query(
      watchlistRef,
      where("animeId", "==", animeId),
      where("rating", ">", 0)
    );
    
    const querySnapshot = await getDocs(q);
    const ratings: any[] = [];
    
    querySnapshot.forEach((doc) => {
      ratings.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Calculate average rating
    let total = 0;
    ratings.forEach(item => {
      total += item.rating;
    });
    
    const averageRating = ratings.length > 0 ? total / ratings.length : 0;
    
    return { 
      ratings,
      averageRating,
      totalRatings: ratings.length
    };
  } catch (error) {
    return { error };
  }
};

export { auth, db, onAuthStateChanged };
export type { User };

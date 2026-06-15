import { auth, db } from './firebaseClient';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';

// Helper to get current user id
const getUserId = () => {
  return auth.currentUser?.uid || null;
};

// Helper to sort array of documents in memory
const sortDocs = (docs, orderByField) => {
  if (!orderByField) return docs;
  const ascending = !orderByField.startsWith('-');
  const key = orderByField.replace(/^-/, '').replace('created_date', 'created_at');

  return [...docs].sort((a, b) => {
    let valA = a[key];
    let valB = b[key];

    if (valA === undefined || valA === null) return ascending ? 1 : -1;
    if (valB === undefined || valB === null) return ascending ? -1 : 1;

    // Handle strings (like titles or ISO dates)
    if (typeof valA === 'string' && typeof valB === 'string') {
      return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    
    // Numeric or date comparison fallback
    return ascending ? (valA - valB) : (valB - valA);
  });
};

export const Book = {
  list: async (orderBy = '-created_at') => {
    const userId = getUserId();
    if (!userId) return [];

    const q = query(collection(db, 'books'), where('user_id', '==', userId));
    const querySnapshot = await getDocs(q);
    const books = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    return sortDocs(books, orderBy);
  },
  filter: async (filters, orderBy) => {
    const userId = getUserId();
    if (!userId) return [];

    const q = query(collection(db, 'books'), where('user_id', '==', userId));
    const querySnapshot = await getDocs(q);
    let books = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    for (const [key, value] of Object.entries(filters)) {
      if (key === 'id') {
        books = books.filter(b => b.id === value);
      } else {
        books = books.filter(b => b[key] === value);
      }
    }

    return sortDocs(books, orderBy);
  },
  create: async (bookData) => {
    const userId = getUserId();
    if (!userId) throw new Error("User not authenticated");
    const docRef = await addDoc(collection(db, 'books'), {
      ...bookData,
      user_id: userId,
      created_at: bookData.created_at || new Date().toISOString()
    });
    return { ...bookData, id: docRef.id, user_id: userId };
  },
  update: async (id, bookData) => {
    const docRef = doc(db, 'books', id);
    await updateDoc(docRef, bookData);
    return { ...bookData, id };
  },
  delete: async (id) => {
    await deleteDoc(doc(db, 'books', id));
  },
};

export const Quote = {
  list: async (orderBy = '-created_at', limit) => {
    const userId = getUserId();
    if (!userId) return [];

    const q = query(collection(db, 'quotes'), where('user_id', '==', userId));
    const querySnapshot = await getDocs(q);
    let quotes = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    quotes = sortDocs(quotes, orderBy);
    if (limit) {
      quotes = quotes.slice(0, limit);
    }
    return quotes;
  },
  filter: async (filters, orderBy) => {
    const userId = getUserId();
    if (!userId) return [];

    const q = query(collection(db, 'quotes'), where('user_id', '==', userId));
    const querySnapshot = await getDocs(q);
    let quotes = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    for (const [key, value] of Object.entries(filters)) {
      if (key === 'id') {
        quotes = quotes.filter(q => q.id === value);
      } else {
        quotes = quotes.filter(q => q[key] === value);
      }
    }

    return sortDocs(quotes, orderBy);
  },
  create: async (quoteData) => {
    const userId = getUserId();
    if (!userId) throw new Error("User not authenticated");
    const docRef = await addDoc(collection(db, 'quotes'), {
      ...quoteData,
      user_id: userId,
      created_at: quoteData.created_at || new Date().toISOString()
    });
    return { ...quoteData, id: docRef.id, user_id: userId };
  },
  update: async (id, quoteData) => {
    const docRef = doc(db, 'quotes', id);
    await updateDoc(docRef, quoteData);
    return { ...quoteData, id };
  },
  delete: async (id) => {
    await deleteDoc(doc(db, 'quotes', id));
  },
};

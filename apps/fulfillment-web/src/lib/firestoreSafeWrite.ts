import {
  addDoc as _addDoc,
  setDoc as _setDoc,
  updateDoc as _updateDoc,
  deleteDoc as _deleteDoc,
  DocumentReference,
  DocumentData,
  CollectionReference,
} from 'firebase/firestore';

type AnyRef = DocumentReference<DocumentData> | CollectionReference<DocumentData>;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function assertRef(ref: unknown, fnName: string): asserts ref is AnyRef {
  if (!ref || typeof ref !== 'object') {
    throw new Error([FirestoreSafeWrite] : invalid ref);
  }
}

function assertData(data: unknown, fnName: string): asserts data is Record<string, unknown> {
  if (!isPlainObject(data)) {
    throw new Error([FirestoreSafeWrite] : data must be a plain object);
  }
  // Reject undefined field values (common silent bug cause)
  for (const [k, v] of Object.entries(data)) {
    if (typeof v === 'undefined') {
      throw new Error([FirestoreSafeWrite] : field "\" is undefined);
    }
  }
}

function withContext(err: unknown, ctx: Record<string, unknown>) {
  const base = err instanceof Error ? err : new Error(String(err));
  // Attach context without breaking Error shape
  (base as any).firestoreContext = ctx;
  return base;
}

export async function safeSetDoc(
  ref: DocumentReference<DocumentData>,
  data: Record<string, unknown>,
  options?: Parameters<typeof _setDoc>[2],
) {
  assertRef(ref, 'safeSetDoc');
  assertData(data, 'safeSetDoc');
  try {
    // @ts-expect-error options typing varies by SDK version
    return await _setDoc(ref, data as any, options as any);
  } catch (e) {
    throw withContext(e, { op: 'setDoc' });
  }
}

export async function safeAddDoc(
  ref: CollectionReference<DocumentData>,
  data: Record<string, unknown>,
) {
  assertRef(ref, 'safeAddDoc');
  assertData(data, 'safeAddDoc');
  try {
    return await _addDoc(ref, data as any);
  } catch (e) {
    throw withContext(e, { op: 'addDoc' });
  }
}

export async function safeUpdateDoc(
  ref: DocumentReference<DocumentData>,
  data: Record<string, unknown>,
) {
  assertRef(ref, 'safeUpdateDoc');
  assertData(data, 'safeUpdateDoc');
  try {
    return await _updateDoc(ref, data as any);
  } catch (e) {
    throw withContext(e, { op: 'updateDoc' });
  }
}

export async function safeDeleteDoc(
  ref: DocumentReference<DocumentData>,
) {
  assertRef(ref, 'safeDeleteDoc');
  try {
    return await _deleteDoc(ref);
  } catch (e) {
    throw withContext(e, { op: 'deleteDoc' });
  }
}
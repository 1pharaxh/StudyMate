import { atom, useAtom } from "jotai";
// signedIn could be teacher or student or null
type Config = {
  signedIn: null | "teacher" | "student";
  name: string;
  subject?: string;
  duration?: string;
};

const configAtom = atom<Config>({
  signedIn: null,
  name: "",
  subject: "",
  duration: "",
});

export function useLogin() {
  return useAtom(configAtom);
}

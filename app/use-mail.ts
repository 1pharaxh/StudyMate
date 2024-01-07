import { atom, useAtom } from "jotai";

type Config = {
  selected: null | number | string;
};

const configAtom = atom<Config>({
  selected: null,
});

export function useMail() {
  return useAtom(configAtom);
}

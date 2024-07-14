import { atom } from 'recoil';

export const textState = atom({
    key: 'textState',
    default: 'Empower knowledge with every search',
});

export const screenState = atom({
    key: 'screenState',
    default: 'home',
});
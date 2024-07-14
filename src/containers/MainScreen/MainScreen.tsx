import React, {ReactNode, useEffect} from 'react';
import styles from './MainText.module.css';
import clsx from 'clsx';
import {useRecoilState} from "recoil";
import {textState} from "../../recoils";

interface MainTextProps {
    text: string;
    children?: ReactNode;
    alignLeft?: boolean;
}

const MainScreen: React.FC<MainTextProps> = ({ text, children, alignLeft = false }) => {
    const [mainText, setMainText] = useRecoilState(textState);
    
    useEffect(() => {
        setMainText(text);
    }, [text, setMainText]);
    
    return (
        <div className={clsx(styles.mainTextContainer, { [styles.alignLeft]: alignLeft })}>
            <h1 className={clsx(styles.mainTextTitle, { [styles.titleAlignLeft]: alignLeft })}>{mainText}</h1>
            {children}
        </div>
    );
};

export default MainScreen;

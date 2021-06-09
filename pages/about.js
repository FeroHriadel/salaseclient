import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScroll } from "@fortawesome/free-solid-svg-icons";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { faLaptop } from "@fortawesome/free-solid-svg-icons";
import { faMapSigns } from "@fortawesome/free-solid-svg-icons";



const about = () => {
    //TYPEWRITER EFFECT
    const text = `'Salase' is a Slovak word for shepherds huts in the hills. There's still a couple of these places left hidden in the mountains of Slovakia... Remnants of the olden days built in remote areas. These places are magic. Their aesthetic value aside, Salase provide overnight shelter for hikers who need to get away from it all. Now, if that's you - you came to the right place.`

    const [index, setIndex] = useState(0);

    useEffect(() => {

        if (index === text.length) return

        const timeout = setTimeout(() => {
            setIndex(index + 1)
        }, 50);

        return () => clearTimeout(timeout);

    }, [index])



    //SHOW PARAGRAPH TWO    
    const [paragraph2Shown, setParagraph2Shown] = useState(false);

    useEffect(() => {
        const timeout2 = setTimeout(() => {
            setParagraph2Shown(true);
        }, 50 * text.length + 7000);

        return () => clearTimeout(timeout2);

    }, [])



    //RENDER
    return (
        <div className="about-page-container">

            <nav>
                <div className="logo">
                    <img id="logo" src="/images/logoNoDecoration.png" alt="site logo"/>
                </div>
                <ul className="navigation">
                    <li>
                        <FontAwesomeIcon icon={faScroll} className='icon'/>{' '}
                        <Link href='/list'><a>List of Huts</a></Link>
                    </li>
                    <li className="current">
                        <FontAwesomeIcon icon={faQuestion} className='icon' />{' '}
                        <Link href='/about'><a className='orange'>About</a></Link>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faLaptop} className='icon' />{' '}
                        <Link href='/controls'><a>Controls</a></Link>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faMapSigns} className='icon' />{' '}
                        <Link href='/map'><a>Map</a></Link>
                    </li>
                </ul>
            </nav>

            <div className="text">
                <p className="paragraph one">
                    {text.substring(0, index)}
                </p>
                <p className={`paragraph two ${paragraph2Shown ? 'shown' : ''}`}>
                    Please take a look around the site and see if you can find a place that appeals to the outdoor you. <Link href='/list'><a className="link">List of Huts...</a></Link>
                </p>
            </div>

        </div>
    )
}



export default about

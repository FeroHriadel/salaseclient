import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScroll } from "@fortawesome/free-solid-svg-icons";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { faLaptop } from "@fortawesome/free-solid-svg-icons";
import { faMapSigns } from "@fortawesome/free-solid-svg-icons";
import Loader from '../components/Loader';


const index = () => {
 
    //RENDER
    return (
        <React.Fragment>

            <Loader />
        
            <div className="landing-page-container">

                <nav>
                    <div className="logo">
                        <img id="logo" src="/images/logo.png" alt="site logo" />
                    </div>
                    <ul className="navigation">
                        <li>
                            <FontAwesomeIcon icon={faScroll} className='icon'/>{' '}
                            <Link href='/list'><a>Huts List</a></Link>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faQuestion} className='icon' />{' '}
                            <Link href='/about'><a>About</a></Link>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faLaptop} className='icon' />{' '}
                            <Link href='/controls'><a>Control Panel</a></Link>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faMapSigns} className='icon' />{' '}
                            <Link href='/map'><a>Map</a></Link>
                        </li>
                    </ul>
                </nav>

                <div className="motto">
                    <div className="word">
                        <span className="up" style={{'--i': 1}}>P</span>
                        <span className="down" style={{'--i': 2}}>L</span>
                        <span className="up" style={{'--i': 3}}>A</span>
                        <span className="down" style={{'--i': 4}}>C</span>
                        <span className="up" style={{'--i': 5}}>E</span>
                        <span className="down" style={{'--i': 6}}>S</span>
                    </div>
                    <div className="word">
                        <span className="down" style={{'--i': 7}}>Y</span>
                        <span className="up" style={{'--i': 8}}>O</span>
                        <span className="down" style={{'--i': 9}}>U</span>
                    </div>
                    <div className="word">
                        <span className="up" style={{'--i': 10}}>J</span>
                        <span className="down" style={{'--i': 11}}>U</span>
                        <span className="down" style={{'--i': 12}}>S</span>
                        <span className="down" style={{'--i': 13}}>T</span>
                    </div>
                    <div className="word">
                        <span className="up" style={{'--i': 14}}>H</span>
                        <span className="down" style={{'--i': 15}}>A</span>
                        <span className="down" style={{'--i': 16}}>V</span>
                        <span className="down" style={{'--i': 17}}>E</span>
                    </div>
                    <div className="word">
                        <span className="up" style={{'--i': 18}}>T</span>
                        <span className="down" style={{'--i': 19}}>O</span>
                    </div>
                    <div className="word">
                        <span className="up" style={{'--i': 20}}>S</span>
                        <span className="down" style={{'--i': 21}}>E</span>
                        <span className="down" style={{'--i': 22}}>E</span>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default index

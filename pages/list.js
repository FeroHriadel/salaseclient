import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { faScroll } from "@fortawesome/free-solid-svg-icons";
import { faQuestion } from "@fortawesome/free-solid-svg-icons";
import { faLaptop } from "@fortawesome/free-solid-svg-icons";
import { faMapSigns } from "@fortawesome/free-solid-svg-icons";




const list = () => {
    return (
        <div className="list-page-container">

            <nav>
                <img src="/images/logo.png" className="logo" alt='site logo' />
                <ul className="navigation">
                    <li className='current'>
                        <FontAwesomeIcon icon={faScroll} className='icon'/>{' '}
                        <Link href='/list'><a className='orange'>List of Huts</a></Link>
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faQuestion} className='icon' />{' '}
                        <Link href='/about'><a>About</a></Link>
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

            <div className="book-container">
                <button className="arrow left"><FontAwesomeIcon icon={faChevronLeft} /></button>
                <button className="arrow right"><FontAwesomeIcon icon={faChevronRight} /></button>
                <div className="book">
                    <div className="back">1</div>
                    <div className="page">2</div>
                    <div className="page">3</div>
                    <div className="page">4</div>
                    <div className="page">
                        <a href="plch.html">Plch</a>
                        <a href="podJarabinou.html">Budy pod Jarabinou</a>
                        <a href="rovne.html">Rovne</a>                 
                    </div>
                    <div className="front">
                        <p>List of Huts in Fatra</p>
                        <p><FontAwesomeIcon icon={faBookOpen} /> open</p>
                    </div>
                </div>
            </div>

        </div>
    )
}



export default list

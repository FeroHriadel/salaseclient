import React from 'react';
import Header from '../components/Header';
import Link from 'next/link';
import Popup from '../components/Popup';



const controls = () => {
    //HTML
    const categoryControls = () => (
        <div className="category-controls">
            <h2>Categories</h2>
            <ul>
                <li>Show categories</li>
                <li>Create a category</li>
                <li>Edit a category</li>
                <li>Delete a category</li>
            </ul>
        </div>
    )



    //RENDER
    return (
        <React.Fragment>

            <Header />

            <div className="controls-container">
                <section className="section">
                    <div className="img-container one">
                        <div className="buttons-container">
                            <div className="search-container">
                                <h2>Search Huts by...</h2>
                                <Link href='/'>
                                    <a>Accessibility</a>
                                </Link>
                                <Link href='/'>
                                    <a>Location</a>
                                </Link>
                                <Link href='/'>
                                    <a>Type</a>
                                </Link>
                            </div>

                            <div className="edit-container">
                                <h2>Edit Content...</h2>
                                <Link href='/huts/addhut'>
                                    <a>Add Hut</a>
                                </Link>
                                <Link href='/'>
                                    <a>Edit Hut</a>
                                </Link>
                                <Link href='/'>
                                    <a>Comment</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className='section'>
                    {categoryControls()}
                </section>
            </div>

        </React.Fragment>
    )
}

export default controls

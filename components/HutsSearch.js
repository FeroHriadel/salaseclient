import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { getLocations } from '../actions/locationActions';
import { getTypes } from '../actions/typeActions';



const HutsSearch = ({ showPopup, values, setValues }) => {
    //GET LOCATIONS
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        getLocations()
            .then(data => {
                if (data.error) {
                    return showPopup(`Searchbar could not load locations`);
                }

                setLocations(data);
            });
    }, []);



    //GET TYPES
    const [types, setTypes] = useState([]);

    useEffect(() => {
        getTypes()
            .then(data => {
                if (data.error) {
                    return showPopup(`Searchbar could not load types`);
                }

                setTypes(data);
            });
    }, []);



    //FORM
      //change handler
    const handleChange = e => {
        setValues({...values, [e.target.name]: e.target.value});
        console.log(values) //
    }



    //RENDER
    return (
        <div className='huts-search-container'>
            <p>
                <FontAwesomeIcon icon={faSearch} className='icon'/>
            </p>

            {
                types.length > 0 && locations.length > 0 
                ?
                    <form>
                        <input type="text" name='searchword' placeholder='search by keyword' onChange={handleChange} />
                        
                        <select name="location" onChange={handleChange}>
                            <option value="">all locations</option>
                            {locations.map(location => (
                                <option key={location._id} value={location._id}>{location.name}</option>
                            ))}
                        </select>

                        <select name="type" onChange={handleChange}>
                            <option value="">all types</option>
                            {types.map(type => (
                                <option key={type._id} value={type._id}>{type.name}</option>
                            ))}
                        </select>

                        <input type="addedby" name='addedby' placeholder='search by user email' onChange={handleChange}/>

                        <select name="sortby" onChange={handleChange}>
                            <option value="">oldest to latest</option>
                            <option value="recent">latest to oldest</option>
                            <option value="alphabetically">alphabetically</option>
                        </select>
                    </form>

                :

                    <p>Searchbar data not loaded...</p>
            }
        </div>
    )
}

export default HutsSearch;

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { getLocations } from '../actions/locationActions';
import { getTypes } from '../actions/typeActions';
import { searchHuts } from '../actions/hutActions';



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



    //API CALL
    const [canMakeCall, setCanMakeCall] = useState(false);

    useEffect(() => {
        if (canMakeCall && values.page <= values.numberOfPages) {
            searchHuts(values.searchword, values.location, values.type, values.addedby, values.sortby, values.page + 1)
                .then(data => {
                    if (data.error) {
                        showPopup(data.error);
                        setCanMakeCall(false);
                    }

                    setValues({...values, ...data, huts: [...values.huts, ...data.huts], loading: false});
                    setCanMakeCall(false);
                })
        }
    }, [canMakeCall])



    //FORM
      //form values
    const [formValues, setFormValues] = useState({
        huts: [],
        loading: true,
        searchword: '',
        location: '',
        type: '',
        addedby: '',
        sortby: '',
        page: 0,
        numberOfPages: 1,
    });
      
      //change handler
    const handleChange = e => {
        setFormValues({...formValues, [e.target.name]: e.target.value});
    }

      //submit handler
    const handleSubmit = (e) => {
        e.preventDefault();
        setValues(formValues);
        setCanMakeCall(true);
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
                    <form onSubmit={handleSubmit}>
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

                        <button type="submit">Search</button>
                    </form>

                :

                    <p>Searchbar data not loaded...</p>
            }
        </div>
    )
}

export default HutsSearch;

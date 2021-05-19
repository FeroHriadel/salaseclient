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
      //form shown?
      const [searchShown, setSearchShown] = useState(false);

      //form fields values
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
                <FontAwesomeIcon icon={faSearch} className='icon' onClick={() => setSearchShown(!searchShown)}/>
            </p>

            {
                types.length > 0 && locations.length > 0 
                ?
                    <form
                         onSubmit={handleSubmit}
                         style={searchShown ? {width: '100%', height: '150px'} : {width: '0%', height: '0px'}}
                    >
                        <input type="text" name='searchword' placeholder='Search by keyword' onChange={handleChange} />
                        
                        <select name="location" onChange={handleChange}>
                            <option value="">All locations</option>
                            {locations.map(location => (
                                <option key={location._id} value={location._id}>{location.name}</option>
                            ))}
                        </select>

                        <select name="type" onChange={handleChange}>
                            <option value="">All types</option>
                            {types.map(type => (
                                <option key={type._id} value={type._id}>{type.name}</option>
                            ))}
                        </select>

                        <select name="sortby" onChange={handleChange}>
                            <option value="">Oldest to Latest</option>
                            <option value="recent">Latest to Oldest</option>
                            <option value="alphabetically">Alphabetically</option>
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
